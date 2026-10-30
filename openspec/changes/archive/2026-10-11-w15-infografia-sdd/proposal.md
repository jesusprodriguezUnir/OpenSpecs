Fuera de roadmap: petición del autor de mostrar una infografía de resumen de OpenSpec en la portada de la web y en el manual.

# Proposal

## Why

El autor quiere una infografía-resumen de OpenSpec («mapa visual» del método) visible nada más entrar en la web y en el manual. La referencia visual (`docs/Desarrollo_guiado_por_especificaciones (1).png`, generada con IA) tiene el estilo deseado pero no es publicable: contiene rutas y comandos erróneos (`openspec/apecs/`, `ropax:archive`), una tabla ilegible, texto corrupto y un enfoque «.NET y Angular» ajeno al sitio. En una web que enseña OpenSpec, publicar comandos incorrectos resta credibilidad y contradice la regla de no inventar comandos.

## What Changes

- Nueva infografía «OpenSpec: desarrollo guiado por especificaciones con IA» rehecha como contenido propio, con el mismo lenguaje visual que la referencia (paneles numerados, iconos planos de colores, ciclo de los cuatro artefactos, fila de comandos `/opsx`), sin menciones a .NET ni Angular.
- Todo el texto de la infografía es texto real (no rasterizado) y se contrasta con las guías del sitio y con OpenSpec 1.14: rutas `openspec/specs/` y `openspec/changes/`, artefactos `proposal.md`, `specs/`, `design.md`, `tasks.md`, comandos `/opsx:*` (indicando cuáles son del perfil ampliado) y `openspec validate --all --strict`.
- Bloques propuestos (adaptados de la referencia):
  1. Fundamentos: SDD frente a prompts directos, enfoque brownfield, `specs/` como fuente de verdad y `changes/` como deltas, compatibilidad con más de 40 asistentes.
  2. Los cuatro artefactos de un change.
  3. El ciclo diario con `/opsx`.
  4. En equipo: backlog (Jira/Azure DevOps vía MCP de solo lectura), validación en CI y regla de oro (no editar `openspec/specs/` a mano).
  Se eliminan la «Comparativa de adopción SDD» de la referencia (ilegible y sin fuente en el sitio) y el bloque «Plan de adopción e indicadores» (decisión del autor: ya tiene su guía en `/equipo/adopcion/` y saturaría la portada).
- La landing (`/`) muestra la infografía en un bloque propio tras «Qué es OpenSpec en 3 frases», con enlace a las guías de cada bloque.
- El manual (`/manual/` y `/manual-openspec.pdf`) incluye la infografía en una página propia entre la portada y el capítulo «00 · Cómo usar este manual».
- Se regenera `public/manual-openspec.pdf` (el control de hash de CI lo exige).

JavaScript de cliente, terceros y almacenamiento: no añade JavaScript de cliente, ni terceros, ni almacenamiento en el navegador. Sin impacto LSSI-CE/RGPD.

## Capabilities

### New Capabilities

Ninguna. El comportamiento se reparte entre dominios existentes.

### Modified Capabilities

- `landing`: nuevo requisito «Infografía del método» (presencia, posición, alternativa textual accesible, enlaces a guías, sin JS) y ampliación de la accesibilidad en tema claro y oscuro.
- `contenido`: el requisito «Maquetación del manual como libro» pasa a incluir una página de infografía entre la portada y el capítulo 00.

## Impact

- Código: nuevo componente de infografía en `src/components/` (HTML + CSS + SVG de iconos en línea), `src/content/docs/index.mdx`, `src/pages/manual.astro`.
- Artefacto binario: `public/manual-openspec.pdf` regenerado con `npm run manual:pdf`.
- Tests: `tests/e2e/landing.spec.ts`, `tests/e2e/manual.spec.ts`, `tests/e2e/accesibilidad.spec.ts`.
- Rendimiento: el bloque se sitúa por debajo del hero, así que no compite por el LCP; vigilar el peso del HTML y el CLS < 0,05.
- Sin dependencias nuevas.

## Fuera de alcance

- Publicar la imagen de referencia PNG tal cual o una versión rasterizada.
- Versión en inglés u otros idiomas de la infografía.
- Infografía interactiva (tooltips, zoom, animaciones con JS).
- Cambios en el contenido de las guías enlazadas.
- Imagen Open Graph basada en la infografía.

## Preguntas abiertas

- ~~¿Se mantiene el bloque 5 («Plan de adopción e indicadores»)?~~ Resuelta: cuatro bloques; la adopción queda en `/equipo/adopcion/`.
- ¿Debe ofrecerse además la infografía como descarga independiente (SVG/PNG) para usarla en presentaciones?
- ¿Crédito de autoría visible en la infografía (nombre del autor) o basta con el pie del sitio?
