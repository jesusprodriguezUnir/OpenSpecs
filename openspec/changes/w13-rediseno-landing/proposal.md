Fuera de roadmap: rediseño visual de la landing pedido por el autor tras w12 (el aspecto "Starlight por defecto" no comunica la identidad del sitio).

## Why

La landing `/` usa el hero y las tarjetas por defecto de Starlight. No transmite que el sitio trata de un flujo de trabajo en terminal con agentes ni da peso al ciclo `/opsx`. Se ha elegido la dirección **1a "Terminal en vivo"** de `docs/Diseño web OpenSpecs innovador/Landing Rediseño.dc.html`: hero a dos columnas con una terminal que "ejecuta" el ciclo, franja de cuatro pasos, frases numeradas y tarjetas de recorrido con uno recomendado.

## What Changes

- Hero a dos columnas: antetítulo `// SPEC-DRIVEN DEVELOPMENT`, `h1` "OpenSpec desde cero" en dos líneas, tagline y los dos CTA actuales; a la derecha, una terminal decorativa animada **solo con CSS** que muestra `openspec init` → `/opsx:propose` → `/opsx:apply` → `/opsx:archive`.
- La terminal es decorativa (`aria-hidden`) y su contenido tiene equivalente textual en la propia página (la franja del ciclo). Con `prefers-reduced-motion: reduce` se muestra completa y estática.
- **BREAKING (spec)**: el diagrama SVG del ciclo se sustituye por una franja de cuatro pasos como lista ordenada (`/opsx:explore`, `propose`, `apply`, `archive`), cada uno con su descripción.
- "Qué es OpenSpec en 3 frases" pasa a lista numerada de tres frases.
- "Elige tu recorrido": tres tarjetas en el orden Equipo (marcada como recomendada), Inicio y Consulta.
- Paleta: el tema oscuro reproduce la 1a (fondo `#111215`, superficies `#17181c`, bordes `#24272f`, teal `#0f8a85`/`#b8ece8`); el tema claro se deriva con la misma paleta teal. El selector de tema sigue funcionando.
- Tipografía IBM Plex Sans y IBM Plex Mono **autoalojadas** con `@fontsource` (subset latin, pesos 400/500/600/700) para todo el sitio.
- La cabecera nativa de Starlight se estiliza solo con CSS (sin override de Header).

## Capabilities

### New Capabilities
<!-- ninguna -->

### Modified Capabilities
- `landing`: cambia el requisito del diagrama del ciclo (SVG → lista ordenada de pasos), el de "3 frases" (párrafo → lista de tres elementos) y el de recorridos (orden y recomendado); añade terminal decorativa sin JS, movimiento reducido, fuentes autoalojadas y accesibilidad en ambos temas.

## Impact

- **JavaScript de cliente**: no se añade ninguno; se mantiene el requisito de 0 KB propios en `/`.
- **Terceros**: ninguno. Las fuentes se sirven desde el propio dominio; no hay peticiones a Google Fonts (LSSI-CE/RGPD sin cambios, sin banner).
- **Almacenamiento en el navegador**: sin cambios (solo el tema de Starlight).
- **Dependencias nuevas**: `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` (justificadas en `design.md`).
- **Ficheros**: `src/content/docs/index.mdx`, `src/styles/custom.css`, override nuevo `src/components/overrides/Hero.astro` (permitido por `CLAUDE.md`), componentes de landing, `astro.config.mjs`, `tests/e2e/landing.spec.ts`, `tests/e2e/accesibilidad.spec.ts`. `CicloOpsx.astro` deja de usarse en la landing.
- **Peso**: las fuentes añaden ~100–150 KB de woff2; hay que vigilar LCP < 2,0 s y CLS < 0,05.

## Fuera de alcance

- Rediseño de las páginas de guía, sidebar o 404 más allá de lo que hereden de tokens y tipografía.
- Override del Header o de la búsqueda de Starlight.
- Las direcciones 1b y 1c del prototipo.
- Cambios en los textos editoriales de la landing.
- Versión en inglés.

## Preguntas abiertas

- ¿Debe la terminal animarse en bucle o una sola vez y quedarse quieta? (Se asume una sola vez, en `design.md`.)
- ¿Se aplica la tipografía Plex a todo el sitio o solo a la landing? (Se asume a todo el sitio para coherencia.)
