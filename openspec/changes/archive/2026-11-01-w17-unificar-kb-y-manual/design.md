# Design

## Context

- Hay dos fuentes divergentes:
  - **la web**: 25 MDX en `src/content/docs/`, de las que salen `/manual/` y `public/manual-openspec.pdf`;
  - **la base de conocimiento del proyecto OpenSpecs en claude.ai**: 13 ficheros `openspec-kb/00–12`.
- La copia del repo (`docs/openspec-kb/`) tiene solo 00–10, en su versión de septiembre. CLAUDE.md la define como «fuente del contenido editorial (escrita para OpenSpec 1.13)».
- w14 ya fijó que **la web es la única fuente de verdad** del manual: el PDF previo del autor se usó como referencia y no se publica aparte. Este change aplica el mismo criterio a la base de conocimiento.
- El orden del manual sale de `MANUAL_GROUPS` (`src/lib/manual-order.ts`). Por directorio y `sidebar.order`, las páginas nuevas de `agentes/` y `equipo/` entran solas en `/manual/`. La ruta de lectura vive en `MANUAL_READING_ROUTE` (`src/config/manual.mjs`), y el build falla si referencia un slug que no existe.
- Portada: versión = la mayor `openspecVersion` de las páginas; fecha = el `lastReviewed` más reciente. Las dos son deterministas, así que la huella del PDF solo cambia con el contenido.
- La fixture de CLI (`tests/fixtures/openspec-cli-1.14.0.json`) no contiene `/opsx:verify` ni `/opsx:onboard`. Las páginas nuevas no los presentan como comandos disponibles en el perfil por defecto.
- Se aplica ADR-0001: salida estática, sin JS de cliente, sin terceros y fuentes autoalojadas.

## Goals / Non-Goals

**Goals:**
- Una sola edición publicada (web + PDF) que contenga todo lo que contiene la base de conocimiento, adaptado a las reglas editoriales del sitio.
- Un criterio de sincronización explícito para que las dos fuentes no vuelvan a divergir sin que se note.
- Un manual con acabado editorial: ruta de lectura completa y colofón con la ficha de edición.

**Non-Goals:**
- Automatizar la sincronización KB ↔ MDX. Son textos con propósitos distintos: la base de conocimiento es material interno para NotebookLM, con contexto del equipo del autor; la web es pública y neutra.
- Cambiar la maquetación base del manual de w14.

## Decisions

### D1 · Dirección de la unificación: KB → web, y la web es la canónica
Se incorpora a las MDX todo lo que solo estaba en la base de conocimiento. Después, `docs/openspec-kb/` se sincroniza con el proyecto (13 ficheros) y su índice (00) añade una nota: «La edición canónica y actualizada es https://openspec-ochre.vercel.app (y su PDF). Estos ficheros son material de trabajo para NotebookLM». La misma nota se escribe en el índice del proyecto de claude.ai.

**Alternativa descartada:** publicar la base de conocimiento tal cual como un anexo del PDF. Duplicaría contenido con matices contradictorios: los ficheros 03–08 están escritos para la 1.13 y la web para la 1.14. Además, metería referencias internas («fichero 06», stack .NET/Angular del autor) que incumplen las reglas editoriales del sitio.

### D2 · Dónde vive cada pieza nueva

| Origen (KB) | Destino (web) | Motivo |
|---|---|---|
| 12 · Roberto Canales | `/equipo/gobierno/` (nueva, order 4) | Es criterio de equipo y de gobierno, no del agente; precede a «Plan de adopción», que lo aplica |
| 11 · Skills Matt Pocock | `/agentes/skills/` (nueva, order 3) | Las skills se instalan en el agente; cierra el grupo «Con tu agente» |
| 09 (actualizado) | `/equipo/adopcion/` (order 4 → 5) | Fases, DoD, métricas, riesgos y checklist |
| 10 (actualizado) | `/referencia/faq/` | Cinco preguntas nuevas en «Flujo de trabajo» y «Equipo y herramientas» |
| 00 (glosario) | `/referencia/glosario/` | Nueva subsección «Gobierno del cambio» con seis términos |
| 02 (actualizado) | `src/data/resources.yaml` | Dos entradas `comunidad` |

Las dos páginas nuevas no cambian el número de grupos del sidebar (sigue habiendo siete, como exige `navegacion`).

**Alternativa descartada:** una sola página «Criterio y herramientas» con las dos cosas. Mezclaría dos audiencias (quien gobierna el proceso y quien configura el agente) y rompería la regla editorial «cada página responde a una pregunta».

