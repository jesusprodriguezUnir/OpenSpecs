# ADR-0002 · Ampliar los overrides de Starlight con `PageSidebar`

- **Estado**: Aceptado (02/11/2026)
- **Decisores**: Jesús
- **Contexto técnico**: Astro 7.3.x, Starlight 0.42.5 (versión exacta), change `w18-rediseno-visual`
- **Sustituye en parte a**: la nota de [ADR-0001](./02-adr-0001-stack.md) que limita los overrides a `Head`, `Hero` y `Footer`

## Contexto

ADR-0001 limita los overrides de componentes de Starlight porque acoplan el sitio a su API interna. En la práctica la lista ya incluía `PageTitle` (cabecera de metadatos de las guías, w05) y así lo recoge `CLAUDE.md`.

El rediseño visual (w18) añade a las guías una caja «Comandos de esta página» con los comandos declarados en el campo `commands` del frontmatter. El diseño la sitúa en la columna derecha, bajo «En esta página». Esa columna la renderiza `PageSidebar`, que no estaba en la lista.

## Opciones consideradas

| Opción | Cómo | Pros | Contras |
|---|---|---|---|
| A. Override de `PageSidebar` | Renderiza `<Default />` y, después, la caja. Bajo `lg` la columna no existe, así que `PageTitle` pinta la misma caja dentro del contenido | Fiel al diseño; el TOC sigue siendo el de Starlight | Un override más; dos puntos de render (solo uno visible por viewport) |
| B. Solo `PageTitle` | La caja va al principio del contenido en todos los viewports | Sin overrides nuevos | Se aparta del diseño en escritorio |
| C. Recolocar con CSS | La caja de `PageTitle` se posiciona en la columna derecha | Ninguno real | Frágil y rompe el orden de lectura |

## Decisión

**Opción A.** Overrides permitidos: `Head`, `Hero`, `Footer`, `PageTitle` y `PageSidebar`, todos en `src/components/overrides/`.

- `PageSidebar` envuelve el componente por defecto sin reimplementarlo y solo añade la caja cuando la página tiene tabla de contenidos y `commands`.
- La caja es un componente compartido (`src/components/ComandosPagina.astro`). Cada copia lleva las utilidades de Starlight (`sl-hidden lg:sl-block` en la columna, `lg:sl-hidden` en el contenido), así que en cada viewport hay una sola región visible y la otra queda con `display: none`, fuera del árbol de accesibilidad.
- Sin JavaScript de cliente.

## Consecuencias

**Positivas**
- La columna derecha sigue el diseño sin reimplementar el TOC de Starlight.
- Un test E2E comprueba que la región es visible a 1440 y a 360 px y que no aparece en páginas sin `commands`.

**Negativas / a vigilar**
- Una actualización de Starlight puede cambiar el marcado de `PageSidebar` o las utilidades `sl-hidden` y `lg:sl-*`. La versión está fijada y los tests de la caja lo detectan al subir.
- La lista de overrides crece a cinco. Cualquier override nuevo necesita otro ADR.
