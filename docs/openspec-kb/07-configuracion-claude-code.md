# 07 · Configuración de Claude Code para OpenSpec

## Estructura versionada en el repositorio

```
.claude/
├── commands/opsx/…               # generados por openspec init (no editar)
├── commands/ticket-propose.md    # comando propio: ticket → propuesta
├── agents/spec-verifier.md       # subagente de verificación independiente
└── settings.json                 # permisos, hooks y variables de entorno
.mcp.json                         # servidores MCP (Jira / Azure DevOps), sin secretos
CLAUDE.md                         # stack y convenciones de código
openspec/config.yaml              # contexto de dominio y reglas de specs
```

Todo se versiona para que el equipo trabaje igual. Las preferencias personales van en `.claude/settings.local.json` (no versionado).

## Reparto de contexto: CLAUDE.md vs config.yaml

| Fichero | Cuándo se usa | Qué poner |
|---|---|---|
| `CLAUDE.md` | Siempre, en toda la sesión | Stack, arquitectura, convenciones de código, comandos de build/test, reglas del repo |
| `openspec/config.yaml` | Al generar artefactos OpenSpec | Glosario de dominio, reglas de proposal/specs/design/tasks |

Regla clave en `CLAUDE.md`: **"Nunca edites `openspec/specs/` directamente; solo cambia mediante `/opsx:archive`."**

## Servidores MCP (`.mcp.json`, ámbito proyecto)

```json
{
  "mcpServers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp/authv2"
    },
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "${ADO_ORG}",
               "-d", "core", "work", "work-items", "repositories",
               "--authentication", "azcli"]
    }
  }
}
```

- Jira: autenticación OAuth desde `/mcp` dentro de Claude Code; sin tokens en el repo.
- Azure DevOps: servidor **local** (el remoto no admite todavía Claude Code). Requiere `az login` y la variable de entorno `ADO_ORG`.
- Usar solo el servidor que corresponda al proyecto.

## Permisos, variables y hooks (`.claude/settings.json`)

```json
{
  "env": { "OPENSPEC_TELEMETRY": "0" },
  "permissions": {
    "allow": [
      "Bash(openspec list:*)", "Bash(openspec show:*)", "Bash(openspec validate:*)",
      "Bash(dotnet build:*)", "Bash(dotnet test:*)", "Bash(npm run test:*)"
    ],
    "ask": ["Bash(openspec archive:*)", "Bash(git push:*)"],
    "deny": ["Read(./**/appsettings.Production.json)", "Read(./.env*)"]
  },
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "openspec validate --all --strict --no-interactive 1>&2 || exit 2"
      }]
    }]
  }
}
```

- **Hook `Stop`:** cuando Claude termina un turno se validan las specs; si fallan, el código de salida 2 impide finalizar y devuelve los errores a Claude para que los corrija. Validación local sin esperar a la pipeline.
- **Tools de escritura del MCP:** consultar sus nombres con `/mcp` y añadirlas a `deny` (actualizar work items, transicionar issues…). El agente lee el backlog pero no lo modifica.

## Modelos por fase

| Fase | Modelo | Cómo fijarlo |
|---|---|---|
| Explore / Propose | `opus` | `model: opus` en el frontmatter de `/ticket-propose`; plan mode (Shift+Tab) para explorar |
| Apply | `sonnet` | `/model sonnet` — más rápido y barato; suficiente si `tasks.md` es bueno |
| Verify | `opus` en subagente | Contexto limpio: no se autojustifica |
| Archive | cualquiera | Operación casi mecánica |

Usar alias (`opus`, `sonnet`) en lugar de versiones concretas para que la configuración no caduque.

## Subagente verificador

Fichero `.claude/agents/spec-verifier.md` (plantilla en `08-plantillas.md`). Revisa, sin modificar nada, que cada Requirement/Scenario del change tenga código y test, ejecuta los tests y detecta tareas marcadas como hechas que no lo están. Complementa a `/opsx:verify`.

Invocación: "Usa el subagente spec-verifier sobre el cambio proj-1234-rechazo-duplicados".

## Acceso y licencias

- **Claude Team / Enterprise:** incluye puestos de Claude Code. Lo más sencillo para el piloto.
- **Claude vía Microsoft Foundry (Azure):** alternativa si se prefiere facturar por el contrato de Azure y mantener el tratamiento de datos en el tenant. Claude Code admite proveedores alternativos (Foundry, Bedrock, Vertex); verificar la configuración vigente en la documentación de Claude Code.
- Validar con el DPO el tratamiento de código y tickets con datos personales.

## Automatización futura en CI

Una vez asentado el flujo: ejecutar Claude Code en modo no interactivo (`claude -p`) en Azure Pipelines con el prompt del `spec-verifier` y publicar el resultado como comentario en la PR. No en el primer sprint: medir antes el valor de la revisión humana y el coste en tokens por PR.

## Entorno de desarrollo

- **Terminal** o **extensión de VS Code** (útil también para Angular). Los comandos `/opsx:*`, el `.mcp.json` y el `settings.json` funcionan igual en ambos.
- Para cambios en paralelo: git worktrees, una sesión de Claude Code por worktree.
