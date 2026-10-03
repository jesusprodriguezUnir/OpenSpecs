# Tasks

## 1. Configuración de despliegue

- [x] 1.1 Crear `vercel.json` con `buildCommand: "npm run build"`, `outputDirectory: "dist"`, `framework: "astro"`, `redirects: []`, las cabeceras de seguridad para `/(.*)` y `Cache-Control` inmutable para `/_astro/(.*)`
- [x] 1.2 Test Vitest `tests/unit/vercel-config.test.ts` con un caso por cada Scenario de configuración: "Scenario: Configuración de build estática", "Scenario: CSP sin orígenes de terceros", "Scenario: CSP impide el embebido", "Scenario: HSTS con max-age suficiente", "Scenario: HSTS sin preload", "Scenario: Recursos con hash inmutables", "Scenario: Redirecciones permanentes", "Scenario: Redirección con destino inexistente" (con fixture) y "Scenario: Sin redirecciones declaradas"

## 2. Smoke test contra el despliegue

- [x] 2.1 Crear `tests/e2e/despliegue.spec.ts`, que se omite sin `PREVIEW_URL` y envía `x-vercel-protection-bypass` si existe `VERCEL_AUTOMATION_BYPASS_SECRET`, con los tests "Scenario: Cabeceras de seguridad en una página", "Scenario: Cabeceras de seguridad en una ruta inexistente", "Scenario: Cabeceras de seguridad en un recurso estático", "Scenario: HTML no inmutable" y "Scenario: La búsqueda funciona con la CSP activa"
- [x] 2.2 Comprobar que `playwright.config.ts` no rompe al ejecutar este fichero contra `PREVIEW_URL` (el resto de E2E siguen usando `astro preview`)

## 3. Vercel (manual, se documenta en la PR)

- [ ] 3.1 Enlazar el proyecto de Vercel al repositorio, verificar que la PR recibe un preview ("Scenario: Preview por PR", verificación manual registrada en la descripción de la PR) y ejecutar el smoke test con `PREVIEW_URL`
- [ ] 3.2 Definir `SITE_URL` con la URL `*.vercel.app` de producción en las variables de entorno de Vercel

## 4. Cierre

- [x] 4.1 `npm run build`, `npx astro check` y `openspec validate --all --strict --no-interactive` en verde
