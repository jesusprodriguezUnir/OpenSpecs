# Design

## Context

- `/empieza/primer-cambio/` (unas 220 líneas) importa `Aside`, `Tabs` y `TabItem`, declara `duration: 30` (el máximo que permite «Duración del tutorial Tu primer cambio») y tiene cuatro pasos numerados más «Si algo falla» y «Siguiente paso».
- La infografía de w15 (`src/components/InfografiaSdd.astro`) es HTML más CSS Grid con SVG en línea. Sus tokens de color `--ig-*` son locales a su `<style>` y no tiene `<script>`. w15 está implementado pero **sin archivar** (falta la tarea 5.2) y sus deltas no están en `openspec/specs/`.
- El manual (`src/lib/manual-order.ts`) incluye por directorio todas las páginas de `empieza/`, así que lo que se añada al tutorial aparece en `/manual/` y obliga a regenerar `public/manual-openspec.pdf` (`calidad`: «Manual PDF al día en CI»).
- La CLI de OpenSpec solo está instalada en el job `openspec` de `.github/workflows/ci.yml` (versión fijada en `OPENSPEC_VERSION`), no en el job de tests.
- La fixture de la CLI (`tests/fixtures/openspec-cli-1.14.0.json`) incluye `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive` y `/opsx:sync`. **No incluye `/opsx:verify`**.
- Se aplica ADR-0001: salida estática, cero JS de cliente por defecto y Starlight con Expressive Code.

## Goals / Non-Goals

**Goals:**
- Una sola fuente para cada artefacto mostrado: la página lee los ficheros de la instantánea y no hay copias a mano que puedan desincronizarse.
- La validez de la instantánea la comprueba el mismo CLI fijado que valida las specs del sitio.
- Las infografías nuevas comparten paleta con la de w15 sin cambiar su aspecto.

**Non-Goals:**
- Automatizar la captura. Los artefactos los genera un agente LLM, la salida no es determinista y la captura es un paso manual documentado.
- Validar la calidad editorial de los artefactos capturados (las specs del proyecto lo prohíben). Solo se valida su estructura.

## Decisions

### D1 · Instantánea en `examples/reservas-demo/` con dos estados

```
examples/reservas-demo/
├── captura.json                 # { openspecVersion, agent, capturedAt }
├── propuesta/openspec/          # estado tras /opsx:propose (tareas sin marcar)
│   ├── config.yaml
│   └── changes/reservas-cancelacion/{.openspec.yaml, proposal.md, design.md, tasks.md, specs/reservas/spec.md}
└── archivado/openspec/          # estado tras /opsx:archive
    ├── config.yaml
    ├── specs/reservas/spec.md
    └── changes/archive/<fecha>-reservas-cancelacion/…
```

Se guardan dos estados porque el paso 2 tiene que mostrar `tasks.md` sin marcar, y la carpeta archivada lo tendría marcado. Al estar fuera de `openspec/` en la raíz y de `src/`, no se mezcla con los changes del sitio, ni con el loader `changelog` (`openspec/changes/archive/*/proposal.md`), ni con `specDomains`.

- *Alternativa descartada*: una colección de contenido con Zod. Añade esquema y loader para unos ficheros que solo se muestran tal cual.
- *Alternativa descartada*: guardar solo el estado archivado. No permite enseñar `tasks.md` antes de implementar.

### D2 · Inclusión con `?raw` y `<Code>` de Starlight

En el MDX: `import proposal from '../../../../examples/reservas-demo/propuesta/openspec/changes/reservas-cancelacion/proposal.md?raw'` y `<Code code={proposal} lang="md" title="openspec/changes/reservas-cancelacion/proposal.md" />`. `Code` viene de `@astrojs/starlight/components` y lo renderiza Expressive Code con marco, título y botón de copiar, sin JS de cliente adicional al que ya carga cualquier guía.

- *Alternativa descartada*: pegar el contenido en bloques Markdown. Se desincroniza de la instantánea y el escenario «Página fiel a la instantánea» dejaría de ser verificable sin duplicar.
- *Alternativa descartada*: un componente propio que lea con `fs`. Hace lo mismo que `?raw` y añade código.

El título del bloque usa la ruta relativa al proyecto del lector (`openspec/…`), no la ruta de `examples/`.

### D3 · Procedencia desde `captura.json`

La página importa `captura.json` y pinta un `Aside` con la versión, el agente y la fecha (es-ES). Un test unitario compara `captura.json.openspecVersion` con `openspecVersion` del frontmatter de `primer-cambio.mdx`. `capturedAt` se guarda en ISO 8601 y se formatea en es-ES al pintarla.

### D4 · Validación de la instantánea en el job `openspec` de CI

