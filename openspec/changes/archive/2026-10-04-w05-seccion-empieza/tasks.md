# Tasks

## 1. Contenido de Empieza

- [x] 1.1 Verificar con `openspec --help` y `openspec <cmd> --help` los comandos que se citarán (init, list, show, validate, archive, update) y anotar diferencias con la KB 1.13
- [x] 1.2 Renombrar las cuatro páginas a `.mdx` conservando frontmatter y `sidebar.order` 1–4; actualizar `lastReviewed`
- [x] 1.3 Redactar `que-es.mdx` (KB 01) con "Siguiente paso" → `/empieza/conceptos/`
- [x] 1.4 Redactar `conceptos.mdx` (KB 01, 04; ejemplo de spec y delta de gestión de reservas) con "Siguiente paso" → `/empieza/instalacion/`
- [x] 1.5 Redactar `instalacion.mdx` (KB 03 + 07-novedades) con Tabs PowerShell/bash y "Siguiente paso" → `/empieza/primer-cambio/`
- [x] 1.6 Redactar `primer-cambio.mdx` (KB 05 receta 1) con `duration: 30`, Tabs PowerShell/bash y "Siguiente paso" → `/guias/formato-de-specs/`
- [x] 1.7 `npm run build` y `npx astro check` en verde; `npm run test` (enlaces internos) en verde

## 2. Tests E2E (`tests/e2e/empieza.spec.ts`)

- [x] 2.1 "Scenario: Empieza sin marcadores de preparación"
- [x] 2.2 "Scenario: Orden de las páginas de Empieza"
- [x] 2.3 "Scenario: Cadena de Siguiente paso", "Scenario: Primer cambio enlaza a Escribir specs"
- [x] 2.4 "Scenario: Pestañas de shell en instalación", "Scenario: Pestañas sincronizadas"
- [x] 2.5 "Scenario: Duración declarada del tutorial"

## 3. Cierre

- [x] 3.1 `openspec validate --all --strict --no-interactive`, `npm run test` y `npm run test:e2e` en verde
- [ ] 3.2 Recorrer el tutorial a mano sobre un repo vacío y anotar el tiempo en la PR
