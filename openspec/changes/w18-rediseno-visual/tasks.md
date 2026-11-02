# Tasks

## 0. Decisiones previas

- [x] 0.1 Recoger la respuesta del autor a las Open Questions de `design.md` (override de `PageSidebar`, fecha en la home, prefijo del banner, orden de recorridos, presentación de `verify`) y, si alguna cambia una delta, ajustarla y verificar con `openspec validate w18-rediseno-visual --strict --no-interactive`

## 1. Tokens y CSS global

- [x] 1.1 Crear `src/lib/contrast.ts` (luminancia relativa y ratio WCAG) y la tabla de tokens de D1 como datos; test Vitest que exige ≥ 4,5:1 en texto/fondo y en cada etiqueta de delta para los dos temas, y verificar con `npx vitest run tests/unit/contrast.test.ts`
- [ ] 1.2 Sustituir la paleta teal de `src/styles/custom.css` por los tokens de D1 (`--sl-color-*` en `:root` oscuro y `[data-theme='light']`, más `--os-surface`, `--os-border`, `--os-tag-*`) y verificar en `npm run dev` que búsqueda, selector de tema, sidebar y TOC cambian de color en ambos temas
- [x] 1.3 Ajustar los imports de `@fontsource` a los pesos usados y conservar la precarga del woff2 del `h1`; verificar que siguen pasando los tests `Scenario: Fuentes servidas desde el propio sitio` y `Scenario: Sin Google Fonts`
- [ ] 1.4 Reestilizar con tokens la paginación anterior/siguiente como tarjetas y el `Footer` de w11 sin cambiar su marcado; verificar visualmente a 1440 y 360 px y que `tests/e2e/legal.spec.ts` sigue en verde

## 2. Home

- [x] 2.1 Reescribir el hero en `src/components/overrides/Hero.astro` (`h1` desde `hero.title`, CTA «Tu primer cambio en 30 minutos», CTA secundario, enlace al PDF con `MANUAL_PDF_SIZE`, píldora con `referenceVersion()`, sin terminal) y actualizar `index.mdx`; tests `Scenario: CTA primario al primer cambio`, `Scenario: CTA secundario a qué es OpenSpec`, `Scenario: Destinos de los CTA existen`, `Scenario: Enlace al manual PDF con su tamaño real` y `Scenario: Versión de OpenSpec de referencia en el hero` en `tests/e2e/landing.spec.ts`
- [x] 2.2 Crear `src/components/home/DeltaSpecFigura.astro` según D4 y montarla en el hero; tests `Scenario: Figura con nombre accesible y texto de spec`, `Scenario: Pestañas decorativas no interactivas` y `Scenario: Recuento de escenarios coherente`
- [x] 2.3 Añadir un helper puro de número de páginas por sección en `src/lib/` con test Vitest, y reescribir `src/components/Recorridos.astro` (encabezado «¿Desde dónde partes?», orden Inicio, Equipo, Consulta, número de páginas); tests `Scenario: Recorridos con su destino`, `Scenario: Equipo marcado como recomendado`, `Scenario: Consulta menciona la búsqueda` y `Scenario: Número de páginas coherente con el sidebar`
- [x] 2.4 Crear `src/components/home/CicloChange.astro` (seis pasos, enlaces a `/guias/flujo-opsx/` y `/guias/recetas/`), sustituir `CicloPasos` en `index.mdx` y borrar `CicloPasos.astro`; tests `Scenario: Seis pasos en orden`, `Scenario: Cada paso tiene descripción` y `Scenario: Paso opcional y paso del perfil ampliado marcados`
- [x] 2.5 Extraer `undocumentedCommands` y `chatReference` de `tests/e2e/landing.spec.ts` a `tests/e2e/opsx-commands.ts` y añadir los tests `Scenario: Comandos /opsx de la home documentados` y `Scenario: Comando inexistente en la home detectado`
- [x] 2.6 Crear `DosCarpetas.astro`, `EnEquipo.astro` y `ParaLlevartelo.astro` en `src/components/home/` y montarlos en `index.mdx`; tests `Scenario: Carpetas y etiquetas presentes`, `Scenario: Enlace a conceptos`, `Scenario: Enlaces de En equipo` y `Scenario: Enlaces de Para llevártelo`
- [x] 2.7 Quitar de `index.mdx` el bloque «3 frases» e `<InfografiaSdd />` (el componente se conserva para `/manual/`), y borrar de `landing.spec.ts` los tests de terminal, tres frases, ciclo de cuatro pasos, animaciones finitas e infografía; verificar con `npx playwright test tests/e2e/landing.spec.ts`
- [x] 2.8 Garantizar que `/` no tiene animaciones ni transiciones con movimiento reducido y no desborda a 360 px, con SVG decorativos `aria-hidden`; tests `Scenario: Sin animaciones con prefers-reduced-motion`, `Scenario: Home sin desbordamiento horizontal a 360 px` e `Scenario: Iconos de la home ocultos a tecnologías de apoyo`
- [x] 2.9 Verificar que siguen en verde `Scenario: Mismos scripts que una guía`, `Scenario: Script extra detectado`, los dos de «Landing accesible» (tema oscuro y claro) y los tests de `tests/e2e/seo.spec.ts` (JSON-LD `WebSite`, OG y `<title>` de `/`)

