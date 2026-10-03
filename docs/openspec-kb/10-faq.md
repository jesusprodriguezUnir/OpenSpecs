# 10 · Preguntas frecuentes

**¿Tengo que documentar todo el sistema antes de empezar?**
No. OpenSpec está pensado para proyectos existentes: solo se escriben specs de lo que se va a cambiar. La documentación crece con cada change archivado.

**¿Qué diferencia hay entre `openspec/specs` y `openspec/changes`?**
`specs/` describe cómo se comporta el sistema hoy (fuente de verdad). `changes/` contiene propuestas en curso, expresadas como deltas (ADDED / MODIFIED / REMOVED). Al archivar un change, sus deltas se fusionan en `specs/`.

**¿Cuándo se archiva un change?**
Antes del merge, dentro de la misma PR, para que código y specs entren juntos en `main`.

**¿Qué pasa con los refactors que no cambian comportamiento?**
Se crea un change con propuesta y tareas, sin delta specs, y se archiva con `openspec archive <cambio> --skip-specs`.

**¿Y los bugs?**
Se proponen como comportamiento correcto con un requisito MODIFIED. El bug queda documentado y protegido por un test.

**¿Qué modelos de IA puedo usar?**
OpenSpec es agnóstico: depende de la herramienta. Con Claude Code usamos Claude: `opus` para explorar, proponer y verificar; `sonnet` para implementar.

**¿Funciona con Jira y con Azure DevOps?**
Sí. El backlog guarda el qué y el estado; OpenSpec el cómo. El agente lee los tickets vía MCP (Atlassian Rovo MCP para Jira; servidor local `@azure-devops/mcp` para Azure DevOps con Claude Code). Los estados se actualizan con automatizaciones nativas basadas en eventos de Git.

**¿Por qué no uso el MCP remoto de Azure DevOps con Claude Code?**
Porque el remoto autentica con Entra, que aún no soporta el registro dinámico de clientes OAuth que usa Claude Code. El servidor local con `az login` funciona.

**¿Debe el agente mover los tickets de estado?**
No. Mejor automatizaciones de Jira / Azure DevOps disparadas por rama, PR y merge. El agente, como mucho, comenta en el ticket.

**¿Duplico las sub-tasks en Jira y en `tasks.md`?**
No. Elegir una sola fuente; recomendamos `tasks.md`.

**¿Cómo evito que las specs se queden desactualizadas?**
Archive en la PR, `openspec validate --strict` en la pipeline, hook `Stop` en Claude Code, subagente verificador y regla en `CLAUDE.md` de no editar `specs/` directamente.

**¿Qué hago con un cambio urgente sin tiempo para specs?**
Etiqueta `no-spec` visible en la PR. Revisar su uso en las retrospectivas; si se abusa, el proceso se erosiona.

**¿En qué idioma escribo las specs?**
Palabras normativas (SHALL/MUST, GIVEN/WHEN/THEN) en inglés; términos de dominio en el idioma del negocio. Criterio uniforme en todo el repositorio.

**¿Qué pasa si front (Angular) y back (.NET) están en repos distintos?**
Opciones: specs en el repo del backend (el que define el contrato) o la funcionalidad Stores (beta) de OpenSpec para specs compartidas entre repos.

**¿OpenSpec sustituye a los tests?**
No. Cada Scenario debe tener un test automatizado. Las specs dicen qué debe pasar; los tests lo garantizan.

**¿Cómo lo aprendo rápido?**
`/opsx:onboard` sobre tu propio código, más la ruta del fichero 02.

**¿Envía datos OpenSpec a algún sitio?**
Solo telemetría anónima (nombre de comando y versión), desactivable con `openspec config set telemetry.enabled false` u `OPENSPEC_TELEMETRY=0`. El contenido de specs y código lo procesa el modelo de IA de la herramienta que uses, no OpenSpec.
