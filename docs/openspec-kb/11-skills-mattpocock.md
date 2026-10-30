# 11 · Skills de Matt Pocock: qué aportan a nuestro flujo OpenSpec

> Repositorio: https://github.com/mattpocock/skills · Web: https://aihero.dev/skills · Licencia MIT
> Estado contrastado a 25/10/2026. Repositorio muy activo: revisar `CHANGELOG.md` antes de adoptar una skill concreta.

## Qué es

Colección de *agent skills* (carpetas con `SKILL.md`) que Matt Pocock usa a diario para "ingeniería real, no vibe coding". Son pequeñas, componibles, agnósticas de modelo y pensadas para adaptarse. Funcionan con Claude Code, Codex, Copilot, Gemini CLI, Cursor, etc.

Su autor se posiciona explícitamente **contra los frameworks que "se adueñan del proceso"** (cita GSD, BMAD y Spec Kit): prefiere piezas sueltas que el equipo controla. Es decir, **no es un competidor de OpenSpec**, sino una caja de herramientas que se puede enchufar alrededor de él.

### Dos tipos de skill

| Tipo | Quién la invoca | Rol |
|---|---|---|
| **User-invoked** | Solo el usuario (`/grill-me`, `/to-spec`…) | Orquestan un flujo |
| **Model-invoked** | El usuario o el agente cuando encaja | Contienen la disciplina reutilizable (`tdd`, `code-review`…) |

Regla interna: una user-invoked puede llamar a model-invoked, nunca a otra user-invoked.

## Catálogo resumido

### Engineering

| Skill | Tipo | Qué hace |
|---|---|---|
| `setup-matt-pocock-skills` | user | Configura el repo: issue tracker, etiquetas de triage y ubicación de docs de dominio (`docs/agents/*.md` + bloque `## Agent skills` en `CLAUDE.md`) |
| `grill-with-docs` | user | Sesión de "interrogatorio" que además construye el lenguaje de dominio (`GLOSSARY.md`) y ADRs |
| `to-spec` | user | Sintetiza la conversación en una spec (problema, solución, historias de usuario, decisiones, tests, fuera de alcance) y la **publica en el issue tracker** |
| `to-tickets` | user | Divide un plan/spec en tickets *tracer-bullet* con dependencias de bloqueo |
| `implement` / `implement-spec` | user | Implementa una spec/tickets usando `/tdd` y cerrando con `/code-review`; la segunda paraleliza con subagentes |
| `wayfinder` | user | Planifica trabajo que no cabe en una sesión como mapa de tickets de decisión |
| `triage` | user | Mueve issues por una máquina de estados de triage |
| `improve-codebase-architecture` | user | Escanea el código buscando oportunidades de "módulos profundos" (Ousterhout) e informe HTML |
| `retro` | user | Tras una sesión, propone mejoras del entorno del agente (checks, steering files, tooling) |
| `ask-matt` | user | Router: qué skill usar en cada situación |
| `tdd` | model | Red-green-refactor por rebanadas verticales, con criterios de buen/mal test |
| `diagnosing-bugs` | model | Bucle disciplinado: reproducir en rojo → minimizar → hipótesis → instrumentar → arreglar → test de regresión |
| `code-review` | model | Revisión en dos ejes en subagentes paralelos: **Standards** (convenciones + code smells de Fowler) y **Spec** (¿implementa fielmente la spec/issue?) |
| `domain-modeling` | model | Afina el modelo de dominio y el glosario contra casos límite |
| `codebase-design` | model | Vocabulario de diseño de módulos profundos y seams testeables |
| `prototype` | model | Prototipos desechables para resolver una duda de diseño |
| `research` | model | Investiga en fuentes primarias y deja un Markdown citado en el repo |
| `pr` | model | Forma del cuerpo de una PR: resumen visual, evidencias antes/después, riesgo de merge (puerta de un sentido o dos, radio de impacto) |
| `wizard` | model | Genera un asistente bash para pasos que solo puede hacer una persona (credenciales, infraestructura, migraciones) |

### Productivity

`grill-me` (interrogatorio genérico), `handoff` (compacta la conversación para que otro agente continúe), `teach`, `to-questionnaire`, `wait-what`, y las model-invoked `grilling` y `writing-for-agents` (cómo escribir `CLAUDE.md`/skills para agentes).

## Mapeo con nuestro flujo OpenSpec

