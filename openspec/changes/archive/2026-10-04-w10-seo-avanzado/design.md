## Context

Starlight ya emite `<title>`, canónica, `meta description` y algunas `og:*` básicas desde su componente `Head`. El origen del sitio se resuelve con `resolveSiteUrl(process.env)` (`src/config/site.mjs`) y se fija en `site` de `astro.config.mjs` (ADR-0001: salida estática, sin adapter). Las reglas de metadatos por sección viven en `src/lib/content-rules.ts` (`requiredFieldsFor`, `validateGuideFrontmatter`) y se aplican en build desde `docsLoaderWithRequiredMetadata` en `src/content.config.ts`.

## Goals / Non-Goals

**Goals:** OG/Twitter completos, JSON-LD (`WebSite`, `TechArticle`, `BreadcrumbList`), `robots.txt` sin dominio fijo, `description` obligatoria y acotada, cero JS de cliente.

**Non-Goals:** imágenes OG por página, `datePublished`, robots por entorno.

## Decisions

1. **Middleware de ruta de Starlight en lugar de override de `Head`** (`src/route-middleware.ts`, registrado con `starlight({ routeMiddleware: './src/route-middleware.ts' })` en `astro.config.mjs`). Usa `defineRouteMiddleware` de `@astrojs/starlight/route-data` (verificado en 0.42.5); el handler `(context, next)` edita `context.locals.starlightRoute.head` (array de `{ tag, attrs, content }`): las entradas con el mismo `property`/`name` (p. ej. `og:type`, `og:image`, `twitter:card`) se sustituyen en lugar de añadirse duplicadas, y los JSON-LD se añaden como entradas `<script type="application/ld+json">`. El `Head` de Starlight sigue renderizando la salida (canónica, favicon, title) sin tocarlo. Motivos: no requiere ningún override (los overrides quedan solo en `PageTitle`), sustituye las etiquetas de Starlight en vez de duplicarlas y respeta la convención de overrides mínimos. Alternativa descartada: override `Head.astro` que filtra `starlightRoute.head` a mano y renderiza el `Head` por defecto (más superficie, lógica de dedupe en un componente difícil de testear). Alternativa descartada: `head` global en `astro.config.mjs` (no puede variar por página).
2. **Helpers puros en `src/lib/seo.ts`**: `ogImageUrl(site, pathname)`, `buildWebSite(site)`, `buildTechArticle({...})`, `buildBreadcrumbs(site, pathname, titles)`, `robotsTxt(site)` y `upsertHead(head, entry)` (sustituye la entrada con el mismo `property`/`name` o la añade si no existe). Testeables con Vitest sin build. El middleware solo los invoca y serializa los JSON-LD con `JSON.stringify` como `content` de la entrada (escapando `<` como `<`).
3. **Imágenes OG estáticas** en `public/og/` (1200×630, PNG): `default`, `empieza`, `guias`, `agentes`, `equipo`, `referencia`, `recursos`, `como-se-hizo`. La lista de secciones con imagen es una constante en `seo.ts`; sección sin imagen → `default`. Alternativa descartada: satori/`@vercel/og` (dependencia nueva y tiempo de build, decisión del usuario).
4. **Migas de pan**: la miga de sección se obtiene de la navegación lateral que Starlight ya calcula para la página (`starlightRoute.sidebar`): su `name` es la etiqueta del grupo de la sección y su `item` es el `href` del primer enlace de ese grupo, es decir, la primera página de la sección según el orden de la navegación lateral (config de `sidebar` + `sidebar.order`). No existen páginas índice `/<seccion>/`, así que apuntar ahí produciría URLs 404. No se puede omitir `item` en la miga de sección: Google solo permite omitirlo en la última miga. Desviación respecto a la versión anterior de esta decisión (título desde `<seccion>/index` o segmento capitalizado): el segmento capitalizado perdía las tildes ("Guias"); la etiqueta del sidebar es la fuente correcta. `SECTION_TITLES` en `seo.ts` queda solo para el texto alternativo de la imagen OG. Páginas de primer nivel (`/recursos/`, `/como-se-hizo/`) → dos elementos.
5. **`robots.txt`** como endpoint estático `src/pages/robots.txt.ts` (`GET` con `context.site`), prerenderizado. Alternativa descartada: `public/robots.txt` (obligaría a fijar el dominio).
6. **`description` obligatoria**: `GuideField` incorpora `description`; `requiredFieldsFor` la añade a guías y referencia; nueva comprobación de longitud 50–160 en `validateGuideFrontmatter` (solo en esas secciones) y aplicada por el loader existente, con mensaje que nombra página y campo. Se reutiliza el campo nativo de Starlight, sin ampliar el esquema.

## Risks / Trade-offs

- [Cambia la API de route data de Starlight (`routeMiddleware`, `starlightRoute.head`)] → versión de Starlight fijada en `package.json`; los tests E2E de `seo.spec.ts` detectan ausencias tras una actualización.
- [Duplicar `og:*`/`twitter:*` que ya emite Starlight] → `upsertHead` sustituye por `property`/`name` (tests Vitest); test E2E comprueba unicidad de cada propiedad.
- [Descripciones existentes fuera de rango rompen el build] → tarea de contenido previa a activar la regla.
- [Previews de Vercel indexables] → fuera de alcance; la canónica apunta al dominio de producción.
