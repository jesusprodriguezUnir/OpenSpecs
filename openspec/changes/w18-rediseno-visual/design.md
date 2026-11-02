# Design

## Context

Motivación y alcance en `proposal.md`. Estado actual relevante:

- `astro.config.mjs` sobrescribe `Hero`, `PageTitle` y `Footer` (este último de w11). ADR-0001 (`docs/proyecto/02-adr-0001-stack.md`) limita los overrides a `Head`, `Hero` y `Footer`; `CLAUDE.md` añade `PageTitle`.
- `src/styles/custom.css` define la paleta teal de w13 sobre `--sl-color-*` (oscuro por defecto, `[data-theme='light']`) e importa IBM Plex Sans/Mono de `@fontsource`.
- La home (`src/content/docs/index.mdx`, `template: splash`) compone `Hero.astro`, `InfografiaSdd`, `CicloPasos` y `Recorridos`. `InfografiaSdd` también lo usa `src/pages/manual.astro`.
- `src/lib/content-rules.ts` extiende `docsSchema` con `guideMetadataSchema` (Zod de `astro/zod`) y `validateGuideFrontmatter` produce los mensajes de error del build.
- `src/lib/manual-order.ts` ya expone `referenceVersion(entries)`; `src/config/manual.mjs` expone `MANUAL_PDF_PATH` y `MANUAL_PDF_SIZE` (calculado de `src/data/manual.json`).
- Los prototipos `Main.dc.html` y `Docs.dc.html` son referencia visual; su copy y sus cifras no se toman como datos.

## Goals / Non-Goals

**Goals:**
- Aplicar el lenguaje visual del prototipo solo con CSS, tokens y componentes Astro estáticos.
- Mantener 0 KB de JS propio, Lighthouse ≥ 95, LCP < 2 s y CLS < 0,05 en `/` (budgets de `06-calidad-seo-legal.md`).
- Que todo dato visible (tamaño del PDF, versión, número de páginas, paso N de M, comandos) salga del build, no del prototipo.
- Conservar el JSON-LD `WebSite`, las etiquetas OG y el `<title>` actuales de `/`.

**Non-Goals:**
- Override de `Header`, `Pagination`, `Search` o `ThemeSelect`.
- Cambiar la estructura del sidebar o las etiquetas de sus grupos.
- Tocar el contenido de `/manual/` salvo lo que herede de los tokens.

## Decisions

### D1. Tokens: mapeo sobre las variables de Starlight

Se redefinen `--sl-color-*` en `custom.css`, sin un sistema de tokens paralelo, para que búsqueda, selector de tema, sidebar, TOC y paginación hereden la paleta sin overrides. Se añaden solo los tokens propios necesarios (`--os-surface`, `--os-border`, `--os-tag-*`).

| Token | Claro | Oscuro |
|---|---|---|
| `--sl-color-black` (fondo) | `#FAFAF7` | `#121317` |
| `--sl-color-white` (texto) | `#16181D` | `#ECEDEF` |
| `--sl-color-gray-3` (texto secundario) | `#5B5F69` | `#A3A7B1` |
| `--sl-color-gray-6` / `--os-border` | `#E3E4DE` | `#2E3139` |
| `--sl-color-gray-7` / `--os-surface` | `#FFFFFF` | `#1A1C21` |
| `--sl-color-accent` | `#3338C9` | `#A5A9FF` |
| `--sl-color-accent-high` (hover) | `#1F2390` | `#C7C9FF` |
| `--sl-color-accent-low` | `#EEEFF9` | `#1E2150` |

Etiquetas de delta (fondo / texto):

| Etiqueta | Claro | Oscuro |
|---|---|---|
| ADDED | `#EEF7F1` / `#17603C` | `#12301F` / `#8FD4AE` |
| MODIFIED | `#FBF3E6` / `#7A4800` | `#33260F` / `#F0C67A` |
| REMOVED | `#FCEEEC` / `#9B1C12` | `#3A1612` / `#F4A69C` |
| RENAMED | `#EEEFF9` / `#2A2E9E` | `#1E2150` / `#C3C6FF` |

Los valores oscuros son una propuesta; el contraste AA (≥ 4,5:1 en texto normal) se garantiza con un test unitario sobre la tabla (`src/lib/contrast.ts`, función pura de luminancia relativa WCAG) además de axe en ambos temas. El gris secundario claro `#5B5F69` sustituye cualquier gris del prototipo que no llegue a 4,5:1 sobre `#FAFAF7`.

- Alternativa descartada: un tema nuevo con variables propias y reestilizar cada componente de Starlight. Exige más CSS y overrides para llegar al mismo sitio.

### D2. Fuentes

