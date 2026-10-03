# 01 · Qué es OpenSpec

## Definición

OpenSpec es un framework ligero y de código abierto (licencia MIT, desarrollado por Fission-AI) para hacer **spec-driven development (SDD)** con asistentes de IA de programación. Su objetivo es que humanos y agentes de IA se pongan de acuerdo sobre **qué** hay que construir antes de escribir código, y que ese acuerdo quede versionado en el repositorio.

- Web: https://openspec.dev
- Repositorio: https://github.com/Fission-AI/OpenSpec
- Versión de referencia en este cuaderno: v1.13.0
- Requisito: Node.js 20.19.0 o superior

## El problema que resuelve

Sin especificaciones, el trabajo con agentes de IA se basa en prompts vagos y produce resultados impredecibles: el agente "rellena huecos" con suposiciones, el conocimiento se pierde en el historial del chat y nadie puede revisar la intención antes de ver el código.

OpenSpec introduce un paso intermedio y revisable: el agente redacta una **propuesta de cambio** (qué, por qué, cómo y lista de tareas) que el equipo revisa y aprueba **antes** de implementar.

## Principios

1. **Specs como fuente de verdad.** `openspec/specs/` describe cómo se comporta el sistema hoy, organizado por dominios.
2. **Cambios como deltas.** Cada cambio vive en su carpeta dentro de `openspec/changes/` y solo describe lo que añade, modifica o elimina.
3. **Brownfield-first.** No hay que documentar todo el sistema antes de empezar: solo se escriben specs de lo que se va a cambiar. La documentación crece de forma natural con el trabajo real.
4. **Ligero e iterativo.** Sin fases rígidas ni ceremonias pesadas; los artefactos se pueden editar en cualquier momento.
5. **Agnóstico de herramienta.** Funciona con más de 30 asistentes: Claude Code, GitHub Copilot, Cursor, Codex, Gemini CLI, OpenCode, Windsurf, Kiro, Cline, Amazon Q Developer, etc.
6. **Todo en Git.** Specs y cambios se versionan junto al código y se revisan en las PR.

## Cómo funciona (visión general)

```
openspec/
├── config.yaml          # contexto y reglas para la IA
├── specs/<dominio>/     # fuente de verdad: comportamiento actual
└── changes/<cambio>/    # propuesta de cambio en curso
    ├── proposal.md      # por qué y alcance
    ├── specs/           # delta specs (ADDED / MODIFIED / REMOVED)
    ├── design.md        # decisiones técnicas
    └── tasks.md         # checklist de implementación
```

Ciclo básico con comandos en el chat del agente:

`/opsx:explore` → `/opsx:propose` → *(revisión humana)* → `/opsx:apply` → `/opsx:verify` → `/opsx:archive`

Al archivar, las delta specs se fusionan en `openspec/specs/` y el cambio pasa a `openspec/changes/archive/`.

## Comparativa con alternativas

| Herramienta | Enfoque | Puntos fuertes | Limitaciones |
|---|---|---|---|
| **OpenSpec** | Ligero, deltas, brownfield-first | Agnóstico de herramienta y modelo; poca ceremonia; ideal para código existente | Menos guiado que Spec Kit en proyectos desde cero |
| **GitHub Spec Kit** | Fases rígidas (constitution, specify, plan, tasks) | Muy exhaustivo | Pesado; mucha configuración Markdown; dependencias Python; orientado a greenfield |
| **Kiro (AWS)** | IDE con specs integradas | Experiencia integrada | Atado a su IDE y a sus modelos |
| **Sin specs** | Prompts directos | Rápido para prototipos | Resultados impredecibles; sin trazabilidad |

**Recomendación para nuestros proyectos:** OpenSpec, porque trabajamos sobre aplicaciones existentes (.NET Core + Angular) y queremos integrarlo en el flujo Scrum sin añadir burocracia.

## Qué NO es OpenSpec

- No es un generador de código: el código lo genera el agente (Claude Code en nuestro caso).
- No sustituye al backlog (Jira / Azure Boards): el backlog guarda el *qué* de negocio y el estado; OpenSpec guarda el *cómo* técnico y el comportamiento del sistema.
- No sustituye a los tests: los escenarios de las specs deben traducirse en tests automatizados.
