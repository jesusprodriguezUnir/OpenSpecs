## Context

El contenido vive en `src/content/docs/` (25 páginas, Starlight, locale `es-ES`). El sidebar de `astro.config.mjs` define siete grupos, la mayoría con `autogenerate` por directorio y orden por `sidebar.order` del frontmatter. Playwright 1.63 ya está en `devDependencies` y la CI lo instala con Chromium para los E2E. El despliegue es estático en Vercel sin adapter (ADR-0001).

## Goals / Non-Goals

**Goals:**
- Un único PDF con todo el contenido, en orden de lectura, descargable desde la landing y el sidebar.
- Una sola fuente de verdad: el PDF sale del mismo contenido MDX que la web.
- Build de Vercel sin cambios en robustez ni duración.

**Non-Goals:**
- PDFs parciales, otros formatos o personalización por el lector.

## Decisions

### 1. PDF generado fuera del build y versionado en `public/`
`npm run manual:pdf` construye el sitio, levanta `astro preview`, abre `/manual/` con Chromium (Playwright) y llama a `page.pdf({ format: 'A4', printBackground: true, displayHeaderFooter: true })`. El resultado se escribe en `public/manual-openspec.pdf` y se commitea.

**Alternativa descartada:** generarlo en el build de Vercel. La imagen de build (Amazon Linux) no admite `playwright install --with-deps`; habría que mantener Chromium a mano, el build sería más lento y frágil, y rompería el principio de build estático simple del ADR-0001.

### 2. Detección de desfase por huella del texto, no por bytes del PDF
El PDF no es reproducible byte a byte (fechas de creación, IDs internos). El script calcula un SHA-256 del **texto** de `/manual/` (`main` sin etiquetas, espacios normalizados) y lo guarda en `public/manual-openspec.sha256`. Un script de comprobación (`npm run manual:check`) hace lo mismo sobre `dist/manual/index.html` tras el build y compara. Se ejecuta en el job de build existente de CI, sin necesidad de Chromium.

**Alternativa descartada:** regenerar el PDF en CI y hacer `git diff`. Siempre daría diferencias por los metadatos del PDF.

### 3. `/manual/` como página Astro con `StarlightPage`
Ruta `src/pages/manual.astro` que usa `<StarlightPage>` con `template: 'splash'` y `pagefind: false` para heredar los estilos de los componentes de Starlight usados en el MDX (Tabs, Aside, Steps, código con Expressive Code). Obtiene las entradas con `getCollection('docs')`, las ordena según el sidebar y renderiza cada una con `render()`.

- El orden se calcula con una función pura (`src/lib/manual-order.ts`) que reproduce el orden de los grupos de `astro.config.mjs` y, dentro de cada grupo, `sidebar.order` y después el título; con test de Vitest contra el sidebar real renderizado (E2E) para evitar divergencias.
- `noindex` mediante `head` del frontmatter de `StarlightPage`; exclusión del sitemap con el `filter` de `@astrojs/sitemap` (o la opción equivalente que ya use la config).
- Estilos `@media print` locales a la página: ocultan cabecera, sidebar, buscador y pie; fuerzan salto de página antes de cada sección (`break-before: page`) y muestran todas las pestañas de `Tabs` (PowerShell y bash) para que no se pierda contenido.
- Anclas por sección: `#<slug-con-guiones>`; los enlaces internos entre guías se mantienen como enlaces web absolutos al sitio.

**Alternativa descartada:** HTML independiente sin Starlight. Habría que reimplementar los estilos de los componentes MDX.

### 4. Enlaces de descarga sin overrides nuevos
- Sidebar: un item `{ label: 'Manual en PDF', link: '/manual-openspec.pdf', attrs: { download: '' } }` en el grupo «Recursos», que mantiene los siete grupos de primer nivel exigidos por `navegacion`.
- Landing: enlace en el override `Hero` existente (no se añade override nuevo).
- Peso: el script de generación escribe también `src/data/manual.json` con `{ bytes }`; landing y sidebar muestran «Manual en PDF · X,X MB». En el sidebar, si el `label` no puede leerlo de forma estática, se importa el JSON en `astro.config.mjs`.

## Risks / Trade-offs

- [Olvidar regenerar el PDF] → la comprobación de huella en CI bloquea la PR con el comando a ejecutar.
- [Peso del repositorio crece con cada regeneración] → aceptado; el PDF solo cambia con cambios de contenido. Si pasa de ~5 MB se evaluará Git LFS.
- [Componentes interactivos que no imprimen bien] → todas las pestañas visibles en impresión; revisión visual del PDF en la tarea final.
- [Orden del manual divergente del sidebar] → test E2E que compara el orden de las secciones de `/manual/` con el del sidebar renderizado.
- [Fuentes autoalojadas no incrustadas] → `page.pdf` espera a `document.fonts.ready` antes de imprimir.

## Migration Plan

Sin migración. Rollback: revertir el commit; el PDF y la ruta desaparecen.

