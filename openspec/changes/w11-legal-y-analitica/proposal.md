Roadmap: 11 · docs/proyecto/04-roadmap-de-changes.md

## Why

El sitio lo firma webdespega, y la autoría tiene que ser visible. Además, el hosting (Vercel) genera logs y queremos medir visitas, por lo que el RGPD (art. 13) obliga a informar del tratamiento. Hoy no existe ninguna página legal ni analítica.

## What Changes

- Crédito de autoría en el pie de todas las páginas: "Diseño y desarrollo web: webdespega.com", que enlaza a la web de webdespega. Por decisión del autor, sustituye a la página de aviso legal.
- Nueva página `/legal/privacidad/` que informa de los logs del hosting y de la analítica agregada. Indica como responsable a webdespega y su web como vía de contacto, además de la finalidad, la base jurídica, los destinatarios y los derechos.
- Enlace a privacidad en el pie de todas las páginas (override de `Footer`, permitido por las convenciones).
- Analítica sin cookies con Vercel Web Analytics, cargada desde el propio origen (`/_vercel/insights/script.js`).
- Sin banner de cookies: el criterio queda documentado en `design.md`.
- Test E2E que falla si alguna página del sitio establece cookies o escribe en el almacenamiento del navegador fuera de lo exento.

**JavaScript de cliente, terceros y almacenamiento (impacto LSSI-CE/RGPD)**: añade un script de cliente en todas las páginas (Vercel Web Analytics). Se sirve desde el mismo origen y no establece cookies ni usa `localStorage`. No se añaden terceros con cookies. El único almacenamiento en el navegador sigue siendo la preferencia de tema de Starlight en `localStorage`, que está exenta (art. 22.2 LSSI-CE).

## Capabilities

### New Capabilities
- `legal`: crédito de autoría, página de privacidad y su enlace desde el pie, la analítica sin cookies y la garantía de que el sitio no establece cookies. Es un dominio ya permitido en `openspec/config.yaml`.

### Modified Capabilities
- Ninguna. La CSP vigente (`'self'`) ya admite el script y el envío de la analítica porque son del mismo origen, así que no cambia el requisito de `despliegue`.

## Fuera de alcance

- Página de aviso legal con los datos identificativos del titular (LSSI-CE art. 10). El autor decide no publicarla por ahora y asume el riesgo de incumplimiento si el sitio se considera actividad económica.
- Banner o gestor de consentimiento de cookies.
- Analítica con cookies, píxeles o cualquier tercero que almacene datos en el navegador.
- Formularios de contacto o cualquier otra recogida de datos personales.
- Versión en inglés de las páginas legales.
- Página de política de cookies separada: no hay cookies que listar, y el criterio se explica dentro de la página de privacidad.

## Impact

- Contenido nuevo en `src/content/docs/legal/` (fuera del sidebar).
- Nuevo override `src/components/overrides/Footer.astro` y su registro en `astro.config.mjs`.
- Script de analítica añadido en `head` (configuración de Starlight).
- Nuevos tests en `tests/e2e/legal.spec.ts`.
- Vercel: hay que activar Web Analytics en el proyecto (paso manual).

## Preguntas abiertas

- ¿Las páginas legales deben aparecer en el sitemap? Se propone que sí (son públicas e indexables), salvo indicación en contra.
