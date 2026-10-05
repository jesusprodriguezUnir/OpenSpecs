## Context

Referencia visual: opción **1a** de `docs/Diseño web OpenSpecs innovador/Landing Rediseño.dc.html`. El prototipo usa Google Fonts remotas, JavaScript (`setInterval`) para animar la terminal, una cabecera propia y un único tema oscuro. Todo eso choca con el ADR-0001 (salida estática, 0 JS propio), con `06-calidad-seo-legal.md` (fuentes autoalojadas) y con la regla de overrides de `CLAUDE.md`. Este diseño traduce la 1a a esas restricciones.

Estado actual: `index.mdx` con `template: splash`, hero por frontmatter, `CicloOpsx.astro` (SVG) y `LinkCard`. Tokens en `src/styles/custom.css`; overrides existentes: `PageTitle` y `Footer`.

## Goals / Non-Goals

**Goals:**
- Reproducir la 1a en tema oscuro y derivar un tema claro coherente.
- Mantener 0 KB de JS propio, accesibilidad sin violaciones graves y presupuestos de LCP/CLS.

**Non-Goals:**
- Override de Header o Search; rediseñar guías o sidebar; textos editoriales nuevos.

## Decisions

### D1. Override de `Hero` (permitido)
`src/components/overrides/Hero.astro` renderiza el hero a dos columnas solo cuando la página es `/` (o tiene `hero` en frontmatter, que solo usa la landing); delega en el Hero por defecto en otro caso. Lee tagline y acciones del frontmatter para no duplicar textos.
*Alternativa descartada*: componente en el cuerpo del MDX con `hero` vacío — el `h1` del splash quedaría separado del hero y se perdería el `.hero` que usan los tests.

### D2. Terminal animada solo con CSS
Cada línea es un elemento con `opacity:0` y `@keyframes reveal` con `animation-delay: calc(var(--i) * 0.5s)` y `animation-fill-mode: forwards`. Se reproduce **una sola vez** (bucle infinito distrae y gasta CPU). Cursor con `@keyframes blink`. La franja del ciclo resalta el paso activo con una animación sincronizada por `animation-delay`, también una sola vez, terminando con `archive` resaltado.
`@media (prefers-reduced-motion: reduce)`: `animation: none; opacity: 1`.
La terminal lleva `aria-hidden="true"`: su información ya está en la lista del ciclo.
*Alternativa descartada*: isla con JS — rompe el requisito de 0 KB y no aporta información.
*Riesgo*: sin JS la animación igual se ejecuta (es CSS); si el CSS no carga, las líneas con `opacity:0` serían invisibles → la opacidad 0 inicial se aplica solo dentro de `@media (prefers-reduced-motion: no-preference)`.

### D3. Fuentes con `@fontsource`
`@fontsource/ibm-plex-sans` (400, 500, 600, 700) y `@fontsource/ibm-plex-mono` (400, 500, 600), importando solo los CSS `latin-*.css` de cada peso desde `custom.css`/config. `--sl-font` y `--sl-font-mono` apuntan a ellas con fallback `system-ui` / `ui-monospace`; `font-display: swap` (por defecto en fontsource). Preload del woff2 de Plex Sans 700 para el `h1` (LCP).
*Alternativa descartada*: descargar los woff2 a mano a `src/assets` — sin actualizaciones ni licencia trazable; la API experimental de fuentes de Astro añade configuración sin beneficio aquí. Cumple ADR-0001 y `06-calidad-seo-legal.md`.

### D4. Tokens y temas
Oscuro (por defecto) = valores actuales de `custom.css`, que ya coinciden con la 1a, más `--landing-bg: #111215` y `--landing-surface: #17181c` para el fondo de la landing. Claro: se mantienen los tokens claros actuales (teal `#0b6d69` sobre blanco/gris `#f5f6f8`) y la terminal **sigue oscura** en ambos temas (es una terminal), con contraste propio verificado. Se comprueba con axe en los dos temas.

### D5. Cabecera solo con CSS
Selectores sobre la cabecera nativa (`header.header`, buscador): borde inferior `--sl-color-gray-6`, fuente mono en el botón de búsqueda. Sin override de `Header`.

### D6. Contenido de la landing
`index.mdx` sustituye `CicloOpsx` por un componente `CicloPasos.astro` (`<ol aria-label="Ciclo de trabajo /opsx">`), el párrafo de 3 frases por `<ol>` de tres elementos, y `CardGrid` por un componente `Recorridos.astro` con tarjetas propias (badge "Recomendado" en Equipo). `CicloOpsx.astro` se elimina si ninguna otra página lo usa.

## Risks / Trade-offs

- [Peso de fuentes ~120 KB] → solo subset latin, 7 ficheros woff2, preload solo del peso del `h1`.
- [CLS por swap de fuente] → fallback con métricas cercanas (`size-adjust` si Lighthouse lo señala).
- [Contraste del texto `#888b96` sobre `#111215`] → ~5,4:1, pasa AA; en claro, gris `#545861` sobre blanco.
- [Romper tests existentes que usan `.sl-link-card`] → se reescriben en este change.
- [Override de Hero acoplado a la versión de Starlight] → el override es pequeño y solo para splash; se revisa al actualizar Starlight.

## Migration Plan

Despliegue estático normal vía PR con preview de Vercel. Rollback: revertir el merge.

## Open Questions

- Animación en bucle o una vez (se asume una vez).
- Plex en todo el sitio o solo en la landing (se asume todo el sitio).
