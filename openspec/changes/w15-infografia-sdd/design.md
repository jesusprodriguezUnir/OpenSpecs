# Design

## Context

- La landing (`src/content/docs/index.mdx`, plantilla `splash`) tiene hoy tres bloques bajo el hero: «Qué es OpenSpec en 3 frases», «El ciclo de trabajo» (`CicloPasos.astro`) y «Elige tu recorrido» (`Recorridos.astro`). El presupuesto es de 0 KB de JavaScript propio, con LCP < 2,0 s y CLS < 0,05 (`docs/proyecto/06-calidad-seo-legal.md`).
- La landing usa el tema oscuro por defecto y admite el claro (`src/styles/custom.css`). El manual (`src/pages/manual.astro`) fuerza papel blanco con sus propios tokens `--m-*` y se imprime con Playwright a A4 (`scripts/manual-pdf.mjs`). CI compara el hash del PDF (`npm run manual:check`).
- La referencia visual es una infografía horizontal de unos 2752×1536 con fondo blanco, cinco paneles numerados, iconos planos de colores (azul, naranja, verde azulado, morado), un ciclo de cuatro flechas alrededor de «Change» y una fila de cinco comandos con icono.
- No existe `src/assets/`; los componentes de la landing viven en `src/components/` con nombres en español (`CicloPasos`, `Recorridos`).

## Goals / Non-Goals

**Goals:**
- Un único componente reutilizable en la landing y en el manual, con el contenido declarado una sola vez.
- Texto real, accesible e indexable, en el mismo estilo visual que la referencia.
- Cero JavaScript de cliente y ninguna dependencia nueva.

**Non-Goals:**
- Reproducir la referencia píxel a píxel ni sus ilustraciones complejas (planta, cerebro, robot): se sustituyen por iconos planos más simples con la misma paleta.
- Animación o interactividad.

## Decisions

### D1. HTML + CSS Grid con iconos SVG en línea, no una imagen
`src/components/InfografiaSdd.astro` renderiza un `<figure>` con `<figcaption>` (título) y cuatro `<section>` con encabezados `<h3>`. Los iconos son SVG en línea, decorativos y con `aria-hidden="true"`.
- **Alternativa descartada: SVG único con `<text>`.** El texto no reflota en móvil (habría que escalar todo el lienzo y a 360 px sería ilegible), la accesibilidad es frágil y el texto queda fuera del índice de búsqueda.
- **Alternativa descartada: PNG/WebP regenerado con `<Image />`.** Necesitaría un `alt` larguísimo o una transcripción aparte, no se podría indexar y cada errata obligaría a rehacer la imagen.

### D2. Contenido como datos tipados dentro del componente
Los bloques, los textos, los enlaces y la marca de «perfil ampliado» se declaran en un array en el frontmatter del componente, igual que `steps` en `CicloPasos.astro`. No se crea una colección de contenido: es un único elemento sin frontmatter editorial y una colección con Zod sería sobreingeniería.

### D3. Paleta fija «papel» en ambos temas
La infografía se dibuja siempre como una tarjeta clara (fondo blanco, tinta oscura) con la paleta de la referencia, asignada a tokens locales: `--ig-blue`, `--ig-orange`, `--ig-teal` (alineado con `--sl-color-accent` #0f8a85), `--ig-purple`, `--ig-ink` y `--ig-line`. Se comporta igual en el tema oscuro y en el claro y encaja con el manual, que ya es papel blanco.
- **Alternativa descartada: paleta adaptable a modo oscuro.** Duplica los tokens y el trabajo de contraste, y se aleja del estilo de la referencia que pide el autor.
- Todos los pares texto/fondo cumplen un contraste ≥ 4,5:1 (texto pequeño). Los colores saturados se usan solo en iconos, bordes y números, nunca como fondo de texto pequeño.

### D4. Maquetación
- Escritorio (≥ 72rem): rejilla 2×2 que imita la composición de la referencia. Bloque 1 arriba a la izquierda y bloque 3 (fila de comandos `/opsx`) arriba a la derecha. Abajo, el bloque 2 (ciclo de cuatro artefactos en una rejilla 2×2 alrededor de la etiqueta central «Change») y el bloque 4.
- Tablet (≥ 50rem): dos columnas.
- Móvil: una columna, en el orden 1→4 del DOM. Las flechas del ciclo se ocultan y los artefactos pasan a una lista.
- El orden del DOM es siempre 1→4; la rejilla no reordena visualmente (sin `order` CSS), así que el orden de lectura coincide con el visual.

### D5. Integración en la landing
Se inserta `<InfografiaSdd />` en `index.mdx` entre «Qué es OpenSpec en 3 frases» y «El ciclo de trabajo», con la clase `not-content` para evitar los estilos de prosa de Starlight. Queda por debajo del hero, así que no afecta al LCP. Las dimensiones de los iconos se fijan con `width`/`height` para no generar CLS.

### D6. Integración en el manual
`manual.astro` añade, entre `.cover` y `.howto`, `<section class="infografia-page" data-manual-infografia>` con el componente. En impresión:
- `break-before: page` y `break-after: page`.
- La página del manual es A4 vertical. La infografía se maqueta en dos columnas con un tamaño de letra reducido mediante una variable (`--ig-scale`) que la sección del manual redefine. Si en la prueba no cabe, se recurre a `@page infografia { size: A4 landscape }` con la propiedad `page: infografia`, que Chromium soporta.
- `print-color-adjust: exact` para conservar los colores de los iconos.
- Se regenera `public/manual-openspec.pdf` y se actualiza el hash que comprueba `manual:check`.

### D7. Contenido verificado (fuente de cada bloque)
| Bloque | Fuente en el sitio |
|---|---|
| 1 Fundamentos | `/empieza/que-es/`, `/empieza/conceptos/`, `/guias/brownfield/`, `/empieza/instalacion/` (más de 40 herramientas) |
| 2 Cuatro artefactos | `/guias/formato-de-specs/`, `/referencia/plantillas/` |
| 3 Ciclo `/opsx` | `/referencia/comandos-chat/`, `/guias/flujo-opsx/` (`verify` como perfil ampliado) |
| 4 En equipo | `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` (`openspec validate --all --strict`), con enlace a `/equipo/adopcion/` |

El bloque «Plan de adopción» de la referencia se descarta por decisión del autor.

ADR-0001: se respeta la salida estática, la ausencia de islas y las fuentes autoalojadas (IBM Plex Sans). No hay overrides nuevos de Starlight.

## Risks / Trade-offs

- **[Densidad en A4 vertical]**: con cuatro bloques debería caber, pero no está garantizado. Mitigación: la escala reducida y, si no basta, la página apaisada con nombre (D6). El escenario de altura lo detecta.
- **[Peso del HTML de la landing]**: unos 15–25 KB de marcado y SVG en línea, sin peticiones extra. Aceptable sin presupuesto de JS, pero hay que vigilar Lighthouse.
- **[Desfase con futuras versiones de OpenSpec]**: los textos pueden quedar desactualizados. Mitigación: el test de comandos contra `/referencia/comandos-chat/` falla en cuanto difieran.
- **[Contraste de la tarjeta clara sobre la landing oscura]**: es un salto visual fuerte. Se acepta porque replica el estilo pedido. La tarjeta lleva borde y radio para integrarse.
- **[Iconos simplificados]**: no se igualan las ilustraciones ricas de la referencia. Es un trade-off asumido a cambio de mantenibilidad y peso.
