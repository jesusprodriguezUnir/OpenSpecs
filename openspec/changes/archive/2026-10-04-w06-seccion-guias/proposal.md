Roadmap: 06 · docs/proyecto/04-roadmap-de-changes.md

## Why

Las cinco páginas de Guías son marcadores ("Página en preparación"). `/guias/formato-de-specs/` es el destino del último "Siguiente paso" de Empieza (w05), así que el recorrido Inicio termina hoy en una página vacía. Sin Guías, el lector aprende a instalar OpenSpec pero no a escribir specs ni a usar el flujo `/opsx` con criterio.

## What Changes

- Redactar en es-ES `/guias/formato-de-specs/`, `/guias/flujo-opsx/`, `/guias/recetas/`, `/guias/brownfield/` y `/guias/configuracion/` a partir de `docs/openspec-kb/03`, `04`, `05` y `09` (y `01` para brownfield), actualizadas a OpenSpec 1.14 según `docs/proyecto/07-novedades-openspec-1.14.md` y `openspec --help`.
- Los ejemplos de deltas ADDED/MODIFIED/REMOVED se muestran con marcadores de diff de Expressive Code (líneas insertadas y eliminadas).
- Cada página termina con "Siguiente paso": formato-de-specs → flujo-opsx → recetas → brownfield → configuracion → `/agentes/claude-code/`.
- Los comandos de terminal de `recetas` y `configuracion` usan pestañas sincronizadas PowerShell/bash.
- Correcciones respecto a la KB 1.13: `/opsx:sync` fusiona deltas en las specs principales (no "sincroniza el estado"); se añaden `/opsx:update` y los bloques `operations.apply/archive.guidance` de `config.yaml`; `openspec schema` se marca como experimental.
- Ejemplos migrados del dominio académico de la KB al dominio neutro "gestión de reservas".

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `contenido`: añade requisitos de la sección Guías (sin marcadores, orden, cadena "Siguiente paso", bloques diff en Escribir specs, pestañas de shell). Frontmatter y presencia en el sidebar ya los cubren `contenido` y `navegacion`.

## Fuera de alcance

- Páginas de Con tu agente, En equipo y Referencia (w07, w08); `/agentes/claude-code/` sigue siendo un marcador.
- Componentes nuevos u overrides de Starlight.
- Calidad editorial del texto (se revisa en la PR, no en specs).
- Plantillas descargables (w08).

## Impacto

- `src/content/docs/guias/*.md` → `.mdx` (necesario para `Tabs`/`Aside`).
- Tests E2E nuevos en `tests/e2e/guias.spec.ts`.
- Sin JavaScript de cliente nuevo (solo el script ya existente de las Tabs de Starlight), sin terceros ni almacenamiento en el navegador más allá del que ya usan las Tabs sincronizadas de Starlight: sin impacto LSSI-CE/RGPD.
- Sin dependencias nuevas: Expressive Code ya viene con Starlight.

## Preguntas abiertas

_Ninguna._ Resueltas antes de proponer: rama apilada sobre `w05-seccion-empieza`; cadena "Siguiente paso" hasta `/agentes/claude-code/`; el requisito de diff no fija la sintaxis; pestañas solo en recetas y configuración.
