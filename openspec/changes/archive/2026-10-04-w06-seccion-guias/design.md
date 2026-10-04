## Context

Los cinco `src/content/docs/guias/*.md` existen como marcadores con frontmatter válido (w03), `sidebar.order` 1–5 y presencia en el sidebar (w01). w05 fijó el patrón para páginas de contenido: `.mdx`, `## Siguiente paso`, `<Tabs syncKey="shell">`. Fuentes: `docs/openspec-kb/01`, `03`, `04`, `05`, `09` (escritas para 1.13) y `docs/proyecto/07-novedades-openspec-1.14.md`.

La rama `w06-seccion-guias` sale de `w05-seccion-empieza` (aún sin mergear): la PR de w06 se apila sobre la de w05.

## Goals / Non-Goals

**Goals:** contenido real de las 5 guías, deltas con marcadores de diff, cadena "Siguiente paso" hasta `/agentes/claude-code/`, pestañas PowerShell/bash en recetas y configuración, KB corregida a 1.14.

**Non-Goals:** páginas de w07/w08, componentes nuevos, overrides nuevos, JS de cliente nuevo.

## Decisions

- **`.md` → `.mdx`** en las cinco páginas (Tabs, TabItem, Aside). Los slugs no cambian. Mismo criterio que w05.
- **"Siguiente paso" como sección Markdown** (`## Siguiente paso` + enlace), reutilizando el selector de los tests de w05.
- **Marcadores de diff con Expressive Code integrado en Starlight** (ADR-0001: sin dependencias nuevas). Se usarán los marcadores `ins={…}` / `del={…}` sobre bloques `md`, no `lang="diff"`: conservan el resaltado Markdown y no obligan a prefijar cada línea con `+`/`-`. Para MODIFIED se muestra el requisito anterior con la línea cambiada en `del` y la nueva en `ins` dentro del mismo bloque. El test comprueba las clases que Expressive Code emite en el HTML (`.ec-line.ins`, `.ec-line.del`) — se verifica en la tarea 1.1 contra el build real antes de escribir los tests.
- **Fuentes por página**: formato-de-specs ← KB 04; flujo-opsx ← KB 05 + 07-novedades (`/opsx:update`, `sync` corregido, perfiles); recetas ← KB 05 (recetas 1–7); brownfield ← KB 01 + 09 (política de no backfilling, piloto, riesgos); configuracion ← KB 03 + 07-novedades (`context`, `rules`, `operations`, `openspec schema` experimental).
- **Comandos verificados** con `openspec <cmd> --help` (1.14) antes de citarlos: `archive --skip-specs`, `schema fork|init|validate|which`, `config profile`, `new change --schema`. Diferencias con la KB → `<Aside type="caution">`.
- **Ejemplos** en dominio "gestión de reservas"; sin datos personales.

## Risks / Trade-offs

- [PR apilada sobre w05] → si w05 cambia en revisión, rebase de w06; mergear w05 primero.
- [Clases internas de Expressive Code en los tests] → acoplan el test a la versión fijada de Starlight; aceptable porque las versiones están fijadas y el test fallaría de forma visible al actualizar.
- [`openspec schema` es experimental] → se avisa en la página; puede cambiar entre versiones.
- [`/agentes/claude-code/` sigue siendo marcador] → el enlace es válido (200) y w07 lo rellena.
