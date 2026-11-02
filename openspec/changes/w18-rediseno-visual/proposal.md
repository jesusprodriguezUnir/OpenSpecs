Fuera de roadmap: rediseño visual de la home y de las páginas de guía pedido por el autor a partir de los prototipos `Main.dc.html` y `Docs.dc.html`.

## Why

La landing de w13 (terminal animada, «3 frases», infografía de w15 y ciclo de cuatro pasos) se ha quedado larga y centrada en la herramienta, y las guías siguen con el aspecto por defecto de Starlight. El prototipo nuevo resume el método en una frase («Acuerda qué construir antes de pedírselo a tu agente.»), lo muestra con un ejemplo real de delta spec y da a las guías orientación de recorrido (grupo numerado, paso N de M, comandos de la página). Se hace ahora porque el contenido de w17 ya está unificado y estable.

## What Changes

- **Tokens de color nuevos** en ambos temas: tema claro con fondo `#FAFAF7`, texto `#16181D`, bordes `#E3E4DE`, superficie `#FFFFFF` y acento índigo `#3338C9` (hover `#1F2390`); tema oscuro derivado con contraste AA. Colores semánticos para las etiquetas de delta (ADDED, MODIFIED, REMOVED, RENAMED). Sustituye la paleta teal de w13.
- **Home**:
  - Hero con `h1` nuevo, subtítulo, CTA primario a `/empieza/primer-cambio/` (sigue incluyendo «30 minutos»), CTA secundario a `/empieza/que-es/`, enlace al manual PDF con su tamaño real y la versión de OpenSpec de referencia calculada en el build.
  - Figura estática con la delta spec de un change `añadir-reservas`. Las pestañas `proposal.md`/`specs`/`design.md`/`tasks.md` son decorativas (sin `role="tab"`, sin botones, sin JS). Los contadores ilustrativos del prototipo («8 escenarios», «0/12 tareas») se eliminan o se calculan a partir del contenido de la propia figura.
  - Secciones «¿Desde dónde partes?» (los tres recorridos con sus destinos actuales), «El ciclo de un change» (seis pasos en una lista ordenada con nombre accesible: explore opcional, propose, revisión humana, apply, verify del perfil ampliado y archive), «Dos carpetas, un modelo mental» (changes/ → archive → specs/ y etiquetas de delta), bloque oscuro «En equipo» (Jira, Azure DevOps, CI, gobierno y adopción) y «Para llevártelo» (manual PDF, recursos y cómo se hizo).
  - **BREAKING (spec)**: se retiran de la home la terminal decorativa, el bloque «Qué es OpenSpec en 3 frases» y la infografía SDD. La infografía sigue en `/manual/`; sus requisitos de fidelidad pasan a `contenido`.
  - **BREAKING (spec)**: el ciclo pasa de cuatro a seis pasos.
- **Páginas de guía**:
  - Grupos del sidebar numerados visualmente («01 · EMPIEZA»…) según el orden de `astro.config.mjs`, sin cambiar sus etiquetas.
  - Cabecera de metadatos (Nivel, Duración, OpenSpec, Revisado) presentada como píldoras; sigue siendo un `<dl>`.
  - Banner «<grupo> · paso N de M» con barra de progreso decorativa, calculado del orden del sidebar del grupo de la página.
  - Campo opcional de frontmatter `commands` (lista de comandos `/opsx:*`) que, si existe, muestra una caja «Comandos de esta página».
  - Paginación anterior/siguiente con aspecto de tarjeta (solo CSS).
- La búsqueda y el selector de tema de Starlight se reutilizan y solo se reestilizan con CSS.

## Capabilities

### New Capabilities
<!-- ninguna -->

### Modified Capabilities
- `landing`: cambia el hero (manual PDF y versión), los recorridos (orden y número de páginas), el ciclo (seis pasos) y el movimiento reducido; añade la figura de delta spec, «Dos carpetas», «En equipo», «Para llevártelo», comandos documentados y ausencia de desbordamiento a 360 px; retira la terminal, las «3 frases», las animaciones y la infografía.
- `navegacion`: añade la numeración de los grupos del sidebar y el banner de progreso dentro del grupo.
- `contenido`: modifica la cabecera de metadatos (píldoras, mismo contenido y semántica); añade el campo `commands` con su validación y su caja, y la fidelidad de la infografía del manual (trasladada desde `landing`).
- `calidad`: la comprobación con axe cubre la página de guía en tema claro y en tema oscuro.

## Impact

- **JavaScript de cliente**: no se añade ninguno. La home sigue con 0 KB de JS propio y carga los mismos scripts que una guía.
- **Terceros**: ninguno. Las fuentes siguen autoalojadas con `@fontsource` (IBM Plex Sans/Mono); nada de Google Fonts. Sin impacto LSSI-CE/RGPD.
- **Almacenamiento en el navegador**: sin cambios (solo la preferencia de tema de Starlight).
- **Dependencias nuevas**: ninguna.
- **Ficheros**: `src/styles/custom.css`, `src/components/overrides/{Hero,PageTitle}.astro`, `src/content/docs/index.mdx`, `src/components/Recorridos.astro`, `src/components/CicloPasos.astro`, componentes nuevos de la home en `src/components/`, `src/lib/content-rules.ts`, helper nuevo en `src/lib/`, frontmatter de las guías que declaren `commands`, `tests/e2e/{landing,accesibilidad,navegacion,contenido,manual}.spec.ts`, `tests/unit/`. Posible override adicional de Starlight para la caja de comandos (pendiente de aprobación, ver `design.md`).
- **Manual PDF**: si cambia el texto que renderiza `/manual/` habrá que regenerar el PDF (`npm run manual:pdf`).
- **Changes activos**: `w16-caso-completo-reservas` verifica la infografía de w15 en `tests/e2e/landing.spec.ts`; si w18 se fusiona antes, esa verificación debe ir solo contra `/manual/`. `w11-legal-y-analitica` es dueño del `Footer`; w18 solo lo reestiliza con tokens.

## Fuera de alcance

- Override del `Header` de Starlight: el menú horizontal «Principal» y el enlace «PDF» de la cabecera del prototipo no se implementan.
- Componentes propios de búsqueda o de cambio de tema.
- Cambiar las etiquetas de los grupos del sidebar o su orden.
- Textos «Paso 2 de 4 →» en la paginación (exigirían override de `Pagination`).
- Rediseño de `/manual/`, la 404 o las páginas legales más allá de lo que hereden de los tokens.
- Contenido editorial nuevo en las guías, salvo el frontmatter `commands`.
- Versión en inglés.

## Preguntas abiertas

- ¿Se aprueba un override de Starlight fuera de la lista de `CLAUDE.md` para colocar la caja «Comandos de esta página» en la columna derecha? Alternativas y recomendación en `design.md`.
- ¿Qué fecha de revisión muestra la home, si alguna? La landing no declara `lastReviewed`.
- ¿Qué prefijo lleva el banner de progreso? «Recorrido» choca con el glosario del sitio, donde los recorridos son Inicio, Equipo y Consulta.
- ¿Se adopta el orden de recorridos del prototipo (Inicio, Equipo, Consulta) en lugar del actual (Equipo, Inicio, Consulta)?
