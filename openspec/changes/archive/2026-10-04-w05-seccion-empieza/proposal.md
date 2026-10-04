Roadmap: 05 · docs/proyecto/04-roadmap-de-changes.md

## Why

The four "Empieza" pages are placeholders ("Página en preparación"). They are the start of the main reading path (Landing → Qué es → Conceptos → Instalación → Primer cambio → Escribir specs) and the landing CTA already points at them, so the site cannot teach OpenSpec until they exist.

## What Changes

- Write `/empieza/que-es/`, `/empieza/conceptos/`, `/empieza/instalacion/` and `/empieza/primer-cambio/` in es-ES from `docs/openspec-kb/01`, `03`, `04` and `05`, updated to OpenSpec 1.14 (`docs/proyecto/07-novedades-openspec-1.14.md`).
- Every page ends with a "Siguiente paso" link that follows the "Inicio" path; the last page links to `/guias/formato-de-specs/`.
- Shell commands use `<Tabs syncKey="shell">` with PowerShell and bash variants.
- Spec examples use the neutral domain "gestión de reservas".
- "Tu primer cambio" declares `duration` ≤ 30 and is doable on an empty repo.
- Editorial quality is reviewed in the PR; specs only cover verifiable behavior.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `contenido`: adds requirements for the "Empieza" section (no placeholders, page order, "Siguiente paso" chain, shell tabs, tutorial duration). Frontmatter and sidebar presence are already covered by `contenido` and `navegacion`.

## Impact

- `src/content/docs/empieza/*.md` → `.mdx` (needed for `Tabs`/`Aside`).
- New E2E tests in `tests/e2e/empieza.spec.ts`.
- No new dependencies, no client JS beyond Starlight's existing Tabs.