Un fichero de Vitest aparte, `tests/ejemplo/ejemplo-reservas.test.ts`, lanza `openspec validate --all --strict --no-interactive` con `cwd` en cada estado. Además copia el estado `propuesta` a un directorio temporal, le quita un `#### Scenario:` y comprueba que la validación falla. Se ejecuta con `npm run test:ejemplo` (`vitest run tests/ejemplo`), que queda fuera del `include` por defecto de `npm run test`. El job `openspec` de CI, que ya instala el CLI con la versión fijada, añade `npm ci` y `npm run test:ejemplo`. No hay dependencias nuevas.

- *Alternativa descartada*: añadir el CLI como devDependency para que corra en `npm run test`. Duplica la versión fijada en `OPENSPEC_VERSION`.
- *Alternativa descartada*: solo pasos `run:` en CI. No dejan un test con el nombre del Scenario, como exige la convención del proyecto.

### D5 · Dos componentes Astro y tokens compartidos

Se crean `src/components/CicloDeVida.astro` y `src/components/AnatomiaChange.astro` con el patrón de w15 (D1 y D2 de w15): `figure` + `figcaption`, datos en un array tipado en el frontmatter, SVG decorativos con `aria-hidden="true"` y sin `<script>`.

Para compartir la paleta, los tokens `--ig-*` pasan de `InfografiaSdd.astro` a `src/styles/infografia.css`, que importan los tres componentes. Es un movimiento sin cambio visual que cubren los E2E existentes de w15.

- *Alternativa descartada*: duplicar los ocho tokens en cada componente. Funciona, pero la próxima infografía triplicaría la deriva.

**Requisito previo:** archivar w15 antes de aplicar w16, para que sus requisitos de infografía estén en `openspec/specs/` y este cambio no edite un componente de un change abierto.

### D6 · Contenido de las etapas del ciclo de vida

| Etapa | Comando o acción | Entrada | Salida | Hecho cuando |
|---|---|---|---|---|
| Explorar | `/opsx:explore` (opcional) | Idea o problema | Notas y alcance | El alcance cabe en un change |
| Proponer | `/opsx:propose` | Requisito descrito | proposal, specs, design, tasks | `openspec validate <change> --strict` pasa |
| Revisar | Revisión humana | Artefactos del change | Change aprobado | Escenarios cubren reglas y casos límite |
| Implementar | `/opsx:apply` | tasks.md | Código, tests y tareas marcadas | Todas las tareas `[x]` |
| Verificar | `openspec validate` + revisión contra specs | Código y specs | Informe sin escenarios sin cubrir | Tests en verde |
| Archivar | `/opsx:archive` | Change verificado | Specs principales actualizadas | `openspec/specs/` refleja el cambio |

Verificar **no** se presenta como `/opsx:verify`, porque no está en la fixture 1.14.0. El test de comandos reutiliza el helper `undocumentedCommands` que ya usa `landing.spec.ts`.

### D7 · Duración y estructura de la página

Se mantiene `duration: 30`. Los artefactos se presentan como referencia para comparar («Compara con lo que te ha generado tu agente») dentro de los pasos existentes, no como pasos nuevos, y los tiempos por paso no cambian. La figura del ciclo va tras «Antes de empezar» y la de anatomía al principio del paso 2. No cambian los encabezados de paso, el sidebar ni «Siguiente paso».

### D8 · Impresión

Ambos componentes declaran `break-inside: avoid` en `@media print` y respetan `--ig-scale` como la infografía de w15 en `manual.astro`.

## Risks / Trade-offs

- [La salida de OpenSpec o del agente cambia en versiones futuras] → La procedencia queda visible y fechada. El aviso de contenido desactualizado de 180 días ya fuerza la revisión, y subir `openspecVersion` sin recapturar rompe el test de D3.
- [Artefactos capturados largos alargan la página y el PDF] → En la captura se pide un requisito pequeño (el del tutorial actual). Si un artefacto pasa de unas 80 líneas, se recorta el requisito en la captura, no el fichero mostrado.
- [Rutas relativas largas en los `import ?raw` del MDX] → Son frágiles al mover ficheros, pero el build falla si se rompen.
- [Mover los tokens de w15 cambia su aspecto sin querer] → Lo cubren los E2E de w15 y la comprobación visual en la preview.
- [`examples/` con su propio `openspec/` confunde a un agente que trabaje en el repo] → Se añade una línea en `CLAUDE.md` que indica que `examples/` es contenido de ejemplo y no se edita salvo para recapturar.
- [El PDF del manual queda desfasado] → Regenerarlo es una tarea explícita, y CI lo detecta («Manual PDF al día en CI»).

## Migration Plan

Es un despliegue estático normal y sin migraciones. La vuelta atrás consiste en revertir la PR.

## Open Questions

- El texto exacto de las notas «Qué mirar» se decide tras la captura, según lo que haya generado el agente.
