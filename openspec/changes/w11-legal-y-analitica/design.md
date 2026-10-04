# Design

## Context

- Sitio estático Astro 7 + Starlight, sin adapter, desplegado en Vercel (ADR-0001, change w12).
- La CSP vigente (`vercel.json`) solo admite `'self'`, más `data:` y `blob:` en directivas concretas. El requisito "CSP sin orígenes de terceros" de `despliegue` prohíbe ampliarla.
- Existe un único override de Starlight (`PageTitle`). Las convenciones permiten también `Footer`.
- Hoy el sitio no tiene páginas legales ni analítica.
- El autor ha decidido no publicar aviso legal. El sitio identifica su autoría con el crédito estándar de webdespega en el pie (convención de la skill `webdespega-credit`).

## Goals / Non-Goals

**Goals:**
- Cumplir el RGPD art. 13 con una página estática de privacidad y hacer visible la autoría con un crédito en el pie.
- Medir visitas sin cookies y sin terceros.
- Garantizar con un test que el sitio sigue sin cookies, para que no haga falta un banner.

**Non-Goals:**
- Gestor de consentimiento, analítica con cookies, formularios.

## Decisions

### D1. Sin banner de cookies (criterio)
El art. 22.2 de la LSSI-CE solo exige consentimiento para almacenar o leer datos en el equipo del usuario cuando no es estrictamente necesario para un servicio que el usuario ha pedido expresamente. Así queda cada caso:
- La preferencia de tema de Starlight en `localStorage` la pide el usuario al cambiar el tema, así que está exenta.
- El estado del sidebar de Starlight (`sl-sidebar-state` en `sessionStorage`) solo conserva la navegación durante la sesión y se borra al cerrar la pestaña. Es almacenamiento técnico necesario para el servicio, así que está exento.
- Pagefind no usa cookies ni almacenamiento persistente.
- Vercel Web Analytics no usa cookies ni almacenamiento: identifica las visitas con un hash de la petición que se descarta a las 24 h. Por eso no accede al equipo del usuario.

Conclusión: no hay nada que requiera consentimiento, así que no hay banner. El test del requisito "Sin cookies ni almacenamiento no exento" protege este criterio. Cualquier cambio futuro que introduzca cookies, almacenamiento no exento o un tercero hará fallar la CI y obligará a revisarlo (ver `docs/proyecto/06-calidad-seo-legal.md`).

### D2. Script de analítica en `head` en lugar del paquete `@vercel/analytics`
Se añade en la opción `head` de Starlight un `<script defer src="/_vercel/insights/script.js">` y el pequeño bloque en línea `window.va` que recomienda Vercel para sitios estáticos.
- Alternativa descartada: el paquete `@vercel/analytics` con su componente para Astro. Supone una dependencia nueva, un override o componente extra y JavaScript empaquetado, para obtener el mismo resultado.
- Al ser del mismo origen, encaja en `script-src 'self' 'unsafe-inline'` y `connect-src 'self'`, así que la CSP no cambia.
- Fuera de Vercel (`astro preview`, desarrollo) el script responde 404 y no tiene efecto. Los E2E comprueban la etiqueta en el HTML, no la ejecución.

### D3. Privacidad como contenido de Starlight
Se crea `src/content/docs/legal/privacidad.md`, que no aparece en el sidebar porque este no autogenera el directorio `legal`. Los campos de guía son opcionales en el schema (`03-arquitectura-de-informacion.md`), así que no hay que tocar el schema.

### D4. Override de `Footer`
`src/components/overrides/Footer.astro` reutiliza el componente `Footer` por defecto de Starlight y añade una barra inferior con el enlace a privacidad y, como último elemento, el crédito. El crédito sigue el contrato de `webdespega-credit`: aparece una sola vez, enlace dofollow con `target="_blank"` y `rel="noopener"`, estilo apagado con los tokens de Starlight y color de acento solo en `:hover` y `:focus-visible`. Así aparece en guías, landing y 404 sin duplicar markup.
- Alternativa descartada: enlaces en el contenido de cada página, que es frágil y no cubre la 404.

### D5. Test de cookies en Playwright
`tests/e2e/legal.spec.ts` recorre `siteMapSlugs` más `/` y las páginas legales en un contexto nuevo. Por cada página:
- comprueba `context.cookies()`;
- registra las cabeceras `set-cookie` de todas las respuestas;
- tras interactuar con la búsqueda y el tema, inspecciona `localStorage` y `sessionStorage`.

Se ejecuta contra `astro preview`. Si existe `PREVIEW_URL` (el patrón de `despliegue.spec.ts`), también se puede lanzar contra Vercel para cubrir las cabeceras reales del hosting.

## Risks / Trade-offs

- **El script de analítica es un script ejecutable más en todas las páginas.** Afecta al Scenario "Página sin scripts propios" de `showcase` y a la comparación de scripts de `seo` (`scriptExtras`/`executableScripts`). En ambos casos el script es global, no propio de la página ni del SEO, pero hay que comprobar en apply que esos tests comparan contra una página que también lo carga. Si alguno falla, se ajusta el test para que filtre el script de analítica, no la spec.
- **Sin aviso legal.** Si el sitio se considera actividad económica (por ejemplo, porque promociona webdespega), la LSSI-CE art. 10 exige identificar al titular. El autor asume este riesgo; añadir el aviso más adelante sería un change nuevo.
- **Cambios de Vercel en la ruta o en el comportamiento de Web Analytics** romperían la medición, pero no el cumplimiento, porque el test de cookies seguiría vigilando.
- **Activar Web Analytics en el dashboard de Vercel es un paso manual** y no se verifica en la CI.
