# 03 · Instalación y estructura del proyecto

## Requisitos

- Node.js **20.19.0 o superior** (recomendado Node 22 LTS).
- Un asistente de IA compatible. En nuestro caso: **Claude Code** (terminal o extensión de VS Code).
- Git.

## Instalación

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

También se puede instalar con pnpm, bun, yarn o nix.

En entornos corporativos, desactivar la telemetría (solo recoge nombre de comando y versión, pero conviene desactivarla):

```bash
openspec config set telemetry.enabled false
# o bien variables de entorno:
# OPENSPEC_TELEMETRY=0   o   DO_NOT_TRACK=1
```

En CI la telemetría se desactiva automáticamente.

## Inicializar un repositorio

```bash
cd MiSolucion
openspec init
```

Durante `init` se elige la herramienta de IA (seleccionar **Claude Code**). OpenSpec genera:

- La carpeta `openspec/` con la estructura base.
- Los comandos y/o skills de la herramienta (para Claude Code, dentro de `.claude/`).

Para actualizar los comandos generados tras subir de versión: `openspec update`. **No editar a mano los comandos generados**: se sobrescriben.

## Estructura resultante

```
MiSolucion/
├── .claude/                     # comandos/skills de OpenSpec para Claude Code
├── openspec/
│   ├── config.yaml              # contexto y reglas (opcional pero muy recomendable)
│   ├── specs/                   # FUENTE DE VERDAD, por dominio
│   │   ├── solicitudes/spec.md
│   │   └── autenticacion/spec.md
│   └── changes/                 # cambios en curso
│       ├── proj-1234-rechazo-duplicados/
│       │   ├── proposal.md
│       │   ├── specs/solicitudes/spec.md   # delta spec
│       │   ├── design.md
│       │   └── tasks.md
│       └── archive/             # cambios completados
└── src/ …
```

### Qué es cada artefacto de un cambio

| Artefacto | Contenido | Quién lo revisa |
|---|---|---|
| `proposal.md` | Intención, alcance, enfoque, enlace al ticket | PO / Tech Lead |
| `specs/` (delta) | Requisitos ADDED / MODIFIED / REMOVED con escenarios | Equipo (clave en la revisión) |
| `design.md` | Decisiones técnicas y arquitectónicas | Tech Lead / arquitecto |
| `tasks.md` | Checklist de implementación con progreso | Desarrollador |

## `openspec/config.yaml`

Permite fijar el schema por defecto, inyectar contexto en todos los artefactos y definir reglas por tipo de artefacto:

```yaml
schema: spec-driven

context: |
  Dominio: gestión académica (expedientes, solicitudes, titulaciones).
  Glosario: "expediente" = registro académico de un alumno; "solicitud" = trámite iniciado por el alumno.
  Las APIs públicas deben mantener compatibilidad hacia atrás.

rules:
  proposal:
    - Primera línea: enlace al ticket de origen (Jira PROJ-XXXX o Azure Boards AB#XXXX)
    - Incluir impacto en base de datos y plan de rollback
  specs:
    - Formato Given/When/Then
    - Cada criterio de aceptación del ticket tiene al menos un Scenario
  design:
    - Referenciar patrones existentes antes de proponer nuevos
  tasks:
    - Cada tarea incluye su test asociado; migraciones en tarea separada
```

- `context` se aplica a **todos** los artefactos.
- `rules` solo se aplica al artefacto correspondiente.
- Reparto recomendado: stack y convenciones de código en `CLAUDE.md` (se carga siempre); dominio y reglas de specs en `config.yaml`. Evitar duplicar.

## Comandos de terminal (CLI)

| Comando | Uso |
|---|---|
| `openspec init` | Inicializa el repositorio |
| `openspec update` | Regenera comandos tras actualizar la versión |
| `openspec list` | Lista cambios activos |
| `openspec show <cambio>` | Detalle de un cambio |
| `openspec validate [<cambio>]` | Valida estructura y formato (`--all`, `--strict`, `--no-interactive`) |
| `openspec view` | Dashboard interactivo |
| `openspec archive <cambio> [--skip-specs]` | Archiva un cambio (con `--skip-specs` para refactors) |
| `openspec config profile` | Cambia el perfil de comandos (core / ampliado) |
| `openspec schema fork/init/validate/which` | Gestión de schemas personalizados |

Comprobar los flags exactos en `docs/cli.md` para la versión instalada.

## Schemas personalizados (avanzado)

```bash
openspec schema fork spec-driven mi-flujo      # partir del schema por defecto
openspec schema init rapido --artifacts "proposal,tasks"
openspec schema validate mi-flujo
openspec new change mi-cambio --schema mi-flujo
```

Útil, por ejemplo, para añadir un artefacto ADR o para un flujo reducido (solo proposal + tasks) en cambios menores. No recomendable hasta dominar el schema por defecto.
