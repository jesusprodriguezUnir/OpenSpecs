## 1. Orden del manual

- [x] 1.1 Crear `src/lib/manual-order.ts` con la función pura que ordena las entradas de `docs` según los grupos del sidebar y `sidebar.order`, excluyendo 404, legales y landing
- [x] 1.2 Tests Vitest en `tests/unit/manual-order.test.ts`: «Scenario: Páginas no enlazadas en el sidebar quedan fuera» y «Scenario: Página nueva aparece en el manual» (con entradas de fixture)

## 2. Página `/manual/`

- [x] 2.1 Crear `src/pages/manual.astro` con `StarlightPage` (splash, `pagefind: false`, `noindex`), portada, índice con anclas y una sección por entrada renderizada
- [x] 2.2 Estilos `@media print`: ocultar cromo de Starlight, salto de página por sección, todas las pestañas de `Tabs` visibles
- [x] 2.3 Excluir `/manual/` del sitemap
- [x] 2.4 E2E en `tests/e2e/manual.spec.ts`: «Scenario: Manual con todas las páginas en orden del sidebar», «Scenario: Índice enlazado a cada sección», «Scenario: Manual fuera de buscadores y del sitemap», «Scenario: Manual excluido de la búsqueda», «Scenario: Manual sin JavaScript propio» (reutilizando `script-budget.ts`)
- [x] 2.5 Pasar axe sobre `/manual/` añadiéndola a `tests/e2e/accesibilidad.spec.ts`

## 3. Generación del PDF

- [x] 3.1 Crear `scripts/manual-pdf.mjs`: build, `astro preview`, Chromium vía Playwright, `document.fonts.ready`, `page.pdf` A4; escribe `public/manual-openspec.pdf`, `public/manual-openspec.sha256` y `src/data/manual.json` (`bytes`)
- [x] 3.2 Extraer el cálculo de huella (texto de `main` normalizado + SHA-256) a `scripts/manual-hash.mjs`, compartido por generación y comprobación
- [x] 3.3 Añadir scripts `manual:pdf` y `manual:check` en `package.json`
- [x] 3.4 Generar y commitear el primer PDF; revisión visual (portada, índice, pestañas, código, fuentes)

## 4. Enlaces de descarga

- [x] 4.1 Añadir el item «Manual en PDF» (con `download`) al grupo «Recursos» del sidebar en `astro.config.mjs`
- [x] 4.2 Añadir el enlace con peso en MB en el override `Hero`
- [x] 4.3 E2E: «Scenario: PDF servido», «Scenario: Enlace de descarga en la landing», «Scenario: Enlace de descarga en el sidebar»; ajustar `tests/e2e/navegacion.spec.ts` si cuenta los items del grupo Recursos

## 5. Comprobación en CI

- [x] 5.1 Ejecutar `npm run manual:check` tras `npm run build` en el job de build de `.github/workflows/ci.yml`
- [x] 5.2 Tests Vitest en `tests/unit/manual-check.test.ts`: «Scenario: PDF al día», «Scenario: PDF desfasado», «Scenario: Huella ausente» (con HTML de fixture); actualizar `tests/unit/ci.test.ts` para exigir el paso

## 6. Cierre

- [x] 6.1 `npm run build`, `npx astro check` y `openspec validate --all --strict --no-interactive` en verde

## 7. Fusión con el manual previo

- [x] 7.1 Incorporar a `guias/flujo-opsx.mdx` la sección «Qué revisar en cada punto de control» y a `equipo/adopcion.mdx` el checklist «Antes de abrir la PR» (adaptados a 1.14 y dominio reservas); contrastar y completar modelos por fase, buenas prácticas de specs, riesgo RGPD/DPO y documentos oficiales sin duplicar
- [x] 7.2 E2E: «Scenario: Tabla de revisión por punto de control» y «Scenario: Checklist antes de abrir la PR»
- [x] 7.3 Datos del capítulo «Cómo usar este manual» (ruta por días con slugs) y numeración capítulo/anexo en `manual-order.ts`, con Vitest «Scenario: Numeración de capítulos y anexos»
- [x] 7.4 Rediseñar `/manual/` con el estilo del manual previo (portada, índice por partes, cabeceras de capítulo, tablas, asides, código, Poppins autoalojada si el peso lo justifica) y pie/número de página en `page.pdf`
- [x] 7.5 E2E: «Scenario: Portada del manual», «Scenario: Capítulo de cómo usar el manual», «Scenario: Índice agrupado en partes»; ajustar los E2E existentes del manual
- [x] 7.6 Regenerar el PDF y la huella; capturas de portada, índice y dos páginas interiores para revisión del autor
- [x] 7.7 `npm run build`, `npx astro check` y `openspec validate --all --strict --no-interactive` en verde
