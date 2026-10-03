# Design

## Context

Estado actual: `ci.yml` tiene dos jobs (`openspec`, `build`); `package.json` solo tiene `test:e2e`; Playwright ya está configurado (`playwright.config.ts`) y construye + sirve con `astro preview` en el puerto 4329; `tests/e2e/` contiene `navegacion.spec.ts` y `seo.spec.ts`. No hay Vitest, ni axe, ni comprobación de enlaces. Ver `proposal.md` para la motivación y `docs/proyecto/02-adr-0001-stack.md` (sección Testing) y `06-calidad-seo-legal.md` para los budgets.

## Goals / Non-Goals

**Goals:**
- Que cada comprobación falle con un mensaje que apunte a la causa.
- Mismos comandos en local y en CI (los jobs llaman a scripts npm, no a lógica propia del workflow).
- Feedback de PR rápido: jobs en paralelo.

**Non-Goals:**
- Lighthouse CI y budgets de rendimiento.
- Required checks / branch protection (configuración de GitHub).
- Cobertura de código como umbral.

## Decisions

**1. Jobs separados y paralelos** (`openspec`, `build`, `unit`, `e2e`, `links`).
Un fallo no oculta a los demás y el tiempo total es el del job más lento. Alternativa descartada: un único job secuencial; más simple pero cada fallo oculta los siguientes y el PR tarda la suma de todos.

**2. `links` depende del job `build` y reutiliza su `dist/` como artefacto.**
Evita un tercer build. Alternativa: que `links` construya por su cuenta; descartada por duplicar ~el coste del build. `e2e` sigue construyendo por sí mismo porque `playwright.config.ts` ya lo hace y necesita `SITE_URL` propio para los tests de SEO.

**3. lychee en modo offline sobre `dist/` (ADR-0001: «`lychee` o comprobador sobre `dist/`»).**
`lychee --offline --include-fragments --root-dir dist dist/`. Offline = solo enlaces internos, determinista y sin red. Se usa la action oficial `lycheeverse/lychee-action` en CI (sin dependencia npm). Alternativa descartada: script Node que recorra `dist/` con un parser HTML; funcionaría igual en Windows sin instalar nada, pero hay que escribir y mantener el parser de rutas, directorios `index.html` y anclas. Trade-off asumido: en local hace falta instalar el binario (`winget install lycheeverse.lychee` o `cargo install lychee`).

**4. Enlaces externos fuera de la puerta.**
Los externos fallan de forma intermitente (rate limits, caídas ajenas) y bloquearían PRs que no los tocan. Se podrán añadir como job programado no bloqueante cuando exista la colección `resources` (w08).

**5. Vitest para unitarios en `tests/unit/`, Playwright sigue en `tests/e2e/`.**
Dependencia nueva exigida por el ADR (tabla Testing). Alternativa del stack actual: `node:test` o el runner de Playwright; descartadas porque el ADR fija Vitest y es el runner natural de Astro/Vite. Los tests de esta capability son estructurales (leen `ci.yml` y `package.json` como texto y comprueban comandos y ausencia de `continue-on-error`), sin parser YAML nuevo.

**6. `@axe-core/playwright` con umbral `serious`/`critical`.**
Dependencia nueva exigida por `06-calidad-seo-legal.md`. Se limita a esas severidades para evitar falsos positivos bloqueantes; las `moderate`/`minor` se registran pero no fallan. Se prueban las páginas que existen hoy (guía, portada, 404); w04 y siguientes añaden las suyas.

**7. `npm run test` = `test:unit && test:e2e`; `check` = `astro check`.**
El DoD (`05-convenciones.md`) exige `npm run check` y `npm run test`. `test` encadena en vez de usar paralelismo para que el fallo unitario (rápido) corte antes del E2E (lento, hace build).

**8. Cómo se verifican los Scenarios de CI.**
Un Scenario del tipo «un PR con X falla el job Y» no es reproducible dentro de un test sin lanzar GitHub. Se cubre con (a) tests de Vitest que comprueban la estructura del workflow (job existe, comando presente, sin `continue-on-error`, versión fijada) y (b) una prueba manual única en una rama desechable, documentada en la PR, que introduce cada fallo y confirma el rojo. Para enlaces, un test con `dist/` de fixture ejecuta lychee y espera código distinto de cero.

**9. OpenSpec fijado a 1.14.0** vía `OPENSPEC_VERSION` (ya existe en el workflow); un test comprueba que no hay `latest` ni rango.

### Coste estimado por job
Tiempos medidos en la primera ejecución en GitHub (jobs en paralelo; total de pared ~1 min):

| Job | Qué evita | Coste medido (run #1, PR #2) |
|---|---|---|
| `openspec` | specs inválidas en `main` | ~15 s (instalar CLI + validar) |
| `build` | errores de tipos/esquema/frontmatter | ~25 s |
| `unit` | regresiones de lógica y de la propia puerta | < 1 min |
| `e2e` | regresiones observables (nav, SEO, a11y) | ~50 s (build + Chromium) |
| `links` | enlaces internos rotos | ~4 s (reutiliza `dist/`) |

## Risks / Trade-offs

- [lychee no instalado en local] → `npm run links` falla con mensaje claro y el README documenta la instalación; el test de fixture usa `test.skipIf` solo cuando no hay binario y siempre corre en CI, donde está garantizado.
- [`--include-fragments` produce falsos positivos con anclas generadas por JS] → el sitio no usa JS de cliente para anclas; si aparece un caso, se excluye con `--exclude` documentado, nunca desactivando la opción.
- [Falsos positivos de axe en componentes de Starlight] → umbral `serious`/`critical`; un caso concreto se silencia con `disableRules` comentado y justificado.
- [Playwright descarga Chromium en cada run] → cachear `~/.cache/ms-playwright` por versión del lockfile.
- [Tests estructurales de `ci.yml` frágiles ante refactors del workflow] → se asertan comandos, no posiciones ni indentación.
