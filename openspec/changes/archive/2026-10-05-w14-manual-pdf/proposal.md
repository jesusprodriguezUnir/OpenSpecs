Fuera de roadmap: petición del autor de ofrecer todo el contenido del sitio como manual descargable en PDF.

## Why

El sitio enseña OpenSpec en 25 páginas repartidas en siete secciones. Hay lectores que quieren estudiarlo sin conexión, imprimirlo o compartirlo con su equipo como un único documento. Hoy la única forma es imprimir página a página desde el navegador, sin portada, sin índice y con el cromo de Starlight (sidebar, cabecera, buscador) en cada hoja.

## What Changes

- Nueva página `/manual/` que reúne todas las guías en el orden del sidebar, con portada, índice enlazado y estilos de impresión. Es estática, sin JavaScript de cliente, `noindex` y excluida de la búsqueda y del sitemap.
- Nuevo script `npm run manual:pdf` que genera `public/manual-openspec.pdf` a partir de `/manual/` usando Playwright (ya es dependencia de desarrollo). El PDF se versiona en el repositorio.
- Huella del contenido del manual versionada junto al PDF; un job de CI la recalcula y falla si el PDF ha quedado desfasado respecto al contenido.
- Enlace de descarga «Manual en PDF» con el peso del fichero en la landing y dentro del grupo «Recursos» del sidebar (sin añadir grupos de primer nivel).

## Capabilities

### New Capabilities
<!-- Ninguna: el comportamiento encaja en los dominios existentes. -->

### Modified Capabilities
- `contenido`: página de manual imprimible y PDF descargable enlazado desde la landing y el sidebar.
- `calidad`: comprobación en CI de que el PDF versionado corresponde al contenido actual.

## Impact

- Código: nueva ruta en `src/pages/`, script en `scripts/`, enlace en el override `Hero` y en `astro.config.mjs` (sidebar), job nuevo en `.github/workflows/ci.yml`.
- Dependencias: ninguna nueva en el árbol instalado. `@astrojs/sitemap` (3.7.4, ya resuelta en el lock vía Starlight) pasa a declararse explícitamente para poder excluir `/manual/` del sitemap (ver design.md). Playwright ya estaba en `devDependencies`.
- Peso del repositorio: un binario PDF (estimado 1–3 MB) que se reescribe cuando cambia el contenido.
- JavaScript de cliente: no añade. Terceros: no. Almacenamiento en el navegador: no. Sin impacto LSSI-CE/RGPD.

## Fuera de alcance

- Generar el PDF durante el build de Vercel (exige Chromium en la imagen de build; descartado en design.md).
- PDFs por sección o por página.
- Versión EPUB u otros formatos.
- Personalizar el PDF desde el navegador (tamaño de papel, tema oscuro).
- Incluir la página 404, las páginas legales y la landing en el manual.

## Preguntas abiertas

- ¿Debe incluirse «Cómo se hizo» en el manual? Se asume que sí porque forma parte del sidebar; confirmar.
- ¿Tamaño de papel A4 es suficiente o se quiere también Carta? Se asume solo A4.
