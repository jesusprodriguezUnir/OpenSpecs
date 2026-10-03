# 06 · Integración con Jira y Azure DevOps

## Principio: no duplicar

- **Backlog (Jira / Azure Boards):** el **qué** de negocio, los criterios de aceptación y el **estado**. Es donde trabaja el Product Owner.
- **Repositorio (OpenSpec):** el **cómo** técnico y la **fuente de verdad del comportamiento**. Es donde trabaja el equipo de desarrollo.

Intentar sincronizar todo en ambos sentidos lleva a divergencias en pocas semanas.

## Mapeo de conceptos

| Backlog | OpenSpec |
|---|---|
| Epic / Feature | Dominio en `openspec/specs/<dominio>/` + varios changes |
| Story / PBI | **Un change** (`openspec/changes/<id>/`) |
| Criterios de aceptación | Scenarios Given/When/Then en la delta spec |
| Bug | Change con requisito MODIFIED (comportamiento correcto) |
| Deuda técnica / refactor | Change sin delta specs (`archive --skip-specs`) |
| Sub-tasks / Tasks | **`tasks.md`** — no duplicarlas en el backlog; elegir una sola fuente |
| Estado (To Do → In Progress → Done) | Derivado de eventos de Git (rama/PR/merge) mediante automatizaciones nativas |

## Convención de nombres (la integración más importante)

- **Nombre del change = nombre de la rama:**
  - Jira: `proj-1234-rechazo-solicitudes-duplicadas`
  - Azure Boards: `ab1234-rechazo-solicitudes-duplicadas`
- **Commits y PR con la clave del ticket:**
  - Jira: `PROJ-1234` (smart commits).
  - Azure DevOps: `AB#1234` (enlace automático al work item).
- **Primera línea de `proposal.md`:** enlace al ticket (forzado mediante `rules.proposal` en `config.yaml`).

## Conectar el agente al backlog (MCP)

### Jira — Atlassian Rovo MCP Server (oficial, remoto)

- Endpoint recomendado: `https://mcp.atlassian.com/v1/mcp/authv2` (OAuth 2.1; cada desarrollador se autentica con su cuenta).
- Endpoint alternativo para API token: `https://mcp.atlassian.com/v1/mcp`.
- El endpoint antiguo `/v1/sse` sigue funcionando pero está desaconsejado.
- Documentación: https://developer.atlassian.com/cloud/rovo-mcp/guides/getting-started/ · https://github.com/atlassian/atlassian-mcp-server
- Da acceso a Jira, Confluence, JSM, Bitbucket y Compass.

### Azure DevOps — servidor MCP de Microsoft

- **Servidor remoto** (GA en 2026): `https://mcp.dev.azure.com/{organizacion}`. Requiere autenticación Entra. **Limitación actual: Claude Code, Claude Desktop, Cursor y ChatGPT no pueden conectarse** porque Entra no soporta todavía el registro dinámico de clientes OAuth. Sí funcionan VS Code/Visual Studio con GitHub Copilot, Copilot CLI y Microsoft Foundry.
- **Servidor local** (el que usaremos con Claude Code): paquete npm `@azure-devops/mcp`, con carga selectiva de dominios (`core`, `work`, `work-items`, `search`, `test-plans`, `repositories`, `wiki`, `pipelines`, `advanced-security`) y autenticación con Azure CLI (`az login`). Microsoft lo mantiene, pero las novedades llegarán antes al remoto.
- Repositorio: https://github.com/microsoft/azure-devops-mcp

Configuración para Claude Code: ver fichero `07-configuracion-claude-code.md`.

## Comando personalizado: del ticket a la propuesta

`/ticket-propose PROJ-1234` (o `AB#1234`) — plantilla completa en `08-plantillas.md`:
1. Lee el ticket vía MCP (solo lectura).
2. Si hay criterios ambiguos, para y pregunta.
3. Ejecuta `/opsx:propose` con el nombre `<clave>-<slug>`, enlazando el ticket y convirtiendo cada criterio en escenario.
4. Presenta un resumen para revisión antes de `apply`.

## Estados del ticket: automatizaciones nativas, no el agente

No delegar en el LLM las transiciones de estado: es poco fiable y deja mala trazabilidad. Usar eventos de Git:

- **Jira Automation:** "Branch created → In Progress", "Pull request merged → Done" (integración con Bitbucket, GitHub o Azure Repos).
- **Azure DevOps:** con `AB#1234` en la PR, activar la opción de completar los work items enlazados al completar la PR.

Como mucho, permitir al agente **comentar** en el ticket el enlace a la propuesta, con permisos mínimos.

## Validación en la pipeline (Azure Pipelines)

```yaml
trigger: none
pool: { vmImage: ubuntu-latest }
steps:
  - task: NodeTool@0
    inputs: { versionSpec: '22.x' }
  - script: npm i -g @fission-ai/openspec@1.13.0
    displayName: Install OpenSpec
  - script: openspec validate --all --strict --no-interactive
    displayName: Validate specs
    env: { OPENSPEC_TELEMETRY: '0' }
```

- Con **Azure Repos**, el trigger `pr:` del YAML no aplica: registrar la pipeline como **Build Validation** en la branch policy de `main`.
- **Fijar la versión** de OpenSpec (no `@latest`) para builds reproducibles.
- **Regla opcional:** fallar si la PR modifica `src/` sin tocar `openspec/changes/`, salvo etiqueta `no-spec` (hotfix, configuración). Definir la excepción desde el primer día.
- Con Jira + Bitbucket/GitHub, el paso es equivalente en Bitbucket Pipelines o GitHub Actions.

## Riesgos específicos de la integración

- **RGPD:** los tickets pueden contener datos personales (capturas, DNI, emails de alumnos) que el MCP enviaría al modelo. Revisar con el DPO antes de conectar.
- **Tokens:** permisos mínimos y solo lectura al principio; nunca secretos en `.mcp.json` versionado.
- **Divergencia:** si el equipo edita criterios en el ticket después de aprobar la propuesta, hay que actualizar el change (o crear uno nuevo).
