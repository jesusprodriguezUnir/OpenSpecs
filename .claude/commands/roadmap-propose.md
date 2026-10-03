---
description: Crea el change OpenSpec de una entrada del roadmap (docs/proyecto/04-roadmap-de-changes.md)
argument-hint: <NN>  (p. ej. 01)
model: opus
---
1. Lee `docs/proyecto/04-roadmap-de-changes.md` y localiza la sección `## $ARGUMENTS · <id-del-change>`.
   Si no existe, lista los NN disponibles y PARA.
2. Comprueba dependencias en la tabla resumen: si algún change del que depende no está en
   `openspec/changes/archive/`, avísame y PARA hasta que confirme.
3. Lee los documentos que cite el prompt de esa sección (ADR, arquitectura de información, KB…).
   No leas el resto de `docs/` salvo que lo necesites.
4. Si hay ambigüedades o decisiones abiertas que afecten a las specs, lístalas y PARA; pregúntame.
5. Crea la rama `<id-del-change>` si no estás ya en ella (`git switch -c <id>`).
6. Sigue el flujo de `/opsx:propose` (skill openspec-propose) con el nombre `<id-del-change>`
   y como descripción el prompt de esa sección del roadmap.
   - Primera línea de `proposal.md`: `Roadmap: $ARGUMENTS · docs/proyecto/04-roadmap-de-changes.md`.
   - Usa los "Escenarios esperados" como punto de partida, no como lista cerrada.
7. Ejecuta `openspec validate <id-del-change> --strict --no-interactive` y corrige lo que falle.
8. Muéstrame un resumen de proposal, delta specs (Requirements + Scenarios) y tasks para revisión.
   NO ejecutes `/opsx:apply` hasta que lo apruebe.
