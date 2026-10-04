# Tasks

## 1. Preparación

- [x] 1.1 Comprobar en un build la clase que emite Starlight para `Aside` y fijarla en el test
- [x] 1.2 Verificar con `openspec --version`, `openspec init --help` y `openspec archive --help` los comandos y flags que se citarán; anotar diferencias con la KB 1.13
- [x] 1.3 Contrastar en las fuentes oficiales los endpoints del MCP de Atlassian Rovo y el estado del servidor MCP remoto/local de Azure DevOps; anotar fecha de revisión
- [x] 1.4 Renombrar las seis páginas a `.mdx` conservando frontmatter y `sidebar.order`; actualizar `lastReviewed`

## 2. Con tu agente

- [x] 2.1 Redactar `agentes/claude-code.mdx` (KB 07): estructura `.claude/`, CLAUDE.md vs config.yaml, `.mcp.json`, permisos y hook `Stop`, modelos por fase, subagente verificador; enlaces a `/referencia/plantillas/`; "Siguiente paso" → `/agentes/otros/`
- [x] 2.2 Redactar `agentes/otros.mdx` (KB 01/02 + `init --help`): herramientas soportadas, qué es común y qué cambia; "Siguiente paso" → `/equipo/jira/`

## 3. En equipo

- [x] 3.1 Redactar `equipo/jira.mdx` (KB 06): principio de no duplicar, mapeo, convención de nombres, MCP Rovo (Aside con fecha), automatizaciones de estado, Aside RGPD; "Siguiente paso" → `/equipo/azure-devops/`
- [x] 3.2 Redactar `equipo/azure-devops.mdx` (KB 06 + 07): `AB#`, MCP local vs remoto (Aside con fecha), Build Validation, Aside RGPD; "Siguiente paso" → `/equipo/ci/`
- [x] 3.3 Redactar `equipo/ci.mdx` (KB 06 + 08 + ci.yml del repo): Tabs Azure Pipelines/GitHub Actions con versión fijada, regla `no-spec`, hook `Stop` local; "Siguiente paso" → `/equipo/adopcion/`
- [x] 3.4 Redactar `equipo/adopcion.mdx` (KB 09): fases, piloto, DoD, métricas, riesgos, checklist, Aside RGPD; "Siguiente paso" → `/referencia/comandos-chat/`

## 4. Tests E2E (`tests/e2e/agentes-equipo.spec.ts`)

- [x] 4.1 "Scenario: Agentes y equipo sin marcadores de preparación"
- [x] 4.2 "Scenario: Orden de las páginas de Con tu agente", "Scenario: Orden de las páginas de En equipo"
- [x] 4.3 "Scenario: Cadena de Siguiente paso en agentes y equipo", "Scenario: Adopción enlaza a comandos de chat"
- [x] 4.4 "Scenario: Aviso de RGPD en las páginas de equipo"
- [x] 4.5 "Scenario: Claude Code enlaza a plantillas"
- [x] 4.6 "Scenario: Pestañas de plataforma en CI", "Scenario: Versión de OpenSpec fijada en CI"

## 5. Cierre

- [x] 5.1 `npm run build`, `npx astro check`, `openspec validate --all --strict --no-interactive`, `npm run test` y `npm run test:e2e` en verde