### D3 · Adaptación editorial
- Ejemplos con el dominio de reservas: «el requisito *Cancelación con 24 h de antelación* y su test». No se usan Arkanoid ni el dominio académico de la KB.
- Sin «fichero NN». Cada referencia cruzada se convierte en un enlace interno a la página equivalente.
- Sin stack del autor. «Ajustar `tdd` a xUnit…» pasa a «ajustar `tdd` al framework de tests del proyecto».
- Atribución: se cita a la fuente en la entradilla y en «Para saber más», y se enlaza a `/recursos/`. Los títulos son temáticos.
- Los veredictos de skills se presentan como «Recomendación para un piloto», con un `Aside type="caution"` que lleva la fecha de contraste. El catálogo cambia a menudo, así que la página declara `lastReviewed` y le aplica el aviso de contenido desactualizado del sitio.
- La instalación de skills es una herramienta de terceros, no de OpenSpec. Los comandos (`npx skills@latest add …`) van en `<Tabs syncKey="shell">` con PowerShell y bash, igual que el resto de comandos del sitio. Se marcan como externos a OpenSpec y no entran en la fixture de CLI.

### D4 · Glosario: subsección nueva con anclas estables
Se añade `## Gobierno del cambio` entre «Conceptos de OpenSpec» y «Entorno y equipo», con `### Spec-first`, `### Spec-anchored`, `### Spec-as-source`, `### Verja`, `### Trinquete` y `### Cierre calculado`. Los `id` salen de la regla existente (minúsculas, sin tildes y con guiones), sin `id` manual. El test «Anclas únicas en el glosario» ya cubre las colisiones.

### D5 · Colofón del manual
- `src/config/manual.mjs` exporta `MANUAL_SOURCES` (título + URL https), con el repositorio de OpenSpec, su `docs/`, el repositorio de skills y el documento de Roberto Canales.
- `src/pages/manual.astro` renderiza tras el último anexo una `<section id="colofon">` con:
  - la ficha de edición, que reutiliza las variables ya calculadas para la portada;
  - la URL absoluta de `Astro.site`;
  - la lista de fuentes, con un enlace a `/recursos/` para el catálogo completo.
- El colofón queda fuera de `orderManualEntries` porque no es una página del sidebar. Así no rompe «Manual con todas las páginas en orden del sidebar» ni «Páginas no enlazadas en el sidebar quedan fuera».
- Al imprimir: `break-before: page`, sin cabecera numerada y en una sola página (`break-inside: avoid`). En el índice aparece como entrada final sin número, fuera de las partes.

**Alternativa descartada:** convertir el colofón en una MDX `colofon.mdx` en el sidebar. Aparecería como página web con poco sentido fuera del libro.

### D6 · Ruta de lectura
`MANUAL_READING_ROUTE` cambia así:
- **Día 4** añade `agentes/skills` («…y elegir las skills que acompañan al agente»).
- **Sprints siguientes** inserta `equipo/gobierno` antes de `equipo/adopcion`.

La validación de slugs en build ya cubre una errata.

### D7 · Sincronización futura (criterio, no automatismo)
Se añade a `docs/proyecto/05-convenciones.md` la regla: «Si cambia la KB del proyecto, se abre un change `chore-sync-kb-<fecha>` que copie los ficheros a `docs/openspec-kb/` y lleve a las MDX lo que proceda. La KB nunca se publica directamente». Es una convención de proceso, sin requisito en las specs, porque no es comportamiento observable del sitio.

## Risks / Trade-offs

- **Las fuentes externas envejecen**, sobre todo el catálogo de skills, que es muy activo. Mitigación: `lastReviewed` en la página, aviso de contenido desactualizado del sitio y fecha visible en el Aside.
- **Opiniones presentadas como hechos** (los veredictos). Mitigación: el marco de «recomendación para un piloto» y el criterio de corte de las métricas de adopción.
- **Conflicto con w16 al regenerar el PDF.** Mitigación: el segundo change que se fusione regenera sobre `main`, y `manual:check` lo exige en CI.
- **El PDF crece** unas 6–8 páginas (dos capítulos y el colofón). Es aceptable: sigue muy por debajo del umbral de ~5 MB de w14 para plantear Git LFS.

## Migration Plan

Sin migración. Las URLs existentes no cambian; las dos nuevas se añaden al sitemap automáticamente. Rollback: revertir el merge.

## Open Questions

Las de producto están en `proposal.md`. No hay preguntas técnicas abiertas.
