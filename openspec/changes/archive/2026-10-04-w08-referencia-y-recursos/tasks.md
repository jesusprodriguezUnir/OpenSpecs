# Tasks

## 1. Preparación

- [x] 1.1 Renombrar las cinco páginas de Referencia y `recursos.md` a `.mdx` conservando frontmatter y `sidebar.order`; actualizar `lastReviewed`
- [x] 1.2 Comprobar en un build el `id` que genera Starlight para encabezados con tildes y espacios; fijar la estrategia de anclas del glosario
- [x] 1.3 Comprobar en `astro preview` que Pagefind devuelve sub-resultados con ancla para un `###`
- [x] 1.4 Crear `scripts/openspec-help-snapshot.mjs` y `npm run snapshot:openspec`; generar y versionar `tests/fixtures/openspec-cli-1.14.0.json`

## 2. Coherencia con la CLI

- [x] 2.1 `src/lib/cli-reference.ts`: extracción de comandos/flags/`/opsx:*` desde MDX y comparación con la fixture
- [x] 2.2 `tests/unit/cli-reference.test.ts`: "Scenario: Comando inexistente en la referencia CLI", "Scenario: Flag inexistente en la referencia CLI", "Scenario: Comando de chat inexistente", "Scenario: Versión de la fixture distinta de la página", más un caso contra las páginas reales

## 3. Referencia

- [x] 3.1 Redactar `comandos-chat.mdx` (KB 05 + `.claude/commands/opsx/` + 07-novedades); "Siguiente paso" → `/referencia/cli/`
- [x] 3.2 Redactar `cli.mdx` desde la fixture (KB 03 como apoyo), variantes PowerShell/bash; "Siguiente paso" → `/referencia/plantillas/`
- [x] 3.3 Redactar `plantillas.mdx` (KB 08): CLAUDE.md, config.yaml, `/ticket-propose`, `spec-verifier`, PR y ticket; "Siguiente paso" → `/referencia/glosario/`
- [x] 3.4 Redactar `glosario.mdx` (KB 00) con un encabezado por término y anclas estables; "Siguiente paso" → `/referencia/faq/`
- [x] 3.5 Redactar `faq.mdx` (KB 10, actualizado a 1.14); "Siguiente paso" → `/recursos/`

## 4. Recursos

- [x] 4.1 `src/lib/resources-schema.ts` y colección `resources` con `file()` en `src/content.config.ts`
- [x] 4.2 `tests/unit/resources-schema.test.ts`: "Scenario: Recurso sin URL", "Scenario: URL no válida", "Scenario: URL sin https", "Scenario: Tipo no permitido", "Scenario: Idioma no permitido"
- [x] 4.3 `src/data/resources.yaml` desde KB 02 (oficiales, comunidad, vídeos; `lang` por recurso)
- [x] 4.4 `src/components/ResourceList.astro` con filtro CSS `:has()`; usarlo en `recursos.mdx`

## 5. Tests E2E (`tests/e2e/referencia-recursos.spec.ts`)

- [x] 5.1 "Scenario: Referencia sin marcadores de preparación"
- [x] 5.2 "Scenario: Cadena de Siguiente paso en Referencia", "Scenario: FAQ enlaza a Recursos"
- [x] 5.3 "Scenario: Ancla de delta spec", "Scenario: Anclas únicas en el glosario"
- [x] 5.4 "Scenario: Comandos principales documentados"
- [x] 5.5 "Scenario: Todos los recursos listados", "Scenario: Tipo e idioma visibles"
- [x] 5.6 "Scenario: Filtrar vídeos sin JavaScript", "Scenario: Todos por defecto", "Scenario: Filtro con teclado", "Scenario: Recursos sin scripts extra"
- [x] 5.7 "Scenario: Buscar delta spec", "Scenario: Término sin coincidencias"

## 6. Cierre

- [x] 6.1 `npm run build`, `npx astro check`, `openspec validate --all --strict --no-interactive`, `npm run test` y `npm run test:e2e` en verde