## Open Questions

- Ninguna técnica; las de producto están en proposal.md.

## Addendum: fusión con el manual previo del autor

El autor tiene un manual previo (`docs/Manual/OpenSpec-desde-cero-manual_1.pdf`, OpenSpec 1.13, ejemplo .NET/Jira). Decisión: **la web es la única fuente de verdad**; el PDF previo se usa solo como referencia de estilo y de contenido.

### Contenido
- Se incorporan a las MDX existentes (no a `/manual/`) las piezas que solo estaban en el manual previo, adaptadas a 1.14 y al dominio de reservas: tabla «Qué revisar en cada punto de control» (`guias/flujo-opsx.mdx`), checklist «Antes de abrir la PR» (`equipo/adopcion.mdx`). Se contrastan y completan, sin duplicar, las secciones existentes de modelos por fase (`agentes/claude-code.mdx`), buenas prácticas de specs (`guias/formato-de-specs.mdx`: códigos de error estables, sin *backfilling*), riesgo RGPD/DPO (`equipo/adopcion.mdx`) y documentos oficiales (`recursos.mdx`).
- No se trae nada desfasado frente a 1.14 (URLs `/v1` del MCP de Jira, `/opsx:sync` antiguo, perfil core de 5 comandos, `@1.13.0`).
- «Cómo usar este manual» (ruta por días) es exclusivo del manual porque referencia capítulos; vive como dato en `src/config/manual.mjs` (o JSON en `src/data/`) y apunta a slugs, de modo que la numeración se resuelve en build y no se rompe al reordenar.

### Estilo (calcado del manual previo)
- Portada a sangre en verde petróleo oscuro (`#0f3a44` aprox.) con dos círculos decorativos (relleno teal y aro naranja), antetítulo naranja en versalitas espaciadas, título en Poppins bold, subtítulo, flujo `explore › propose › … › archive` en monoespaciada y pie con autor y versión.
- Interior: etiqueta «CAPÍTULO NN» naranja, H1 Poppins, entradilla gris y filete teal; H2 en teal; tablas con cabecera teal y texto blanco; asides como cajas con borde izquierdo (teal para nota/tip, naranja para caution/danger) y etiqueta en versalitas; bloques de código oscuros redondeados; pie de página «OpenSpec desde cero · Manual práctico» y número de página (vía `headerTemplate`/`footerTemplate` de `page.pdf`).
- Tipografías: Poppins para titulares, autoalojada en `src/assets`/`public` igual que Plex (ADR-0001: nada de Google Fonts en runtime). Cuerpo con la fuente ya autoalojada del sitio. Si añadir Poppins no está justificado por peso, alternativa: Plex Sans bold para titulares; se decide midiendo el peso (<60 KB woff2 por variante).
- Los estilos del libro solo se aplican dentro de `/manual/` (pantalla e impresión); el resto del sitio no cambia.

### Decisiones de implementación (tareas 7.3–7.4)
- **Tipografía**: no se añade Poppins. Los titulares del libro usan IBM Plex Sans 700, ya autoalojada vía `@fontsource` (ADR-0001). Añadir Poppins exigía una dependencia nueva (`@fontsource/poppins`) y 1–2 woff2 más solo para `/manual/`, sin mejora de legibilidad que lo justifique; el resto del estilo (colores, portada, etiquetas, tablas, asides, código) se calca del manual previo.
- **Numeración**: `MANUAL_GROUPS` declara `kind: 'chapter' | 'annex'`; `orderManualEntries` devuelve `number` y `label` («Capítulo 01», «Anexo A»). La ruta por días (`MANUAL_READING_ROUTE` en `src/config/manual.mjs`) referencia slugs y el build falla si alguno no está en el manual.
- **Versión y fecha de portada**: versión = mayor `openspecVersion` de las páginas; fecha = mes del `lastReviewed` más reciente. Ambas son deterministas, así la huella del manual solo cambia con el contenido.
- **Página**: márgenes laterales 0 en todas las páginas (`@page`) y padding de 16 mm en el interior, porque Chromium maqueta todas las páginas con un único ancho; la portada (`@page :first`, margen 0) sangra arriba y abajo. El pie (`footerTemplate`) cae en el margen inferior, que en la portada es 0.

### Sitemap explícito
Starlight registra `@astrojs/sitemap` internamente sin exponer `filter`. Para excluir `/manual/` se declara la integración en `astro.config.mjs` con `filter`, fijada a 3.7.4 (la versión que ya resolvía el lock vía Starlight); Starlight detecta la integración y no añade la suya. Alternativa descartada: post-procesar el sitemap tras el build (frágil y fuera del pipeline de Astro).

### Contraste del contenido previo
Modelos por fase (`agentes/claude-code.mdx`), riesgo RGPD/DPO (`equipo/adopcion.mdx`) y documentos oficiales (`recursos` vía `resources.yaml`) se contrastaron con el manual previo y ya estaban completos para 1.14: sin cambios.