Se mantienen IBM Plex Sans/Mono desde `@fontsource` (ya en el stack, ADR-0001); no hay dependencias nuevas. Se conservan solo los pesos que use el diseño final y la precarga actual del woff2 del `h1`.

- Alternativa descartada: Google Fonts, porque pone un tercero y contradice LSSI-CE/RGPD (`06-calidad-seo-legal.md`).

### D3. Home: componentes estáticos nuevos y retirada de los antiguos

- `Hero.astro` (override existente) pasa a: `h1` desde `hero.title`, tagline, CTA primario «Tu primer cambio en 30 minutos», CTA secundario, enlace al PDF con `MANUAL_PDF_SIZE`, píldora «OpenSpec <versión>» con `referenceVersion()` y la figura de delta spec. La terminal se elimina.
- Componentes nuevos en `src/components/home/`: `DeltaSpecFigura`, `CicloChange`, `DosCarpetas`, `EnEquipo`, `ParaLlevartelo`. `Recorridos.astro` se reescribe con el orden nuevo y el número de páginas; `CicloPasos.astro` se borra cuando `CicloChange` lo sustituye.
- `InfografiaSdd.astro` se conserva sin cambios porque la usa `/manual/`; solo se quita de `index.mdx`.
- Número de páginas de cada recorrido: el número de enlaces del grupo de la sección en la configuración del sidebar autogenerado, calculado en el build con `getCollection('docs')` y el prefijo de la sección; el helper es puro y tiene test unitario.
- La revisión humana del ciclo no es un comando: se presenta como paso sin `/opsx:`. `verify` se marca «perfil ampliado» y enlaza a `/referencia/comandos-chat/`.
- Alternativa descartada: mantener `CicloPasos` y añadirle pasos. Su marcado y su franja animada dependen de la terminal, y reescribirlo cuesta lo mismo.

### D4. Figura de delta spec accesible

`<figure>` con `<figcaption>` visible (da nombre accesible). El fragmento es texto HTML (`<pre><code>`) con keywords en inglés y contenido en español (dominio de reservas, sin datos personales). La tira de pestañas `proposal.md · specs · design.md · tasks.md` y los marcadores `+`/`~` van en elementos `aria-hidden="true"` y no son interactivos: nada de `role="tab"`, `<button>` ni JS. Del pie del prototipo se elimina «0/12 tareas» y «Aún no hay código»; el recuento de escenarios se calcula del propio fragmento (constante del componente) para que no pueda desalinearse.

- Alternativa descartada: pestañas funcionales con `:target` o radios CSS. Simulan un widget de pestañas sin su semántica y el lector de pantalla las anunciaría mal.

### D5. Sidebar numerado y paginación en tarjeta: solo CSS

- Numeración: un contador CSS sobre los `details` de primer nivel del sidebar, `::before` con `content: counter(grupo, decimal-leading-zero) " · " / ""` (texto alternativo vacío, así queda fuera del nombre accesible), y se reinicia o se omite en los dos últimos grupos con `:nth-child`. No se tocan las etiquetas.
- Paginación: reestilizado de los enlaces existentes de Starlight.
- Alternativa descartada: override de `Sidebar`. Duplicaría la lógica de Starlight solo para añadir un prefijo.
- Riesgo: el selector depende del marcado de Starlight; un test E2E (scenarios de `navegacion`) lo vigila al subir de versión.

### D6. Banner de progreso y píldoras dentro de `PageTitle`

`PageTitle.astro` (override ya permitido) renderiza encima de `<Default />` el banner «<grupo> · paso N de M», con N y M calculados por una función pura `progressInGroup(sidebar, currentHref)` en `src/lib/progress.ts` sobre `Astro.locals.starlightRoute.sidebar`; devuelve `null` si el grupo tiene menos de dos páginas o la página no está en ningún grupo. La barra es un `<span aria-hidden="true">` con ancho en porcentaje inline (sin JS). Las píldoras de metadatos son el mismo `<dl data-guide-meta>` reestilizado.

- Alternativa descartada: calcular la posición con el `pagination` de Starlight. Cruza grupos y no da M.

### D7. Campo `commands`

Se añade a `guideMetadataSchema`: `z.array(z.string().regex(/^\/opsx:[a-z][a-z-]*$/)).min(1).max(8).refine(unique)`, optional. `validateGuideFrontmatter` añade el mensaje con el nombre del campo, igual que los demás. Se declara solo en guías cuyo cuerpo ya usa esos comandos (`empieza/que-es`, `empieza/primer-cambio`, `guias/flujo-opsx`, `guias/recetas`), sin contenido editorial nuevo. La coherencia con `/referencia/comandos-chat/` y con el cuerpo se comprueba en E2E reutilizando el helper `undocumentedCommands` de `tests/e2e/landing.spec.ts`, que se extrae a un módulo compartido.

