# 08 · Plantillas listas para copiar

Adaptar nombres de proyecto, rutas y convenciones antes de usarlas.

## 1. CLAUDE.md (raíz del repositorio)

```markdown
# Contexto del proyecto

## Stack
- Backend: .NET 8, ASP.NET Core Web API, Clean Architecture (Api / Application / Domain / Infrastructure)
- Persistencia: EF Core + SQL Server, migraciones code-first
- Mensajería: RabbitMQ (consumidores idempotentes, patrón outbox)
- Frontend: Angular (standalone components, signals)
- Tests: xUnit + FluentAssertions + Testcontainers; Angular con Jest

## Comandos
- Build: `dotnet build`
- Tests backend: `dotnet test`
- Tests frontend: `npm run test` (desde /src/Web)

## Convenciones
- Casos de uso en Application con MediatR; validación con FluentValidation.
- Errores de negocio con códigos estables (p. ej. SOLICITUD_DUPLICADA), mapeados a ProblemDetails.
- Nada de lógica de negocio en controladores.
- Cada migración de EF Core en un commit propio.

## Spec-driven development (OpenSpec)
- Todo cambio de comportamiento pasa por un change de OpenSpec (/opsx:propose).
- NUNCA edites openspec/specs/ directamente: solo cambia mediante /opsx:archive.
- Cada Scenario de una spec debe tener un test automatizado.
- Nombre del change = nombre de la rama = <clave-ticket>-<slug>.
```

## 2. openspec/config.yaml

```yaml
schema: spec-driven

context: |
  Dominio: gestión académica (expedientes, solicitudes, titulaciones).
  Glosario:
    - expediente: registro académico de un alumno
    - solicitud: trámite iniciado por el alumno
  Las APIs públicas mantienen compatibilidad hacia atrás.

rules:
  proposal:
    - Primera línea: enlace al ticket de origen (Jira PROJ-XXXX o Azure Boards AB#XXXX)
    - No reescribir el porqué de negocio; resumirlo y enlazar el ticket
    - Incluir impacto en base de datos y plan de rollback
    - Identificar contratos de API o eventos afectados (breaking o no)
  specs:
    - Formato Given/When/Then; un escenario por regla de negocio y por caso de error
    - Cada criterio de aceptación del ticket tiene al menos un Scenario
    - Si un criterio es ambiguo, registrarlo como pregunta abierta en proposal.md, no inventarlo
  design:
    - Referenciar patrones existentes antes de proponer nuevos
  tasks:
    - Cada tarea incluye su test asociado
    - Migraciones de base de datos en tarea separada
```

## 3. Comando .claude/commands/ticket-propose.md

```markdown
---
description: Crea un cambio OpenSpec a partir de un ticket de Jira o Azure Boards
argument-hint: <PROJ-1234 | AB#1234>
model: opus
---
1. Lee el ticket $ARGUMENTS con el MCP correspondiente (título, descripción,
   criterios de aceptación, enlaces). Solo lectura: no modifiques el ticket.
2. Si hay criterios ambiguos o contradictorios, lístalos y PARA; pregúntame antes de seguir.
3. Ejecuta /opsx:propose con el nombre `<clave-ticket-en-minúsculas>-<slug-kebab-case>`.
   - proposal.md: enlace al ticket en la primera línea.
   - specs: al menos un Scenario por criterio de aceptación.
4. Muéstrame un resumen de proposal.md y de las delta specs para revisión antes de /opsx:apply.
```

## 4. Subagente .claude/agents/spec-verifier.md

```markdown
---
name: spec-verifier
description: Verifica de forma independiente que la implementación de un cambio OpenSpec cumple sus specs. Úsalo después de /opsx:apply y antes de abrir la PR.
tools: Read, Grep, Glob, Bash
model: opus
---
No modifiques ningún fichero.
1. Lee openspec/changes/<cambio>/ (proposal, specs, tasks).
2. Para cada Requirement y Scenario, localiza el código que lo implementa y el test que lo cubre.
3. Ejecuta `dotnet test` sobre los proyectos afectados.
4. Devuelve:
   - Tabla: Requirement | Scenario | Código | Test | Estado (cubierto / parcial / sin cubrir)
   - Tareas marcadas [x] en tasks.md que no están realmente implementadas
   - Riesgos detectados (breaking changes, migraciones, seguridad)
```

## 5. Azure Pipelines — validación de specs

```yaml
# azure-pipelines.openspec.yml  (registrar como Build Validation en la policy de main)
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

## 6. Plantilla de Pull Request

```markdown
## Ticket
PROJ-1234 / AB#1234

## Change OpenSpec
`openspec/changes/archive/<fecha>-proj-1234-...` (o `no-spec` justificado)

## Checklist
- [ ] Propuesta y delta specs revisadas antes de implementar
- [ ] Cada Scenario tiene test automatizado
- [ ] spec-verifier sin elementos "sin cubrir"
- [ ] Change archivado en esta PR (specs/ actualizado)
- [ ] Pipeline verde (openspec validate + build + tests)
- [ ] Migraciones revisadas y con plan de rollback (si aplica)
```

## 7. Plantilla de ticket (Story / PBI) compatible con OpenSpec

```markdown
**Como** <rol> **quiero** <objetivo> **para** <beneficio>

**Criterios de aceptación**
1. Dado <contexto>, cuando <acción>, entonces <resultado>
2. Dado <contexto>, cuando <acción errónea>, entonces <error esperado>

**Fuera de alcance**
- …

**Notas** (sin datos personales reales)
```

Redactar los criterios ya en Given/When/Then facilita que el agente los convierta en escenarios sin interpretar.
