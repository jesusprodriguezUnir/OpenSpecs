Roadmap: 01 · docs/proyecto/04-roadmap-de-changes.md

# Proposal

## Why

El sitio sigue siendo la plantilla de Starlight (título "My Docs", sidebar de ejemplo, idioma inglés). Antes de escribir contenido (changes 03–09) hace falta una base estable: idioma, estructura de navegación con slugs definitivos, 404 propia y SEO base, verificada con tests E2E desde el primer día.

## What Changes

- Configurar Starlight con locale root `es-ES` (URLs sin prefijo) y título "OpenSpec desde cero".
- Sidebar con las secciones Empieza, Guías, Con tu agente, En equipo, Referencia, Recursos y Cómo se hizo, en el orden de `docs/proyecto/03-arquitectura-de-informacion.md`.
- Crear **todas** las páginas del mapa del sitio v1 como placeholder de una línea, publicadas (sin `draft`), para fijar los slugs definitivos.
- `site` leído de la variable de entorno `SITE_URL`, con fallback `http://localhost:4321`.
- Página 404 propia en español con enlace a inicio y acceso a la búsqueda.
- Tokens de color propios (CSS custom properties de Starlight) y favicon del sitio.
- Sustituir la landing de ejemplo por una portada mínima en español (la landing real es el change 04) y eliminar las páginas de ejemplo de la plantilla.
- Instalar Playwright con configuración mínima contra `astro preview` y tests de navegación, idioma, 404 y SEO base. Las versiones exactas de `astro` y `@astrojs/starlight` ya están fijadas desde el bootstrap; se mantienen.

## Capabilities

### New Capabilities
- `navegacion`: estructura del sidebar, rutas de las secciones y comportamiento ante rutas inexistentes (404).
- `seo`: idioma del documento, título con sufijo del sitio, URL canónica absoluta y sitemap.

### Modified Capabilities
<!-- Ninguna: no existen specs previas. -->

## Impact

- `astro.config.mjs`, `src/content/docs/**`, `src/styles/` (nuevo), `package.json` (nueva devDependency `@playwright/test`, scripts `test:e2e`), `playwright.config.ts` y `tests/e2e/` (nuevos).
- **JavaScript de cliente**: no se añade ninguno propio; solo el que Starlight ya incluye (búsqueda Pagefind, selector de tema).
- **Terceros / cookies / almacenamiento**: ninguno nuevo. Starlight guarda la preferencia de tema en `localStorage` (preferencia técnica estrictamente necesaria, sin datos personales); se documentará en el change 11.

## Fuera de alcance

- Landing real (change 04), contenido editorial (05–09), esquema de frontmatter extendido (03).
- Vitest, axe y pipeline de CI (change 02); despliegue en Vercel (change 12).
- Páginas legales (change 11) y SEO avanzado: Open Graph, datos estructurados (change 10).

## Preguntas abiertas

- Dominio de producción definitivo: se resolverá en el change 12 fijando `SITE_URL` en Vercel; no afecta a este change.
