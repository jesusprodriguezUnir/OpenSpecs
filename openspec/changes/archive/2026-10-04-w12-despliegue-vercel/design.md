# Design

## Context

Salida estática de Astro 7 + Starlight sin adapter (ADR-0001). Starlight inyecta scripts en línea (el del tema claro/oscuro) y Pagefind usa WebAssembly. `astro preview` no aplica `vercel.json`, así que las cabeceras no son observables en los E2E locales. `SITE_URL` ya se resuelve en `src/config/site.mjs`.

## Goals / Non-Goals

**Goals:**
- Declarar cabeceras, caché y redirecciones en `vercel.json` y verificarlas de forma determinista en CI.
- Previews por PR con la integración Git de Vercel.

**Non-Goals:**
- Dominio propio, HSTS `preload` y permisos de CSP para la analítica (ver proposal.md, Fuera de alcance).

## Decisions

1. **Cabeceras en `vercel.json`, no en `<meta>`.** `frame-ancestors` y HSTS no funcionan como meta. Se descarta la CSP nativa de Astro (`security.csp`, que usa meta con hashes) por esa limitación y porque dos fuentes de CSP complican el diagnóstico.
2. **`script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'`.** Los hashes de los scripts en línea de Starlight cambian con cada versión y habría que recalcularlos a mano en `vercel.json`. `'unsafe-inline'` sin ningún origen externo es un riesgo asumible en un sitio sin entrada de usuario. `style-src 'self' 'unsafe-inline'` cubre los estilos en línea de Expressive Code.
   CSP completa: `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`.
3. **Verificación en dos niveles (decisión del usuario).** Vitest valida `vercel.json` contra el contrato de la spec en cada ejecución de CI. Playwright (`tests/e2e/despliegue.spec.ts`) hace peticiones reales a `PREVIEW_URL` y prueba la búsqueda sin violaciones de CSP; se omite con `test.skip` si la variable no existe. Se descarta `vercel dev` en CI porque es lento y exige token.
4. **Redirecciones.** El array `redirects` empieza vacío. El test lee `dist/` (requiere un build previo, igual que los E2E) para comprobar los destinos. Se descarta añadir una regla de ejemplo porque crearía una URL que nadie usa.
5. **Sin dependencias nuevas.** El test usa `node:fs` y `JSON.parse`; el smoke test usa el `request` de Playwright.

## Risks / Trade-offs

- `'unsafe-inline'` en `script-src` debilita la CSP → se mitiga porque no se permite ningún origen externo; podrá endurecerse con hashes si Starlight los expone.
- La protección de despliegues de Vercel puede devolver 401 en los previews → el smoke test envía `x-vercel-protection-bypass` si existe `VERCEL_AUTOMATION_BYPASS_SECRET` (pregunta abierta en proposal.md).
- Vitest valida la configuración, no la respuesta real → el smoke test contra el preview cubre esa diferencia.
