# Tasks

## 1. Contenido de la landing

- [x] 1.1 Crear `src/components/CicloOpsx.astro` (SVG en línea, `role="img"`, `<title>`/`<desc>` con ids únicos, colores con variables `--sl-color-*`)
- [x] 1.2 Reescribir `src/content/docs/index.mdx`: hero (CTA primario "Empieza en 30 minutos" → `/empieza/primer-cambio/`, secundario → `/empieza/que-es/`), bloque "Qué es OpenSpec" en tres frases, diagrama y recorridos con `CardGrid`/`LinkCard`
- [x] 1.3 Comprobar `npm run build` y que `npm run test` siga en verde (enlaces internos, contenido sin metadatos)

## 2. Tests E2E de la landing (`tests/e2e/landing.spec.ts`)

- [x] 2.1 "Scenario: CTA primario al primer cambio", "Scenario: CTA secundario a qué es OpenSpec", "Scenario: Destinos de los CTA existen"
- [x] 2.2 "Scenario: Tres frases bajo el encabezado"
- [x] 2.3 "Scenario: Diagrama con nombre accesible", "Scenario: Texto alternativo con los cuatro pasos en orden", "Scenario: Diagrama sin imagen externa"
- [x] 2.4 "Scenario: Recorridos con su destino", "Scenario: Consulta menciona la búsqueda"

## 3. Presupuesto de JS y accesibilidad

- [x] 3.1 Helper puro `scriptExtras(landing, guia)` y test Vitest "Scenario: Script extra detectado"
- [x] 3.2 Test Playwright "Scenario: Mismos scripts que una guía" usando el helper
- [x] 3.3 Añadir a `tests/e2e/accesibilidad.spec.ts` "Scenario: La landing sin violaciones graves de accesibilidad"

## 4. Cierre

- [x] 4.1 `npm run build`, `npx astro check` y `openspec validate --all --strict` en verde; `npm run test` y `npm run test:e2e` en verde
