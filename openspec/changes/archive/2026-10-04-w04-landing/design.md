# Design

## Context

`src/content/docs/index.mdx` usa `template: splash` con un único CTA. Starlight ya inyecta sus propios scripts (búsqueda, tema, etc.) en todas las páginas, también en la landing. No existe `src/assets/`. Hay helper de axe en `tests/e2e/axe.ts` y patrón de tests E2E por dominio (`tests/e2e/<dominio>.spec.ts`).

## Goals / Non-Goals

**Goals:**
- Landing de contenido estático: hero, 3 frases, diagrama, tres recorridos.
- 0 KB de JS propio, verificado por test.
- Diagrama accesible a lectores de pantalla.

**Non-Goals:**
- Islas de cliente, animaciones o imágenes bitmap.
- Overrides nuevos de Starlight (Hero no se sobrescribe).

## Decisions

### D1. Hero mediante frontmatter de Starlight, sin override
`hero.title`, `hero.tagline` y `hero.actions` (primaria `variant: primary`, secundaria `variant: minimal`) cubren el requisito. **Descartado**: override `Hero.astro`. Añade mantenimiento frente a upgrades de Starlight sin ganar comportamiento.

### D2. Diagrama como SVG en línea en un componente `.astro`
Componente `src/components/CicloOpsx.astro` importado desde el MDX: `<svg role="img" aria-labelledby="…-title …-desc">` con `<title>` y `<desc>`, ids únicos y colores vía variables CSS de Starlight (`--sl-color-*`) para que funcione en modo claro y oscuro. **Descartado**: SVG en `src/assets/` con `<Image />`. Se renderiza como `<img>`, el `<title>` interno no es accesible y no hereda el tema. El ADR-0001 pide `<Image />` para imágenes; un diagrama en línea no es un asset de imagen, así que no lo contradice.

### D3. Recorridos con `CardGrid`/`LinkCard` de Starlight
Componentes de `@astrojs/starlight/components`, sin JS de cliente. **Descartado**: `Card` + enlace manual (más marcado sin beneficio).

### D4. Presupuesto de JS: comparación de scripts con una guía
Helper puro `scriptExtras(landing, guia)` en `tests/e2e/` (o `src/lib/` si se reutiliza) que devuelve los scripts de la landing ausentes en la guía. El E2E lo alimenta con los `<script>` de ambas páginas. El caso de error ("Script extra detectado") se cubre con un test unitario Vitest del helper. **Descartado**: lista blanca de nombres de bundle de Starlight (frágil ante hashes y versiones) y medir KB por red (no separa lo propio de lo de Starlight).

### D5. "Tres frases" comprobado por estructura
El test toma el primer párrafo tras el encabezado y cuenta frases por terminadores `.`, `?` o `!` seguidos de espacio o fin. El texto no usará abreviaturas con punto en ese bloque.

## Risks / Trade-offs

- [`LinkCard` cambia su marcado en una versión futura de Starlight] → los tests buscan por rol y nombre accesible, no por clases.
- [Starlight añade un script solo en `splash`] → el test D4 fallaría con un falso positivo; se revisaría entonces comparando con otra página splash (la 404).
- [El conteo de frases es heurístico] → acotado a un solo párrafo controlado por nosotros.
