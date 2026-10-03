# ADR-0001 · Stack de la web: Astro 7 + Starlight, estático en Vercel

- **Estado**: Propuesto (03/10/2026)
- **Decisores**: Jesús
- **Contexto técnico**: Astro 7.3.x, Starlight 0.42.x, Node ≥ 22.12, OpenSpec 1.14.0

## Contexto

Necesitamos un sitio de documentación/guía en español, rápido, con buena navegación, búsqueda y bloques de código, mantenible por una persona con Claude Code y que sirva de ejemplo de proyecto gobernado por OpenSpec. Se valora experiencia previa con Astro (content collections + Zod, islands, Vercel).

## Opciones consideradas

| Criterio | A. Starlight | B. Astro a medida | C. Docusaurus / VitePress |
|---|---|---|---|
| Tiempo hasta v1 | **Bajo**: sidebar, búsqueda, TOC, dark mode, i18n, a11y de serie | Alto: todo a mano | Bajo |
| Control de diseño | Medio: overrides de componentes + CSS custom properties + `template: splash` | **Total** | Medio |
| Bloques de código | Expressive Code (títulos, diff, marcadores, copiar) | Shiki a mano | Prism/Shiki |
| Content collections + Zod | Sí (`docsSchema({ extend })`) | Sí | No (React/Vue) |
| Coherencia con el stack del autor | **Alta** (Astro) | Alta | Baja |
| Riesgo de upgrade | Starlight sigue en 0.x: breaking changes en minors | Bajo | Bajo |
| Valor como ejemplo para la audiencia | Alto: es lo que muchos equipos usarían | Medio | Medio |

## Decisión

**Opción A: Starlight sobre Astro 7**, salida estática (`output: 'static'`, por defecto), desplegada en Vercel **sin adapter**.

- Landing con `template: splash` y componentes propios (`Hero` override si hace falta).
- Locale `root` con `lang: 'es-ES'` → URLs sin prefijo.
- Frontmatter extendido con Zod (`openspecVersion`, `lastReviewed`, `level`, `duration`).
- Colección adicional `changelog` con `glob()` loader apuntando a `openspec/changes/archive/**/proposal.md` para la página "Cómo se hizo esta web".
- Colección `resources` (YAML + Zod) para la página de recursos, en lugar de Markdown suelto.

## Consecuencias

**Positivas**
- v1 en días, no semanas. El esfuerzo va al contenido, que es el valor del producto.
- Pagefind indexa en build: búsqueda sin servicio externo ni cookies.
- La validación del frontmatter rompe el build → las reglas editoriales son **testables** y pueden especificarse como Requirements.

**Negativas / a vigilar**
- Starlight 0.x: **fijar versión exacta** (`"@astrojs/starlight": "0.42.5"`) y actualizar en change dedicado (receta de refactor, `--skip-specs` si no cambia comportamiento).
- Los overrides de componentes acoplan a la API interna de Starlight: limitarlos a `Head`, `Hero` y `Footer`.
- View Transitions: Starlight no las usa de serie; activarlas con `<ClientRouter />` rompe parte del JS de Starlight (búsqueda, tabs). **No incluir en v1**.
- Si en el futuro se necesita SSR (p. ej. formulario), añadir `@astrojs/vercel` y marcar solo esas rutas con `export const prerender = false`.

## Alternativas descartadas

- **B (Astro a medida)**: más control, pero reimplementar búsqueda, sidebar accesible y TOC no aporta valor al usuario final.
- **C**: fuera del stack del autor y sin content collections tipadas.

## Testing (implicación directa en las specs)

| Nivel | Herramienta | Cubre |
|---|---|---|
| Tipos y contenido | `astro check` + build (Zod) | Esquema de frontmatter, colecciones |
| Unitario | Vitest | Utilidades (p. ej. parseo de changes archivados) |
| E2E | Playwright contra `astro preview` | Escenarios de navegación, SEO, búsqueda, 404 |
| Enlaces | `lychee` o comprobador sobre `dist/` | Enlaces internos y externos |
| Calidad | Lighthouse CI (opcional) | Umbrales de rendimiento/a11y |

Cada Scenario de `openspec/specs/` debe mapear a un test de Playwright o Vitest, o a una regla de build documentada.
