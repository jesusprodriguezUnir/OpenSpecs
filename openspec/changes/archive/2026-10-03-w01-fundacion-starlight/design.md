# Design

## Context

Repo recién creado con la plantilla de Starlight (`astro` 7.3.5 y `@astrojs/starlight` 0.42.5 ya fijados en versión exacta, según ADR-0001). No hay specs previas ni tests. Motivación en proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- Toda la configuración en `astro.config.mjs` y contenido; cero overrides de componentes de Starlight en este change.
- Tests E2E deterministas contra `astro preview`, ejecutables en local (Windows) y, a partir del change 02, en CI.

**Non-Goals:**
- Diseño visual definitivo: solo tokens de color base.
- Vitest, axe y CI (change 02).

## Decisions

### D1. Locale root `es-ES` (ADR-0001)
`locales: { root: { label: 'Español', lang: 'es-ES' } }` + `defaultLocale: 'root'`. Da `<html lang="es-ES">`, UI de Starlight en español y URLs sin prefijo. Alternativa descartada: `defaultLocale: 'es'` con locale `es`, que añade `/es/` a las URLs.

### D2. Sidebar explícito por grupo con `autogenerate`
Un grupo por sección con `autogenerate: { directory: '<carpeta>' }` y orden de páginas vía `sidebar.order` en el frontmatter. Recursos y Cómo se hizo son páginas únicas (`/recursos/`, `/como-se-hizo/`): grupo con un único enlace (`items: [{ slug: 'recursos' }]`) para que el sidebar muestre siempre los siete grupos. Alternativa descartada: listar cada slug a mano en la config — duplica el mapa y se desincroniza al añadir páginas.

### D3. Placeholders publicados
Cada página del mapa v1 se crea con `title`, `description` y una línea "Página en preparación." sin `draft`. Motivo: `draft: true` excluye la página del build de producción y del sitemap, y los tests corren contra `astro preview`.

### D4. `site` desde `SITE_URL`
Helper `src/config/site.mjs` con `resolveSiteUrl(env)` que devuelve `env.SITE_URL` o `http://localhost:4321`; `astro.config.mjs` lo usa con `process.env`. Al definir `site`, Starlight genera la canónica y activa `@astrojs/sitemap` automáticamente (sin dependencia nueva). La 404 se excluye del sitemap por Starlight. Se extrae a un helper para poder probar el fallback sin un segundo build.

### D5. 404 como contenido, sin override
`src/content/docs/404.md` con `template: splash`: Starlight lo usa como página 404 si existe. La cabecera de Starlight ya incluye el botón de búsqueda (cumple "acceso a la búsqueda"); el cuerpo añade el enlace a `/`. Alternativa descartada: `disable404Route` + `src/pages/404.astro` con `StarlightPage` — más código y acoplamiento a la API interna sin beneficio.

### D6. Tokens de color
`src/styles/custom.css` cargado con `customCss`, redefiniendo `--sl-color-accent-*` y `--sl-color-gray-*` para tema claro y oscuro. Sin fuentes nuevas (fuentes autoalojadas quedan para el change 04 si se necesitan).

### D7. Playwright como nueva devDependency
`@playwright/test` (versión exacta). Justificación: ADR-0001 lo fija para E2E y el roadmap lo pide en este change. Alternativa descartada: comprobaciones sobre `dist/` con un script Node — no cubre interacción (abrir búsqueda, `aria-current`) ni el estado HTTP real de la 404. Configuración: solo Chromium; `webServer` ejecuta `npm run build && npm run preview` con `SITE_URL=https://example.org`, para verificar la canónica con un origen distinto del fallback. El escenario de fallback se prueba como test de Node en Playwright (sin navegador) sobre `resolveSiteUrl`. Script `test:e2e` en `package.json`.

### D8. Portada mínima
`index.mdx` pasa a una portada `splash` en español con un enlace a `/empieza/que-es/`; las páginas de ejemplo y `houston.webp` se eliminan. La landing real es el change 04.

## Risks / Trade-offs

- [El escenario "Canónica con SITE_URL ausente" se verifica sobre el helper, no sobre HTML construido] → aceptable: el wiring config→Starlight lo cubre el escenario con `SITE_URL` definida.
- [Starlight 0.x puede cambiar la convención de `404.md`] → versión fijada; el test de la 404 lo detectaría en el upgrade.
- [Descarga de navegadores de Playwright en Windows/CI] → solo Chromium; `npx playwright install chromium` documentado en tasks.

## Migration Plan

No aplica: sitio aún no desplegado. Rollback = revertir la PR.