## 3. Infografía en el manual

- [x] 3.1 Mover a `tests/e2e/manual.spec.ts` las comprobaciones de fidelidad contra `/manual/` con los tests `Scenario: Comandos /opsx del manual documentados`, `Scenario: Comando inexistente en el manual detectado`, `Scenario: Comando del perfil ampliado marcado en el manual`, `Scenario: Rutas y artefactos correctos en el manual` y `Scenario: Manual sin referencias a un stack concreto`; verificar con `npx playwright test tests/e2e/manual.spec.ts`

## 4. Navegación de las guías

- [x] 4.1 Añadir en `custom.css` el contador de los cinco primeros grupos del sidebar (D5) con texto alternativo vacío; tests `Scenario: Prefijos en orden`, `Scenario: Grupos sin número` y `Scenario: Prefijo fuera del nombre accesible` en `tests/e2e/navegacion.spec.ts`
- [x] 4.2 Crear `src/lib/progress.ts` con `progressInGroup(sidebar, currentHref)` y su test Vitest (primera página, última, grupo de una página, página fuera del sidebar); verificar con `npx vitest run tests/unit/progress.test.ts`
- [x] 4.3 Renderizar el banner en `src/components/overrides/PageTitle.astro` con barra `aria-hidden`; tests `Scenario: Primera página de Empieza`, `Scenario: Posición según el orden del sidebar`, `Scenario: Barra decorativa oculta` y `Scenario: Páginas sin banner`
- [x] 4.4 Reestilizar la cabecera de metadatos como píldoras manteniendo el `<dl>`; tests `Scenario: Cabecera completa en una guía`, `Scenario: Guía sin duración`, `Scenario: Página fuera de guías sin cabecera` y `Scenario: Cada dato con su término` en `tests/e2e/contenido.spec.ts`

## 5. Campo commands y su caja

- [x] 5.1 Añadir `commands` a `guideMetadataSchema` y su mensaje en `validateGuideFrontmatter` (D7); tests Vitest `Scenario: Lista de comandos válida`, `Scenario: Comando con forma inválida`, `Scenario: Comando repetido` y `Scenario: Lista vacía o demasiado larga` en `tests/unit/content-rules.test.ts`
- [x] 5.2 Declarar `commands` en `empieza/que-es`, `empieza/primer-cambio`, `guias/flujo-opsx` y `guias/recetas` solo con comandos que ya aparecen en su cuerpo; tests `Scenario: Comandos declarados documentados` y `Scenario: Comando declarado ausente del cuerpo`
- [x] 5.3 Si se aprueba la opción A de D8: escribir `docs/proyecto/08-adr-0002-overrides.md`, actualizar la lista de overrides de `CLAUDE.md` y registrar `PageSidebar` en `astro.config.mjs`; verificar con `npx astro check`. Si se elige B, marcar esta tarea como no aplicable
- [x] 5.4 Renderizar la caja «Comandos de esta página» (opción aprobada en D8) con un único `aside` visible por viewport; tests `Scenario: Caja con los comandos declarados`, `Scenario: Página sin commands` y `Scenario: Caja visible en escritorio y en móvil`

## 6. Accesibilidad y calidad

- [x] 6.1 Añadir en `tests/e2e/accesibilidad.spec.ts` los tests `Scenario: Página de guía en tema claro sin violaciones graves` y `Scenario: Página de guía en tema oscuro sin violaciones graves`, y verificar que siguen en verde `Scenario: Una página de guía sin violaciones graves de accesibilidad`, `Scenario: La 404 sin violaciones graves de accesibilidad` y `Scenario: Una violación grave falla el test`
- [ ] 6.2 Medir con Lighthouse sobre `npm run preview` la home y una guía en ambos temas: rendimiento y accesibilidad ≥ 95, LCP < 2 s, CLS < 0,05 y 0 KB de JS propio en `/`; revisar a 360 px según la DoD de `05-convenciones.md`
- [x] 6.3 Si cambió el texto que renderiza `/manual/`, regenerar el PDF con `npm run manual:pdf` y verificar que la comprobación «Manual PDF al día en CI» pasa

## 7. Verificación final

- [x] 7.1 Ejecutar `npx astro check`, `npm run build`, `npm run test`, `npm run test:e2e` y `openspec validate --all --strict --no-interactive`, todos en verde
- [ ] 7.2 Lanzar el subagente `spec-verifier` sobre `w18-rediseno-visual` y resolver sus hallazgos antes de archivar
