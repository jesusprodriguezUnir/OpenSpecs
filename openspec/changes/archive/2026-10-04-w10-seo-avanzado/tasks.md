# Tasks

## 1. Description obligatoria (`src/lib/content-rules.ts`, `src/content.config.ts`)

- [x] 1.1 Revisar la `description` de las 20 páginas de `empieza`, `guias`, `agentes`, `equipo` y `referencia` y ajustar las que estén fuera de 50–160 caracteres (recomendado 150–160)
- [x] 1.2 Añadir `description` a `GuideField` y a `requiredFieldsFor` en guías y referencia; comprobación de longitud 50–160 en `validateGuideFrontmatter`, aplicada por `docsLoaderWithRequiredMetadata`
- [x] 1.3 Tests Vitest en `tests/unit/content-rules.test.ts`: "Scenario: Guía sin description", "Scenario: Referencia sin description", "Scenario: Guía sin duration", "Scenario: Referencia sin level" (actualizados con `description`), "Scenario: Description demasiado corta", "Scenario: Description demasiado larga", "Scenario: Description en los límites", "Scenario: Description libre fuera de guías"
- [x] 1.4 Comprobar que los tests existentes "Scenario: Guía sin openspecVersion", "Scenario: Guía sin lastReviewed", "Scenario: Guía sin level", "Scenario: Referencia sin lastReviewed" siguen en verde

## 2. Helpers SEO puros (`src/lib/seo.ts`)

- [x] 2.1 `ogImageUrl`, `buildWebSite`, `buildTechArticle`, `buildBreadcrumbs`, `robotsTxt`
- [x] 2.2 `upsertHead(head, entry)`: sustituye la entrada con el mismo `property`/`name` o la añade; las entradas `script` JSON-LD siempre se añaden
- [x] 2.3 Tests Vitest en `tests/unit/seo.test.ts`: "Scenario: Imagen de sección en una guía", "Scenario: Imagen por defecto sin sección", "Scenario: TechArticle con dateModified de lastReviewed", "Scenario: Migas de una guía", "Scenario: Migas de una página de primer nivel", "Scenario: Sitemap con SITE_URL definida", más casos de `upsertHead` (sustituye `og:type` existente, añade `twitter:card` ausente, no duplica)

## 3. Imágenes OG y robots.txt

- [x] 3.1 Añadir PNG 1200×630 en `public/og/` (`default` y una por sección)
- [x] 3.2 Crear `src/pages/robots.txt.ts` usando `robotsTxt(context.site)`

## 4. Middleware de ruta de Starlight

- [x] 4.1 Crear `src/route-middleware.ts` con `defineRouteMiddleware` (`@astrojs/starlight/route-data`) que aplica OG/Twitter vía `upsertHead` y añade los JSON-LD a `context.locals.starlightRoute.head`
- [x] 4.2 Registrar `routeMiddleware: './src/route-middleware.ts'` en `starlight({...})` de `astro.config.mjs`; sin override de `Head` (overrides solo `PageTitle`)
- [x] 4.3 `npm run build` en verde

## 5. Tests E2E (`tests/e2e/seo.spec.ts`)

- [x] 5.1 "Scenario: Open Graph completo en una guía", "Scenario: og:type website en la landing"
- [x] 5.2 "Scenario: La imagen OG existe"
- [x] 5.3 "Scenario: Tarjeta grande en una guía"
- [x] 5.4 "Scenario: WebSite en la landing", "Scenario: Sin WebSite en una guía"
- [x] 5.5 "Scenario: TechArticle en una página de referencia", "Scenario: Sin TechArticle fuera de guías"
- [x] 5.6 "Scenario: Sin migas en la landing y la 404"
- [x] 5.7 "Scenario: robots.txt permite todo", "Scenario: Sitemap con SITE_URL ausente"
- [x] 5.8 "Scenario: Solo scripts JSON-LD añadidos" reutilizando `tests/e2e/script-budget.ts` (ignorando `application/ld+json`)

## 6. Cierre

- [x] 6.1 `npm run build`, `npx astro check` y `openspec validate --all --strict` en verde; `npm run test` y `npm run test:e2e` en verde
