Roadmap: 03 · docs/proyecto/04-roadmap-de-changes.md

## Why

Las guías enseñan una herramienta que cambia de versión con frecuencia. Sin metadatos tipados (versión de OpenSpec, fecha de revisión, nivel, duración) el lector no sabe si una página está vigente ni si es para él, y nada impide publicar una guía sin esos datos. Este change es prerrequisito de las secciones de contenido (05–08).

## What Changes

- Extender el schema de la colección `docs` con `openspecVersion`, `lastReviewed`, `level` y `duration` (opcionales en el schema; `z` desde `astro/zod`).
- Imponer en build la obligatoriedad por sección:
  - `/empieza`, `/guias`, `/agentes`, `/equipo`: `openspecVersion`, `lastReviewed` y `level` obligatorios; `duration` opcional.
  - `/referencia`: `openspecVersion` y `lastReviewed` obligatorios; `level` y `duration` opcionales.
  - Resto (landing, 404, `/recursos`, `/como-se-hizo`, legales): sin obligación.
- Cabecera de metadatos en cada guía: nivel, duración estimada (si existe), versión de OpenSpec y fecha de revisión.
- Aviso "contenido posiblemente desactualizado" cuando `lastReviewed` tiene más de 180 días respecto a la fecha del build.
- Completar el frontmatter de los 18 placeholders actuales (`openspecVersion: "1.14.0"`, `lastReviewed: 2026-10-03`, `level` según el mapa del sitio).
- Override de `PageTitle` de Starlight y actualización de la convención de overrides en `CLAUDE.md` (justificado en `design.md`).

No añade JavaScript de cliente, terceros, cookies ni almacenamiento en el navegador: sin impacto LSSI-CE/RGPD. La caducidad se calcula en build.

## Capabilities

### New Capabilities
- `contenido`: metadatos obligatorios de las guías, su presentación en la página y el aviso de contenido desactualizado.

### Modified Capabilities
<!-- Ninguna. -->

## Impact

- `src/content.config.ts` (schema y validación por sección).
- Nuevo override `src/components/overrides/PageTitle.astro` y lógica de caducidad en un módulo TS puro testeable.
- `astro.config.mjs` (registro del override), `CLAUDE.md` (convención de overrides).
- Frontmatter de las 18 páginas placeholder de `src/content/docs/`.
- Tests nuevos en `tests/unit/` y `tests/e2e/`.

## Fuera de alcance

- Contenido real de las guías (changes 05–08).
- Landing (change 04), recursos y showcase.
- Revisión automática de fechas o avisos en CI por contenido caducado.
- Mostrar metadatos en el sidebar o en la búsqueda.

## Preguntas abiertas

- Ninguna: las decisiones abiertas (obligatoriedad en `/referencia`, `duration` opcional, mecanismo, override de `PageTitle`, valores iniciales) se acordaron con el autor antes de proponer.
