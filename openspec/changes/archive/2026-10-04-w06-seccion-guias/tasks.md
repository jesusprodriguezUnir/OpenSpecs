# Tasks

## 1. Preparación

- [x] 1.1 Comprobar en un build las clases que emite Expressive Code para `ins`/`del` y fijarlas en el test
- [x] 1.2 Verificar con `openspec <cmd> --help` los comandos que se citarán (`archive --skip-specs`, `schema *`, `config profile`, `new change --schema`, `update`) y anotar diferencias con la KB 1.13
- [x] 1.3 Renombrar las cinco páginas a `.mdx` conservando frontmatter y `sidebar.order` 1–5; actualizar `lastReviewed`

## 2. Contenido de Guías

- [x] 2.1 Redactar `formato-de-specs.mdx` (KB 04): requisitos, escenarios, ADDED/MODIFIED/REMOVED con marcadores `ins`/`del`, checklist de revisión; "Siguiente paso" → `/guias/flujo-opsx/`
- [x] 2.2 Redactar `flujo-opsx.mdx` (KB 05 + 07-novedades): comandos core y ampliados, `/opsx:sync` y `/opsx:update` corregidos, archive dentro de la PR, puntos de control; "Siguiente paso" → `/guias/recetas/`
- [x] 2.3 Redactar `recetas.mdx` (KB 05, recetas 1–7) con Tabs PowerShell/bash; "Siguiente paso" → `/guias/brownfield/`
- [x] 2.4 Redactar `brownfield.mdx` (KB 01 + 09): specs solo de lo que se toca, piloto, riesgos; "Siguiente paso" → `/guias/configuracion/`
- [x] 2.5 Redactar `configuracion.mdx` (KB 03 + 07-novedades): `context`, `rules`, `operations`, schemas personalizados (experimental) con Tabs PowerShell/bash; "Siguiente paso" → `/agentes/claude-code/`

## 3. Tests E2E (`tests/e2e/guias.spec.ts`)

- [x] 3.1 "Scenario: Guías sin marcadores de preparación"
- [x] 3.2 "Scenario: Orden de las páginas de Guías"
- [x] 3.3 "Scenario: Cadena de Siguiente paso en Guías", "Scenario: Configuración enlaza a Claude Code"
- [x] 3.4 "Scenario: Bloque con líneas insertadas", "Scenario: Bloque con líneas eliminadas"
- [x] 3.5 "Scenario: Pestañas de shell en recetas", "Scenario: Pestañas de shell en configuración"

## 4. Cierre

- [x] 4.1 `npm run build`, `npx astro check`, `openspec validate --all --strict --no-interactive`, `npm run test` y `npm run test:e2e` en verde