### D8. Ubicación de la caja «Comandos de esta página» (aprobada: opción A)

El prototipo la pone en la columna derecha, bajo «En esta página». Esa columna la renderiza `PageSidebar`, que no está en la lista de overrides de ADR-0001 ni de `CLAUDE.md`.

| Opción | Cómo | Pros | Contras |
|---|---|---|---|
| A | Override de `PageSidebar` que renderiza `<Default />` y después la caja (`<aside aria-label="Comandos de esta página">`); bajo `lg` la columna no existe, así que `PageTitle` pinta la misma caja dentro del contenido con una clase visible solo bajo `lg` | Fiel al diseño | Override nuevo: exige ADR-0002 y actualizar `CLAUDE.md`; dos puntos de render (una sola región visible en cada viewport) |
| B | `PageTitle` pinta la caja al principio del contenido en todos los viewports | Sin overrides nuevos; un solo render | Se aparta del diseño en escritorio |
| C | Posicionar con CSS la caja de `PageTitle` en la columna derecha | Ninguno real | Frágil, rompe el flujo y el orden de lectura; descartada |

**Recomendación: A**, con `docs/proyecto/08-adr-0002-overrides.md` que amplíe la lista a `Head`, `Hero`, `Footer`, `PageTitle` y `PageSidebar` y el cambio de la línea correspondiente de `CLAUDE.md`. Las specs no fijan la ubicación (solo región, nombre, contenido y visibilidad a 1440 y 360 px), así que B sirve sin cambiarlas. `tasks.md` sigue A y marca el punto de aprobación; si se elige B, se omiten las tareas del ADR y del override.

### D9. Tests

- Nombres con `Scenario: <nombre>` para cada scenario de las cuatro deltas.
- `tests/e2e/landing.spec.ts`: se retiran los tests de terminal, «3 frases», ciclo de cuatro pasos e infografía; los de fidelidad de la infografía se mueven a `tests/e2e/manual.spec.ts` contra `/manual/`.
- `tests/e2e/accesibilidad.spec.ts`: guía en claro y en oscuro forzando `data-theme` como ya hace la landing.
- Unitarios: `progressInGroup`, número de páginas por recorrido, `commands` en `content-rules`, contraste de la tabla de tokens.
- `tests/e2e/script-budget.ts` sigue vigilando que `/` carga los mismos scripts que una guía.

## Risks / Trade-offs

- [w16 tiene una tarea que verifica la infografía en `landing.spec.ts`] → Si w18 se fusiona antes, esa verificación pasa a `/manual/`; se avisa en la PR y se reordena la tarea de w16.
- [El selector CSS del sidebar numerado depende del DOM de Starlight] → Test E2E de los scenarios de numeración; las versiones están fijadas en `package.json`.
- [El hero nuevo, con figura, puede empeorar LCP o CLS] → La figura es texto sin imágenes; se mantiene la precarga del woff2 del `h1` y `font-display: swap` con métricas de Plex; Lighthouse en CI mide los budgets.
- [Contraste del tema oscuro propuesto] → Test unitario de contraste y axe en ambos temas; un valor que falle se ajusta en la tabla, no con excepciones.
- [Si cambia el texto que renderiza `/manual/`, el PDF queda desfasado] → La comprobación «Manual PDF al día en CI» lo detecta; regenerar con `npm run manual:pdf`.
- [`Footer` es de w11] → Solo se reestiliza con tokens; no se toca su marcado.
- [`/opsx:verify` no está en la fixture de la CLI 1.14.0, y w16 decidió no presentarlo como comando] → En la home se muestra como paso del perfil ampliado, igual que en la infografía de w15, y la comprobación acepta workflows documentados en `/referencia/comandos-chat/`. Ver Open Questions.
- [Dos puntos de render de la caja de comandos en la opción A] → Un único `aside` visible por viewport (el otro con `display: none`, fuera del árbol de accesibilidad); un test cuenta regiones visibles.

## Migration Plan

Despliegue estático normal con preview de Vercel por PR. Sin datos ni almacenamiento que migrar. Rollback: revertir el merge; el PDF se regenera si cambió.

## Open Questions

- ~~¿Se aprueba el override de `PageSidebar` (opción A de D8)?~~ Resuelta: opción A, con ADR-0002 y la actualización de `CLAUDE.md`.
- Resuelta: la home no muestra fecha de revisión.
- Resuelta: el banner de progreso muestra solo el nombre del grupo, sin prefijo «Recorrido».
- Resuelta: se adopta el orden de recorridos del prototipo (Inicio, Equipo, Consulta).
- Resuelta: `verify` se muestra como `/opsx:verify` marcado «perfil ampliado», como en la infografía de w15.