| Fase de nuestro flujo (fichero 05) | Skill útil | Cómo encaja | Veredicto |
|---|---|---|---|
| Antes de `/opsx:propose` | `grill-with-docs` / `grill-me` | Sustituye o complementa a `/opsx:explore` para cerrar ambigüedades del ticket **antes** de redactar specs | **Adoptar** |
| Contexto de dominio | `domain-modeling` + `GLOSSARY.md` | Encaja con el glosario de `openspec/config.yaml` | **Adoptar con ajuste**: una sola fuente de glosario (ver abajo) |
| Propuesta | `to-spec` | Solapa con `/opsx:propose` y publica en el tracker | **No usar**: rompe "el qué en el backlog, el cómo en Git" |
| Desglose | `to-tickets` | Solapa con `tasks.md` | **No usar** (duplicaría sub-tasks; fichero 06) |
| Implementación | `tdd` | Refuerza `/opsx:apply`: cada Scenario → test en rojo primero | **Adoptar** |
| Bugfix (receta 2) | `diagnosing-bugs` | Encaja con bugs como MODIFIED: el test de regresión es el Scenario | **Adoptar** |
| Verificación | `code-review` (eje Spec) | Complementa al subagente `spec-verifier` y a `/opsx:verify` | **Probar** en piloto y comparar |
| PR | `pr` | Mejora la plantilla de PR (riesgo de merge, evidencias) | **Inspirarse**: fusionar con nuestra plantilla (fichero 08) |
| Retrospectiva | `retro` | Alimenta mejoras de `CLAUDE.md`, hooks y reglas | **Adoptar** (encaja con el rol de Scrum Master) |
| Deuda técnica | `improve-codebase-architecture` | Genera candidatos de refactor → changes con `--skip-specs` | **Adoptar** periódicamente |
| Sesiones largas | `handoff` | Útil con cambios grandes (receta 6) o al cambiar de worktree | Opcional |
| Escritura de contexto | `writing-for-agents` | Para redactar `CLAUDE.md`, `config.yaml` y skills propias | **Adoptar** |

## Conflictos a resolver antes de instalar

1. **Dos glosarios.** Las skills mantienen `GLOSSARY.md` (antes `CONTEXT.md`) y ADRs en `docs/adr/`; nosotros tenemos el glosario en `openspec/config.yaml → context`. Recomendación: el glosario vive en `GLOSSARY.md` en la raíz y `config.yaml` lo referencia ("Usar la terminología de GLOSSARY.md"). Así lo consumen ambos mundos sin duplicar.
2. **Issue tracker.** El setup solo trae plantillas para GitHub, GitLab y Markdown local. Para Jira/Azure DevOps hay que elegir **"Other"** y describir el flujo en prosa (`docs/agents/issue-tracker.md`): "lectura vía MCP, nunca escritura; los estados los mueven automatizaciones nativas".
3. **Dos "specs".** La "spec" de `to-spec` (PRD con historias de usuario) no es una spec OpenSpec (requisitos SHALL + escenarios). No mezclar terminología en el equipo: en nuestro repo, *spec* = OpenSpec.
4. **`implement` vs `/opsx:apply`.** Elegir uno. Recomendación: `/opsx:apply` (marca `tasks.md`) y que `CLAUDE.md` indique "durante apply, usa la disciplina de la skill `tdd`".
5. **Etiquetas de triage** (`ready-for-agent`, etc.): solo si se usa `triage`; en Jira/ADO no aportan frente al flujo de estados existente.

## Instalación recomendada para el equipo

Dos vías oficiales:

| Vía | Comando | Actualización | Para nosotros |
|---|---|---|---|
| Plugin de Claude Code | `claude plugin install mattpocock-skills@claude-plugins-official` | Automática | Cómodo para uso personal; **no** para el repo del equipo |
| Ficheros editables | `npx skills@latest add mattpocock/skills -a claude-code` (elegir skills) | Manual (`npx skills@latest update`) | **Recomendada** |

Motivos para la vía editable en proyectos del equipo:

- **Reproducibilidad y supply chain:** una skill auto-actualizada cambia el comportamiento del agente sin pasar por PR. Con ficheros versionados en `.claude/skills/`, cada cambio de skill se revisa como código.
- **Adaptación:** el autor anima a modificarlas; podemos ajustar `tdd` a xUnit + FluentAssertions + Testcontainers y Jest.
- **Selección:** instalar solo las que adoptamos (no todo el catálogo) para no saturar el contexto ni tener comandos que compitan con `/opsx:*`. No instalar plugin y ficheros a la vez (duplica las skills).

Selección inicial propuesta: `grill-with-docs`, `grilling`, `domain-modeling`, `tdd`, `diagnosing-bugs`, `code-review`, `retro`, `writing-for-agents`, `improve-codebase-architecture`, `setup-matt-pocock-skills`.

## Encaje en el plan de adopción (fichero 09)

- **Fase 1 (piloto manual):** solo `grill-with-docs` y `tdd`. Medir si reducen iteraciones en la revisión de la propuesta.
- **Fase 3 (automatización):** `code-review` (eje Spec) junto a `spec-verifier`; quedarse con el que detecte más huecos reales.
- **Retros de sprint:** ejecutar `retro` sobre una sesión representativa y convertir sus hallazgos en cambios de `CLAUDE.md`/hooks vía PR.

## Prompts útiles para el cuaderno

- "¿Qué skill de Matt Pocock usaría antes de /opsx:propose para un ticket ambiguo?"
- "¿Por qué no usamos to-spec ni to-tickets con OpenSpec?"
- "Diferencia entre spec-verifier y la skill code-review."
