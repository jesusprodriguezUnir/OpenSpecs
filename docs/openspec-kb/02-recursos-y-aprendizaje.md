# 02 · Recursos y ruta de aprendizaje

## Documentación oficial (prioridad alta)

El manual real está en la carpeta `docs/` del repositorio: https://github.com/Fission-AI/OpenSpec/tree/main/docs

| Documento | Ruta | Por qué leerlo |
|---|---|---|
| Getting Started | `docs/getting-started.md` | Instalación, estructura y primer ciclo |
| Core Concepts | `docs/overview.md` | Modelo mental: specs, changes, deltas |
| Existing Projects | `docs/existing-projects.md` | **Clave para nosotros**: adopción en proyectos existentes |
| Examples & Recipes | `docs/examples.md` | Recetas: feature, bugfix, refactor, cambios paralelos |
| Workflows | `docs/workflows.md` | Flujos avanzados |
| Explore First | `docs/explore.md` | Uso de `/opsx:explore` |
| How Commands Work | `docs/how-commands-work.md` | Qué hace cada comando internamente |
| Commands | `docs/commands.md` | Referencia de comandos de chat |
| CLI | `docs/cli.md` | Referencia de comandos de terminal |
| Editing Changes | `docs/editing-changes.md` | Cómo iterar sobre una propuesta |
| Customization | `docs/customization.md` | `config.yaml` y schemas personalizados |
| Stores (Beta) | `docs/stores-beta/user-guide.md` | Specs compartidas entre varios repositorios |
| Supported Tools | `docs/supported-tools.md` | Herramientas compatibles |
| FAQ / Troubleshooting / Glossary | `docs/faq.md`, `docs/troubleshooting.md`, `docs/glossary.md` | Consulta |

Otros recursos del repositorio:

- Schema por defecto `spec-driven`: https://github.com/Fission-AI/OpenSpec/tree/main/schemas/spec-driven
- El propio proyecto se desarrolla con OpenSpec (ejemplo real): https://github.com/Fission-AI/OpenSpec/tree/main/openspec
- Comunidad en Discord: https://discord.gg/YctCnvvshC

## Recursos de la comunidad

- **intent-driven.dev** — https://intent-driven.dev/knowledge/openspec/ — el recurso externo más completo: playlist de vídeos, diagramas, integración con Linear vía MCP, git worktrees para cambios paralelos, schema con ADRs, artículos sobre TDD/BDD y revisión multi-modelo.
- **Linear MCP + OpenSpec** — https://intent-driven.dev/blog/2026/01/11/linear-mcp-openspec-sdd-workflow/ — patrón "el qué en el backlog, el cómo en Git", extrapolable a Jira/Azure DevOps.
- **Mapping OpenSpec to Jira** — https://www.rushis.com/mapping-openspec-to-jira-sdd-without-abandoning-your-backlog/
- **Deep dive de arquitectura** — https://redreamality.com/garden/notes/openspec-guide/
- **openspec-mcp** (servidor MCP de la comunidad con dashboard y aprobaciones) — https://github.com/Lumiaqian/openspec-mcp

## Vídeos (YouTube)

- Getting Started with OpenSpec — Setup Tutorial: https://www.youtube.com/watch?v=raPTOBUpc3M
- Build with OpenSpec: Spec-Driven Development in Claude Code: https://www.youtube.com/watch?v=FpBYgYyU-SE
- Spec-Driven Development: GitHub Spec Kit & OpenSpec Explained: https://www.youtube.com/watch?v=C-TzYCEHXZc
- Spec-Driven Development for AI Agents: I Tried OpenSpec and Others: https://www.youtube.com/watch?v=d3Glwdf_xA8
- OpenSpec GitHub Tutorial: https://www.youtube.com/watch?v=mNlXDfAa22k
- The OpenSpec Tutorial Every Developer Needs: https://www.youtube.com/watch?v=OdYZFDBHLk4

**Aviso sobre tutoriales antiguos:** las versiones anteriores a la 1.x usaban comandos y ficheros distintos (por ejemplo `/openspec:proposal` o `project.md`). Los actuales son `/opsx:*` y `openspec/config.yaml`. Ante cualquier discrepancia, manda la carpeta `docs/` del repositorio.

## Ruta de aprendizaje recomendada (≈ 1 semana, a ratos)

| Día | Actividad | Resultado |
|---|---|---|
| 1 | Leer `getting-started.md` y `overview.md`; ver un vídeo de setup | Modelo mental claro |
| 2 | Instalar y ejecutar `openspec init` en un repo de pruebas; ejecutar `/opsx:onboard` | Primer ciclo completo guiado |
| 3 | Leer `existing-projects.md` y `examples.md` | Saber aplicar las recetas |
| 4 | Escribir `config.yaml` real para un proyecto del equipo | Contexto de calidad para la IA |
| 5 | Primer cambio real y pequeño (bugfix o endpoint) sobre un proyecto existente | Experiencia práctica y feedback |
