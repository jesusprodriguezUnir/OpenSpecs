# OpenSpec desde cero — contexto para Claude

Web en español (es-ES) que enseña a usar OpenSpec desde cero. El propio repositorio se desarrolla con OpenSpec y forma parte del contenido.

Documentación de proyecto (léela cuando el change lo requiera, no entera en cada turno):
- `docs/proyecto/01-vision-y-alcance.md` — alcance y fuera de alcance
- `docs/proyecto/02-adr-0001-stack.md` — decisiones de stack
- `docs/proyecto/03-arquitectura-de-informacion.md` — mapa del sitio y frontmatter
- `docs/proyecto/04-roadmap-de-changes.md` — backlog de changes
- `docs/proyecto/05-convenciones.md` — git, código, tests, DoD
- `docs/proyecto/06-calidad-seo-legal.md` — budgets, SEO, a11y, LSSI-CE/RGPD
- `docs/proyecto/07-novedades-openspec-1.14.md` — diferencias con la KB
- `docs/openspec-kb/` — fuente del contenido editorial (escrita para OpenSpec 1.13)

## Stack
- Astro 7 + Starlight (versiones exactas fijadas en package.json), salida estática, sin adapter.
- TypeScript estricto. `z` siempre desde `astro/zod` (desde `astro:content` está deprecado).
- Contenido en `src/content/docs/` (Starlight, locale root `es-ES`). Colecciones extra en `src/content.config.ts`.
- Tests: Vitest (unitarios), Playwright contra `astro preview` (E2E), `@axe-core/playwright` (a11y).
- Despliegue: Vercel (preview por PR). CI: GitHub Actions (`.github/workflows/ci.yml`).
- Entorno del autor: Windows + PowerShell. Comandos de ejemplo en la web: PowerShell y bash.

## Comandos
- Dev: `npm run dev`
- Build: `npm run build` · Preview: `npm run preview`
- Tipos/contenido: `npx astro check`
- Tests (cuando existan, change w02): `npm run test`, `npm run test:e2e`
- Specs: `openspec validate --all --strict --no-interactive`

## Convenciones
- Cero JS de cliente por defecto; cualquier isla se justifica en `design.md`.
- Overrides de Starlight solo en `src/components/overrides/` (Head, Hero, Footer como máximo).
- Imágenes en `src/assets/` con `<Image />`. Fuentes autoalojadas. Ningún tercero que ponga cookies.
- Ejemplos de specs en la web con dominio neutro (gestión de reservas), sin datos personales.
- No inventes comandos ni flags de OpenSpec: compruébalos con `openspec --help` / `openspec <cmd> --help`.

## Spec-driven development (OpenSpec)
- Todo cambio de comportamiento pasa por un change (`/opsx:propose` o `/roadmap-propose NN`).
- NUNCA edites `openspec/specs/` por iniciativa propia: solo cambia mediante `/opsx:archive` o `/opsx:sync` (la sincronización edita las specs principales; por eso `.claude/settings.json` pide confirmación en esa ruta en lugar de denegarla).
- Cada Scenario debe tener un test cuyo nombre contenga `Scenario: <nombre>`.
- Nombre del change = nombre de la rama = `wNN-<slug>` (roadmap) o `fix-<slug>` / `chore-<slug>`.
- Cambios solo editoriales: sin change, PR con etiqueta `no-spec`.
- Tras `/opsx:apply`, usa el subagente `spec-verifier` antes de archivar.
