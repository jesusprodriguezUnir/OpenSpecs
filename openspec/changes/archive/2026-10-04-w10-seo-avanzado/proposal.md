Roadmap: 10 · docs/proyecto/04-roadmap-de-changes.md

## Why

El sitio ya emite idioma, título, canónica y sitemap (spec `seo`), pero al compartir una URL no hay tarjeta enriquecida (Open Graph/Twitter), los buscadores no reciben datos estructurados (fecha de revisión, migas de pan) y no existe `robots.txt` que anuncie el sitemap. Además `description` no es obligatoria en las guías, así que nada impide publicar una página sin meta description o con una longitud inútil para el snippet.

## What Changes

- Etiquetas Open Graph en todas las páginas: `og:title`, `og:description`, `og:url`, `og:type` (`website` en la landing, `article` en el resto), `og:locale` `es_ES`, `og:site_name`, `og:image` absoluta con `og:image:width`, `og:image:height` y `og:image:alt`.
- Imagen OG estática por sección (`public/og/<seccion>.png`) y una por defecto (`public/og/default.png`). Sin generación en build ni dependencias nuevas.
- `twitter:card` = `summary_large_image` (sin `twitter:site` ni `twitter:creator`).
- JSON-LD: `WebSite` solo en la landing; `TechArticle` en `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/` con `dateModified` = `lastReviewed` e `inLanguage` `es-ES`; `BreadcrumbList` (Inicio → sección → página) en todas las páginas de contenido salvo landing y 404.
- `robots.txt` generado en build: permite todo y declara `Sitemap:` con el origen configurado (`SITE_URL`), sin dominio fijo.
- `description` obligatoria en las secciones de guía y referencia, con longitud entre 50 y 160 caracteres; el build falla si falta o está fuera de rango. Se ajustan las páginas existentes que no cumplan. El rango 150–160 de `docs/proyecto/06-calidad-seo-legal.md` se mantiene como recomendación editorial.
- Middleware de ruta de Starlight (`routeMiddleware`) que conserva la salida de su `Head` (incluida la canónica), sustituye las etiquetas que ya emite y añade las anteriores. El roadmap pedía un "override mínimo de Head"; se desvía deliberadamente porque el middleware logra lo mismo sin ningún override (los overrides siguen siendo solo `PageTitle`).

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `seo`: tarjetas sociales, datos estructurados JSON-LD y `robots.txt`.
- `contenido`: `description` pasa a ser metadato obligatorio con longitud acotada en guías y referencia.

## Impact

- Código: middleware de ruta `src/route-middleware.ts` registrado en `astro.config.mjs`, helpers puros en `src/lib/`, endpoint `src/pages/robots.txt.ts`, reglas en `src/lib/content-rules.ts` y `src/content.config.ts`.
- Activos: PNG 1200×630 en `public/og/`.
- Contenido: ajustes de `description` en páginas existentes que queden fuera de 50–160.
- JavaScript de cliente: no añade ninguno (los JSON-LD son `<script type="application/ld+json">`, no ejecutables). Sin terceros, sin cookies ni almacenamiento en el navegador: sin impacto LSSI-CE/RGPD.

## Fuera de alcance

- Generación dinámica de imágenes OG por página (satori u otras dependencias).
- `datePublished`, autor/organización en JSON-LD y `twitter:site`/`twitter:creator`.
- Reglas de `robots.txt` por entorno (bloquear previews de Vercel).
- Exigir `description` en landing, 404, `/recursos/` y `/como-se-hizo/`.

## Preguntas abiertas

- Diseño visual de las imágenes OG por sección: se entregan como activos estáticos y el contenido gráfico queda a criterio del autor.
