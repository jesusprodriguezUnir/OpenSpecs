Roadmap: 2 · docs/proyecto/04-roadmap-de-changes.md

# Proposal

## Why

Hoy la CI solo valida specs y ejecuta `astro check` + build. No ejecuta ningún test (el script `test:e2e` existe pero no se lanza en el workflow), no comprueba enlaces rotos y no hay tests unitarios ni de accesibilidad. Los siguientes changes (w03–w12) añaden contenido y comportamiento en bloque; sin una puerta de calidad que falle de forma fiable, los errores llegarán a `main`.

## What Changes

- Scripts npm de la puerta de calidad: `check`, `test:unit` (Vitest), `test:e2e` (ya existe), `test` (unit + e2e) y `links`.
- Vitest como runner unitario, con tests propios en `tests/unit/`.
- Comprobación de enlaces internos sobre `dist/` con lychee en modo offline, incluyendo fragmentos (`#ancla`). Los enlaces externos no bloquean.
- `@axe-core/playwright` como infraestructura de accesibilidad, con un test sobre las páginas que ya existen (guía, portada, 404).
- `.github/workflows/ci.yml` ampliado: jobs `openspec`, `build` (check + build), `unit`, `e2e` y `links`, todos bloqueantes. OpenSpec fijado a 1.14.0.
- `design.md` documenta por qué cada comprobación y su coste en tiempo.

## Capabilities

### New Capabilities
- `calidad`: qué hace fallar la puerta de calidad (local y en CI): specs inválidas, errores de tipos o de frontmatter, enlaces internos rotos, tests unitarios/E2E/a11y en rojo. El dominio `calidad` ya está permitido por la configuración del proyecto.

### Modified Capabilities
<!-- Ninguna: no cambia el comportamiento observable de `navegacion` ni `seo`. -->

## Impact

- Ficheros: `package.json`, `package-lock.json`, `.github/workflows/ci.yml`, `vitest.config.ts` (nuevo), `tests/unit/` (nuevo), `tests/e2e/accesibilidad.spec.ts` (nuevo), `README.md` (comandos locales).
- Dependencias nuevas (justificadas en `design.md`): `vitest` y `@axe-core/playwright` como devDependencies; `lychee` como binario externo (action oficial en CI, instalación manual en local).
- JavaScript de cliente: ninguno. Terceros y almacenamiento en el navegador: ninguno. Sin impacto LSSI-CE/RGPD (solo tooling de desarrollo).
- Sin cambios en el sitio publicado.

## Fuera de alcance

- Lighthouse CI y budgets de rendimiento (se aplaza a w10/w12).
- Comprobación de enlaces externos como puerta bloqueante.
- Tests de a11y de plantillas que aún no existen (landing en w04, guía definitiva en w05+): cada change añade el suyo.
- Protección de rama / required checks en GitHub (configuración del repositorio, no del código).
- Despliegue (w12).

## Preguntas abiertas

- Ninguna que cambie las specs. Los tiempos reales de cada job se medirán en la primera ejecución en GitHub y se anotarán en `design.md`.
