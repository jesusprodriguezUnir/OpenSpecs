# Tasks

## 1. Página de privacidad

- [x] 1.1 Crear `src/content/docs/legal/privacidad.md` con los `h2` Responsable (webdespega, con enlace a `https://webdespega.com/` como contacto), Datos que tratamos, Finalidad, Base jurídica, Destinatarios, Conservación, Derechos y Cookies
- [x] 1.2 Tests en `tests/e2e/legal.spec.ts`: "Scenario: Privacidad publicada con sus secciones" y "Scenario: Privacidad identifica al responsable"

## 2. Pie con privacidad y crédito

- [x] 2.1 Crear `src/components/overrides/Footer.astro`, que envuelve el `Footer` por defecto y añade una barra con el enlace a `/legal/privacidad/` y el crédito "Diseño y desarrollo web: webdespega.com" según la skill `webdespega-credit`, y registrarlo en `astro.config.mjs`
- [x] 2.2 Tests: "Scenario: Crédito en el pie", "Scenario: Crédito sin nofollow", "Scenario: Sin página de aviso legal", "Scenario: Pie con enlace a privacidad en una guía", "Scenario: Pie con enlace a privacidad en la landing", "Scenario: Pie con enlace a privacidad en la página 404" y "Scenario: Páginas legales fuera del sidebar"

## 3. Analítica sin cookies

- [x] 3.1 Añadir en la opción `head` de Starlight el bloque en línea `window.va` y `<script defer src="/_vercel/insights/script.js">`
- [x] 3.2 Tests: "Scenario: Script de analítica en una página" y "Scenario: Sin scripts externos"
- [x] 3.3 Ejecutar los tests existentes de presupuesto de scripts (`seo`, `showcase`, `landing`). Si fallan por el script global de analítica, ajustarlos para excluirlo explícitamente y dejar constancia en la PR

## 4. Sin cookies

- [x] 4.1 Tests en `tests/e2e/legal.spec.ts` que recorren `/`, `siteMapSlugs` y las páginas legales en un contexto limpio: "Scenario: Ninguna página establece cookies", "Scenario: Cookies tras interactuar con búsqueda y tema", "Scenario: Solo almacenamiento exento" y "Scenario: Sin banner de cookies"

## 5. Vercel (manual, se documenta en la PR)

- [ ] 5.1 Activar Web Analytics en el proyecto de Vercel y comprobar en el preview de la PR que `/_vercel/insights/script.js` responde 200 y que no aparecen cookies

## 6. Cierre

- [x] 6.1 `npm run build`, `npx astro check` y `openspec validate --all --strict --no-interactive` en verde
