Roadmap: 04 · docs/proyecto/04-roadmap-de-changes.md

## Why

La landing actual (`/`) es el placeholder splash de Starlight: un tagline y un único botón "Empieza aquí". No explica qué es OpenSpec, no muestra el ciclo `/opsx` y no orienta a los tres perfiles de lector (quien empieza, quien adopta en equipo, quien consulta). El objetivo de conversión del sitio es "Empieza en 30 minutos" (`/empieza/primer-cambio/`) y la landing no apunta ahí.

## What Changes

- Reescribir `src/content/docs/index.mdx` (sigue con `template: splash`):
  - Hero con propuesta de valor, CTA primario "Empieza en 30 minutos" → `/empieza/primer-cambio/` y secundario → `/empieza/que-es/`.
  - Bloque "Qué es OpenSpec" en tres frases.
  - Diagrama del ciclo explore → propose → apply → archive como SVG en línea (`role="img"`, `<title>`, `<desc>`).
  - Tres recorridos: Inicio → `/empieza/que-es/`, Equipo → `/equipo/adopcion/`, Consulta → `/referencia/cli/` (el texto menciona el buscador).
- Componente `.astro` presentacional para el diagrama, renderizado en servidor y sin script de cliente.
- Tests E2E de contenido observable, CTA, accesibilidad del diagrama, axe sobre `/` y presupuesto de JS propio.

**JavaScript de cliente, terceros y almacenamiento**: no se añade nada. La landing solo carga los scripts que Starlight ya carga en cualquier página (0 KB de JS propio, presupuesto de `06-calidad-seo-legal.md`). Sin impacto LSSI-CE/RGPD.

## Capabilities

### New Capabilities
- `landing`: contenido observable, llamadas a la acción, recorridos, diagrama del ciclo y presupuesto de JS de cliente de la página de inicio `/`.

### Modified Capabilities
<!-- ninguna -->

## Fuera de alcance

- Imagen en el hero o cualquier bitmap. No se usa `<Image />` porque no hay bitmaps, y no se crea `src/assets/`.
- Enlazar directamente a la búsqueda (Pagefind es un modal, no una página) o crear un índice `/referencia/`.
- SEO más allá de lo que ya garantiza `seo` (imagen Open Graph, JSON-LD) → change 10.
- Calidad editorial del texto; solo se especifica su estructura verificable.
- Lighthouse CI.

## Impact

- `src/content/docs/index.mdx` (reescrito).
- Componente nuevo en `src/components/` (no es override; `src/components/overrides/` no se toca).
- `tests/e2e/landing.spec.ts` (nuevo) y `tests/e2e/accesibilidad.spec.ts` (añade el escenario de la landing).
- Sin dependencias nuevas.

## Preguntas abiertas

Ninguna. Decisiones acordadas antes de proponer: SVG en línea en lugar de `<Image />`, hero sin imagen, destinos de los recorridos indicados arriba, presupuesto de JS comprobado comparando los scripts con los de una guía.
