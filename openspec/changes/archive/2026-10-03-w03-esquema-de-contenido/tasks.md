# Tasks

## 1. Schema y obligatoriedad

- [x] 1.1 Verificar si el `superRefine` de `docsSchema({ extend })` recibe el `id` de la entrada en Astro 7; elegir variante de D1 y anotarla en `design.md`
- [x] 1.2 Crear `src/lib/content-rules.ts` con `requiredFieldsFor(id)` y su test Vitest (tests de "Scenario: Guía sin duration", "Scenario: Referencia sin level", "Scenario: Landing sin metadatos")
- [x] 1.3 Extender `src/content.config.ts` con `openspecVersion`, `lastReviewed`, `level`, `duration` (`z` desde `astro/zod`) y la validación por sección
- [x] 1.4 Tests Vitest del validador: "Scenario: Guía sin openspecVersion", "Scenario: Guía sin lastReviewed", "Scenario: Guía sin level", "Scenario: Referencia sin lastReviewed", "Scenario: Nivel no permitido", "Scenario: Versión con formato inválido"
- [x] 1.5 Completar frontmatter de los 18 placeholders (`openspecVersion: "1.14.0"`, `lastReviewed: 2026-10-03`, `level` según `03-arquitectura-de-informacion.md`; sin `level` en `/referencia`) y comprobar `npm run build`

## 2. Caducidad

- [x] 2.1 Crear `src/lib/staleness.ts` con `isStale(lastReviewed, now, thresholdDays = 180)` y fecha de build desde `BUILD_DATE` con fallback a la fecha actual
- [x] 2.2 Tests Vitest: "Scenario: Página revisada hace más de 180 días", "Scenario: Página revisada hace exactamente 180 días", "Scenario: Página revisada recientemente"

## 3. Cabecera y aviso

- [x] 3.1 Crear override `src/components/overrides/PageTitle.astro` (título por defecto + cabecera + aviso, sin JS de cliente) y registrarlo en `astro.config.mjs`
- [x] 3.2 Actualizar la convención de overrides en `CLAUDE.md` para incluir `PageTitle`
- [x] 3.3 Tests Playwright en `tests/e2e/contenido.spec.ts`: "Scenario: Cabecera completa en una guía", "Scenario: Guía sin duración", "Scenario: Página fuera de guías sin cabecera"
- [x] 3.4 Test Playwright del aviso renderizado con `BUILD_DATE` fijado en la config de tests (reutiliza "Scenario: Página revisada hace más de 180 días" en el título)

## 4. Cierre

- [x] 4.1 `npm run build`, `npx astro check` y `openspec validate --all --strict` en verde; `npm run test` en verde
