# 09 · Plan de adopción y riesgos

## Objetivo

Adoptar spec-driven development con OpenSpec y Claude Code en los proyectos .NET Core + Angular del equipo, de forma incremental, medible y sin añadir burocracia al flujo Scrum.

## Plan por fases

| Fase | Duración | Alcance | Criterio de salida |
|---|---|---|---|
| 0. Preparación | 1 semana | Formación (ruta del fichero 02), elección del proyecto piloto, revisión con DPO | Equipo con el modelo mental; piloto elegido |
| 1. Piloto manual | Sprints 1–2 | `openspec init`, `CLAUDE.md`, `config.yaml`, convención de nombres, revisión de specs en PR. **Sin MCP** | ≥ 5 changes archivados; feedback del equipo |
| 2. Integración backlog | Sprint 3 | MCP de Jira/Azure DevOps en solo lectura; comando `/ticket-propose` | Propuestas generadas desde tickets sin retrabajo mayor |
| 3. Automatización | Sprint 4+ | Pipeline con `openspec validate`, hook `Stop`, subagente verificador, automatizaciones de estado | Pipeline obligatoria en `main` |
| 4. Extensión | Posterior | Resto de proyectos; Stores (beta) para specs compartidas entre repos front/back; revisión automática en CI | Adopción en todos los repos activos |

## Elección del proyecto piloto

Criterios: aplicación en mantenimiento activo, cobertura de tests razonable, equipo motivado, impacto de negocio medio (no crítico). Empezar por **cambios reales y pequeños** de la semana: un bugfix con regla de negocio, un endpoint nuevo con escenarios de error y un refactor.

## Definition of Done (añadidos)

- [ ] Change OpenSpec creado y propuesta revisada antes de implementar (o etiqueta `no-spec` justificada).
- [ ] Cada Scenario cubierto por un test automatizado.
- [ ] Change archivado en la misma PR; `openspec/specs/` actualizado.
- [ ] `openspec validate --strict` en verde.

## Métricas para evaluar el piloto

- **Retrabajo:** nº de iteraciones de código tras la review (esperado: baja).
- **Defectos escapados** en las historias con spec frente a las que no la tienen.
- **Tiempo de ciclo** por historia (el esperado es igual o menor tras la curva de aprendizaje).
- **Cobertura de escenarios:** % de Scenarios con test (objetivo 100 %).
- **Coste en tokens** por historia.
- **Percepción del equipo** (encuesta breve en la retrospectiva).

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Revisión de specs "de trámite" (aprobar sin leer) | Se pierde todo el valor; solo queda burocracia | Checklist de revisión (fichero 04); rotar revisores; revisarlo en retros |
| Backfilling masivo de specs | Semanas perdidas documentando código que no cambia | Política brownfield: solo specs de lo que se toca |
| Datos personales en tickets y código enviados al modelo | Incumplimiento RGPD | Revisión con DPO; plantilla de ticket sin datos reales; `deny` de ficheros sensibles |
| Specs desalineadas con el código | Pérdida de confianza en las specs | Archive dentro de la PR; validación en pipeline; subagente verificador |
| Agente modificando el backlog | Estados incoherentes, mala trazabilidad | MCP en solo lectura; estados por automatizaciones nativas |
| Tutoriales y versiones desactualizadas | Confusión de comandos | Versión fijada; manda `docs/` del repo; `openspec update` controlado |
| Rotura por actualización de OpenSpec | Pipeline o comandos rotos | Versión fijada en CI; actualizar en rama dedicada |
| Limitación del MCP remoto de Azure DevOps con Claude | Integración más costosa | Servidor local con `az login`; revisar cuando Entra soporte registro dinámico |
| Cambios sin spec por urgencia | Erosión del proceso | Etiqueta `no-spec` explícita y visible; revisión periódica de su uso |
| Coste de tokens | Presupuesto | Modelo por fase (opus para proponer/verificar, sonnet para implementar); medir por historia |

## Checklist de arranque del piloto

- [ ] Node ≥ 20.19 y OpenSpec instalado en los puestos del equipo.
- [ ] Telemetría desactivada.
- [ ] `openspec init` con Claude Code en el repo piloto.
- [ ] `CLAUDE.md` y `openspec/config.yaml` redactados con el stack y dominio reales.
- [ ] Convención de nombres acordada y documentada.
- [ ] Plantilla de PR actualizada.
- [ ] DoD actualizada.
- [ ] DPO informado.
- [ ] Primer change real elegido para el sprint.
