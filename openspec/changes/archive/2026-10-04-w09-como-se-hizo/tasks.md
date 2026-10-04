# Tasks

## 1. Parsing y configuración

- [x] 1.1 Add `REPO_URL` (and branch) constant in `src/lib/site.ts`
- [x] 1.2 Create `src/lib/openspec-history.ts` with `parseArchiveFolder`, `extractWhySummary`, `countRequirements`, `sortChangesDesc` and link builders
- [x] 1.3 Vitest `tests/unit/openspec-history.test.ts`: `Scenario: Changes ordenados del más reciente al más antiguo`, `Scenario: Resumen tomado del primer párrafo de Why`, `Scenario: Proposal sin sección Why`, `Scenario: Dominios con número de requisitos`, `Scenario: Enlace a la carpeta del change`
- [x] 1.4 Add `changelog` and `specDomains` collections with `glob()` loader (base outside `src/`) in `src/content.config.ts`

## 2. Página

- [x] 2.1 Create `src/components/OpenspecHistory.astro` (changes list + domains list + empty states, no client JS)
- [x] 2.2 Rename `src/content/docs/como-se-hizo.md` → `.mdx`, keep frontmatter, render the component
- [x] 2.3 Unit test for empty states (Astro container API or view-model helper): `Scenario: Sin changes archivados`, `Scenario: Sin specs actuales`

## 3. E2E

- [x] 3.1 Playwright `tests/e2e/como-se-hizo.spec.ts`: `Scenario: Changes ordenados del más reciente al más antiguo`, `Scenario: Enlace a la carpeta del change`, `Scenario: Dominios con número de requisitos`, `Scenario: Página sin scripts propios` (script budget + axe)

## 4. Cierre

- [x] 4.1 `npm run build`, `npx astro check`, `npm run test`, `npm run test:e2e` and `openspec validate --all --strict --no-interactive` green
