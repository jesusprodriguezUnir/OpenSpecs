# Tasks

## 1. Preparación

- [x] 1.1 Instalar `@playwright/test` con versión exacta y Chromium (`npx playwright install chromium`); añadir script `test:e2e` y verificar que `npx playwright --version` responde
- [x] 1.2 Crear `playwright.config.ts` (Chromium, `webServer` con build + preview y `SITE_URL=https://example.org`) y verificar que `npm run test:e2e` arranca el servidor con 0 tests
- [x] 1.3 Eliminar páginas de ejemplo (`guides/`, `reference/example.md`) y `houston.webp`; sustituir `index.mdx` por portada mínima en español; verificar `npm run build` en verde

## 2. Idioma y configuración base

- [x] 2.1 Crear `src/config/site.mjs` (`resolveSiteUrl`) y configurar en `astro.config.mjs`: título, locale root `es-ES`, `site`, favicon y sin enlace social de la plantilla; verificar `npm run build`
- [x] 2.2 Tests `Scenario: lang es-ES en una página de guía`, `Scenario: lang es-ES en la portada y en la 404` y `Scenario: URLs sin prefijo de locale` en verde

## 3. Navegación

- [x] 3.1 Crear todas las páginas placeholder del mapa v1 (sin `draft`, con `sidebar.order`) y verificar que existen en `dist/`
- [x] 3.2 Configurar el sidebar con los siete grupos (D2) y verificar visualmente en `npm run dev`
- [x] 3.3 Tests `Scenario: Orden de las secciones del sidebar`, `Scenario: Todas las rutas del mapa responden`, `Scenario: Cada página del mapa está enlazada en el sidebar` y `Scenario: Página actual marcada en el sidebar` en verde
- [x] 3.4 Test `Scenario: Ruta de ejemplo no publicada` en verde

## 4. Página 404

- [x] 4.1 Crear `src/content/docs/404.md` (splash, español, enlace a `/`) y verificar que `dist/404.html` contiene el título propio
- [x] 4.2 Tests `Scenario: Ruta inexistente devuelve la 404 propia`, `Scenario: La 404 enlaza a inicio` y `Scenario: La 404 da acceso a la búsqueda` en verde

## 5. SEO base

- [x] 5.1 Test `Scenario: Título de una página de guía` en verde
- [x] 5.2 Tests `Scenario: Canónica con SITE_URL definida` (HTML construido) y `Scenario: Canónica con SITE_URL ausente` (test Node sobre `resolveSiteUrl`) en verde
- [x] 5.3 Tests `Scenario: Página de guía presente en el sitemap` y `Scenario: La 404 no aparece en el sitemap` en verde

## 6. Tema

- [x] 6.1 Crear `src/styles/custom.css` con tokens de acento y grises para claro/oscuro, registrarlo en `customCss` y verificar visualmente ambos temas en `npm run dev`

## 7. Cierre

- [x] 7.1 `npm run build`, `npx astro check`, `npm run test:e2e` y `openspec validate --all --strict --no-interactive` en verde
