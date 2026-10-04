## Context

Las cinco páginas de `src/content/docs/referencia/` y `src/content/docs/recursos.md` son marcadores con frontmatter válido (w03) y `sidebar.order` (1–5 en Referencia). w05–w07 fijaron el patrón: `.mdx`, `## Siguiente paso`, `Tabs` con `syncKey`, `Aside`. La CLI instalada es la 1.14.0; `docs/proyecto/07-novedades-openspec-1.14.md` exige que la referencia parta de `openspec --help` y no de la KB (1.13). `.claude/commands/opsx/` contiene los comandos de chat generados por `openspec init` en este repo. Stack según ADR-0001: Astro + Starlight estático, cero JS de cliente por defecto, Zod desde `astro/zod`.

## Goals / Non-Goals

**Goals:** contenido real de Referencia, glosario con anclas estables, referencia de comandos comprobada contra la CLI fijada, colección `resources` validada en build, `/recursos/` con filtro por tipo sin JS.

**Non-Goals:** comprobar enlaces externos en red, ejecutar la CLI en CI, overrides de Starlight, islas de cliente.

## Decisions

- **Fixture de la CLI** (`tests/fixtures/openspec-cli-1.14.0.json`): `{ version, commands: { <cmd>: { subcommands: [], flags: [] } }, chatCommands: [] }`. La genera `scripts/openspec-help-snapshot.mjs` (`npm run snapshot:openspec`) ejecutando `openspec --version`, `openspec --help` y `openspec <cmd> --help` (y de subcomandos de `change`, `spec`, `schema`, `store`, `new`, `config`, `completion`), parseando las secciones `Commands:` y `Options:`; `chatCommands` sale de los ficheros de `.claude/commands/opsx/`. Se versiona; se regenera manualmente al subir de versión.
  - *Alternativa descartada*: ejecutar `openspec` en CI. Añade una instalación global, red y fragilidad por cambios de formato de `--help`.
- **Test de coherencia en Vitest** (`tests/unit/cli-reference.test.ts`): parsea el `.mdx` de `cli` y `comandos-chat`, extrae `openspec <cmd> [sub] [--flag]` de bloques de código y código en línea y `/opsx:<nombre>`, y compara con la fixture; compara `openspecVersion` del frontmatter con `fixture.version`. Lógica pura en `src/lib/cli-reference.ts` para poder probar los casos de error con entradas sintéticas (los escenarios de fallo no requieren romper el contenido real). El escenario "Comandos principales documentados" se cubre en E2E sobre la página construida.
- **Anclas del glosario**: un `###` por término; Starlight genera el `id` con github-slugger (minúsculas, guiones), que conserva las tildes. Para los términos con tilde se usa `<h3 id="...">` explícito en MDX; el resto usa el slug automático. Se confirma en la tarea 1.2.
- **Colección `resources`**: `defineCollection({ loader: file('src/data/resources.yaml'), schema })` con `z` de `astro/zod`: `title: z.string().min(1)`, `url: z.url().refine(u => u.startsWith('https://'))`, `type: z.enum(['oficial','comunidad','video'])`, `lang: z.enum(['es','en'])`. Cada entrada con `id` explícito para que el error identifique la entrada. El esquema vive en `src/lib/resources-schema.ts` para testearlo en Vitest; los escenarios de error se prueban sobre el esquema (no sobre un build roto).
- **Filtro con CSS `:has()`**: componente `src/components/ResourceList.astro` (componente de contenido, no override) con un `<fieldset>` + `<legend>Filtrar por tipo</legend>` y cuatro `<input type="radio" name="resource-type">`; cada `<li>` lleva `data-type`. Reglas: `.resources:has(#rt-video:checked) li:not([data-type="video"]) { display: none }`. Los radios nativos dan teclado (flechas) y semántica sin ARIA extra.
  - *Alternativa descartada*: isla con JS. Contradice "cero JS por defecto" (ADR-0001) y no aporta nada que `:has()` no resuelva; soporte de `:has()` en navegadores actuales es suficiente y sin él se ven todos los recursos (degradación aceptable).
- **Búsqueda**: Pagefind de Starlight indexa los encabezados y genera sub-resultados con ancla; no requiere cambios. El test E2E escribe en el diálogo de búsqueda y comprueba el `href` del sub-resultado.
- **Fuentes**: comandos-chat ← KB 05 + `.claude/commands/opsx/` + 07-novedades; cli ← fixture + KB 03; plantillas ← KB 08 (w07 enlaza aquí); glosario ← KB 00; faq ← KB 10; recursos ← KB 02. Ejemplos en dominio "gestión de reservas".

## Risks / Trade-offs

- [La fixture se queda vieja al subir OpenSpec] → el test compara su versión con `openspecVersion` de las páginas; subir la versión de las páginas obliga a regenerarla.
- [El parser de `--help` depende del formato de commander] → solo afecta al script de regeneración, no al test; se revisa el diff de la fixture en la PR.
- [Extracción de comandos del MDX por regex] → falsos negativos si se documenta un comando en prosa sin formato de código; convención: todo comando va en código.
- [Slugs con tildes] → verificado en la tarea 1.2 antes de redactar.
- [Sub-resultados de Pagefind] → si no enlazan al ancla, se ajusta el escenario tras la tarea 1.3 mediante `/opsx:update`.
- [`:has()` no soportado] → se muestran todos los recursos; el filtro no funciona pero no se pierde contenido.
