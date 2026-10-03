# Tasks

## 1. Scripts y Vitest

- [x] 1.1 Añadir `vitest` (versión exacta) y `vitest.config.ts` limitado a `tests/unit/**`; verificar que `npx vitest run` arranca sin tests fallidos
- [x] 1.2 Añadir scripts `check`, `test:unit`, `test` y `links` a `package.json`; verificar con el test unitario «Scenario: Scripts de calidad disponibles» en `tests/unit/scripts.test.ts`
- [x] 1.3 Test unitario «Scenario: El script test encadena unitarios y E2E» (el script `test` ejecuta `test:unit` antes que `test:e2e`); verificar que pasa con `npm run test:unit`

## 2. Enlaces internos

- [x] 2.1 Implementar el script `links` con lychee offline (`--offline --include-fragments --root-dir dist dist/`) y mensaje claro si falta el binario; verificar con `npm run build && npm run links` en verde
- [x] 2.2 Crear fixtures en `tests/unit/fixtures/links/` (enlace roto, fragmento inexistente, enlace externo inalcanzable) y tests «Scenario: Un enlace interno roto falla el job de enlaces», «Scenario: Un fragmento inexistente falla el job de enlaces» y «Scenario: Un enlace externo no bloquea»; verificar que pasan (con `test.skipIf` solo si no hay binario)
- [x] 2.3 Documentar la instalación local de lychee en `README.md` y verificar que el comando documentado funciona en PowerShell (verificado `npm run links` con el binario; la instalación con winget queda documentada, no ejecutada)

## 3. Accesibilidad con axe

- [x] 3.1 Añadir `@axe-core/playwright` (versión exacta) y `tests/e2e/accesibilidad.spec.ts` con «Scenario: Una página de guía sin violaciones graves de accesibilidad» y «Scenario: La 404 sin violaciones graves de accesibilidad»; verificar con `npx playwright test accesibilidad`
- [x] 3.2 Test «Scenario: Una violación grave falla el test» con una página de fixture con `<img>` sin `alt` que el helper de axe rechaza; verificar que el helper lanza error ante esa página

## 4. Workflow de CI

- [x] 4.1 Reescribir `.github/workflows/ci.yml` con jobs `openspec`, `build` (check + build + subida de `dist/`), `unit`, `e2e` (con caché de Chromium) y `links` (`needs: build`, descarga `dist/`, `lychee-action`); verificar con `actionlint` o revisión de sintaxis y que el YAML carga sin errores (verificado: YAML carga y la CI real de PR #2 terminó en verde)
- [x] 4.2 Tests estructurales en `tests/unit/ci.test.ts`: «Scenario: Versión de OpenSpec fijada», «Scenario: Los tests de Playwright usan astro preview» (config con `astro preview`), «Scenario: Un error de tipos falla la CI», «Scenario: Frontmatter inválido falla la CI», «Scenario: Un test unitario en rojo falla la CI», «Scenario: Un test E2E en rojo falla la CI», «Scenario: Un PR con specs inválidas falla el job openspec» y «Scenario: Un fallo no oculta a los demás jobs» (comandos presentes, sin `continue-on-error`, sin `needs` salvo `links`→`build`); verificar con `npm run test:unit`

## 5. Verificación integrada

- [x] 5.1 Ejecutar `npm run build`, `npx astro check`, `npm run test` y `openspec validate --all --strict --no-interactive` en verde en local
- [x] 5.2 Anotar tiempos reales de cada job y actualizar la tabla de `design.md` (hecho con el run de la PR #2; la prueba de fallo en rama desechable se descarta: los fallos quedan cubiertos por los tests estructurales de `ci.yml` y los fixtures de enlaces)
- [x] 5.3 Ejecutar el subagente `spec-verifier` sobre el change antes de archivar
