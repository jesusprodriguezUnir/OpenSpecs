# 05 · Convenciones del repositorio

## Git

- Rama principal: `main`, protegida; todo entra por PR (aunque trabajes solo: la PR es el punto de revisión de specs y el disparador del preview de Vercel).
- **Nombre del change = nombre de la rama** = `wNN-<slug>` (ver roadmap). Cambios fuera del roadmap: `fix-<slug>`, `chore-<slug>`.
- Commits en [Conventional Commits](https://www.conventionalcommits.org/es/), en español, con el change como scope:
  - `feat(w03): extiende docsSchema con openspecVersion`
  - `docs(w05): primer borrador de instalación`
  - `chore(openspec): archiva w03-esquema-de-contenido`
- El archive va **en la misma PR**, en un commit propio.
- Merge: *squash* con título = título de la PR.

## OpenSpec

- Todo cambio de **comportamiento** del sitio pasa por un change (`/opsx:propose`).
- Cambios puramente editoriales (erratas, redacción) no necesitan change: PR con etiqueta `no-spec`.
- Actualizaciones de dependencias: change sin delta specs, archivado con `--skip-specs`.
- **Nunca** editar `openspec/specs/` a mano.
- Idioma de los artefactos: español de España; palabras normativas (SHALL/MUST, GIVEN/WHEN/THEN, ADDED/MODIFIED/REMOVED) en inglés.
- Specs por **dominio funcional del sitio** (`navegacion`, `contenido`, `seo`…), nunca por carpeta técnica.

## Código

- TypeScript estricto (`astro/tsconfigs/strict` o `strictest`).
- `z` siempre desde `astro/zod`.
- Componentes propios en `src/components/`, overrides de Starlight en `src/components/overrides/` y registrados en `astro.config.mjs`.
- Cero JS de cliente por defecto; una isla requiere justificación en `design.md`.
- Imágenes en `src/assets/` con `<Image />`/`<Picture />`; nada de imágenes pesadas en `public/`.
- Contenido en `src/content/docs/` en `.mdx` solo si usa componentes; si no, `.md`.

## Tests

- Cada Scenario → un test (Playwright o Vitest) cuyo nombre contenga el nombre del Scenario, para que `spec-verifier` lo encuentre por búsqueda.
  - `test('Scenario: Ruta inexistente muestra 404 propia', …)`
- Los tests E2E corren contra `astro build && astro preview`, no contra `astro dev`.

## Definition of Done

- [ ] Change propuesto y revisado antes de implementar (o `no-spec` justificado).
- [ ] `/opsx:apply` completo; `tasks.md` refleja la realidad.
- [ ] `spec-verifier` sin escenarios "sin cubrir".
- [ ] `npm run check`, `npm run test`, `openspec validate --all --strict` en verde.
- [ ] Preview de Vercel revisado en móvil (360 px) y escritorio.
- [ ] Change archivado en la PR.
