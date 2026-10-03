# 05 · Flujo de trabajo con los comandos /opsx

## Los comandos de chat

| Comando | Qué hace | Perfil |
|---|---|---|
| `/opsx:explore` | Compañero de análisis: investiga el código y el problema sin escribir nada | core |
| `/opsx:propose <nombre>` | Crea el cambio con proposal, delta specs, design y tasks | core |
| `/opsx:apply [<nombre>]` | Implementa las tareas de `tasks.md` y las va marcando | core |
| `/opsx:sync` | Sincroniza el estado del cambio | core |
| `/opsx:archive` | Fusiona las delta specs en `specs/` y archiva el cambio | core |
| `/opsx:verify` | Comprueba que la implementación cumple la spec | ampliado |
| `/opsx:new`, `/opsx:continue`, `/opsx:ff` | Control incremental: crear, avanzar artefacto a artefacto, fast-forward | ampliado |
| `/opsx:bulk-archive` | Archiva varios cambios a la vez | ampliado |
| `/opsx:onboard` | Tutorial guiado sobre tu propio código | — |

Activar el perfil ampliado: `openspec config profile`.

## Flujo completo del equipo

```
[Backlog: Story/PBI con criterios de aceptación]
        │  (el agente lee el ticket vía MCP)
        ▼
/opsx:explore  ──►  /opsx:propose
                         │
                         ▼
              Revisión humana de la propuesta y las specs
              (si hay cambios → iterar sobre el mismo change)
                         │  aprobada
                         ▼  [Backlog → In Progress, automático]
                    /opsx:apply   (código + tests)
                         │
                         ▼
                    /opsx:verify  + subagente spec-verifier
                         │
                         ▼
                    /opsx:archive (dentro de la misma PR)
                         │
                         ▼
              PR + pipeline (openspec validate + build + tests + code review)
                         │
                         ▼
                    Merge a main
                         │
                         ▼  [Backlog → Done, automático]
```

**Importante:** el `archive` se hace **antes del merge, dentro de la misma PR**, para que el código y las specs actualizadas entren juntos en `main` y nunca estén desalineados.

## Recetas

### Receta 1 — Funcionalidad pequeña (camino rápido)
1. `/opsx:propose proj-1234-boton-logout`
2. Revisar proposal y specs.
3. `/opsx:apply`
4. `/opsx:archive`

### Receta 2 — Bugfix
Igual que la receta 1, pero la propuesta se formula como **comportamiento correcto** y la delta spec usa **MODIFIED**. El bug queda documentado como requisito.

### Receta 3 — Explorar primero (cambios con incertidumbre)
1. `/opsx:explore` sobre el área afectada (en Claude Code encaja con el *plan mode*, Shift+Tab).
2. Cuando haya claridad, `/opsx:propose`: arrastra el contexto de la exploración.

### Receta 4 — Cambios en paralelo
Cada cambio vive en su carpeta, sin conflictos. Retomar uno concreto: `/opsx:apply proj-1250-exportacion-pdf`. Para trabajar en paralelo de verdad, combinar con **git worktrees** (una rama/directorio por cambio).

### Receta 5 — Refactor sin cambio de comportamiento
Propuesta y tasks sin delta specs. Archivar con:
```bash
openspec archive proj-1300-refactor-repositorios --skip-specs
```

### Receta 6 — Control incremental (cambios grandes)
`/opsx:new` → `/opsx:continue` (un artefacto cada vez, revisando entre medias) → `/opsx:ff` cuando ya se tiene claro el resto.

### Receta 7 — Aprender sobre el código real
`/opsx:onboard` guía un cambio completo sobre el propio repositorio.

## Cambios grandes: PR de specs separada

Para épicas o cambios de alto impacto, abrir primero una **PR solo con el change** (proposal + specs + design + tasks), revisarla y aprobarla, y después implementar en la misma rama o en otra. Para cambios pequeños basta con revisar las specs dentro de la PR de código.

## Qué revisar en cada punto de control

| Momento | Revisor | Foco |
|---|---|---|
| Tras `propose` | Tech Lead / equipo | ¿Resuelve el problema correcto? ¿Escenarios completos? ¿Diseño coherente con la arquitectura? |
| Tras `verify` | Desarrollador | ¿Cada escenario tiene código y test? ¿tasks.md refleja la realidad? |
| PR | Revisor de código | Código + delta specs + archive; pipeline verde |
