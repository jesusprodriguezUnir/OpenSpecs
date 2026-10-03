# OpenSpec en nuestros proyectos — Índice y guía de uso en NotebookLM

> Base de conocimiento para adoptar OpenSpec (spec-driven development) en proyectos .NET Core + Angular, trabajando con Claude Code e integrando Jira / Azure DevOps.
> Última revisión: 28/09/2026 · Versión de referencia: OpenSpec v1.13.0

## Contenido del cuaderno

| Nº | Fichero | Para qué sirve |
|----|---------|----------------|
| 00 | `00-indice-y-guia-notebooklm.md` | Este índice y cómo usar el cuaderno |
| 01 | `01-que-es-openspec.md` | Conceptos, filosofía y comparativa con otras herramientas |
| 02 | `02-recursos-y-aprendizaje.md` | Documentación oficial, repositorios, vídeos y ruta de aprendizaje |
| 03 | `03-instalacion-y-estructura.md` | Instalación, `openspec init`, estructura de carpetas y `config.yaml` |
| 04 | `04-formato-de-specs.md` | Cómo se escriben requisitos, escenarios y deltas, con ejemplos .NET |
| 05 | `05-flujo-de-trabajo-opsx.md` | Ciclo explore → propose → apply → verify → archive y recetas |
| 06 | `06-integracion-jira-azure-devops.md` | Mapeo con el backlog, convenciones, MCP, automatizaciones y pipeline |
| 07 | `07-configuracion-claude-code.md` | Configuración de Claude Code: MCP, permisos, hooks, subagentes y modelos |
| 08 | `08-plantillas.md` | Plantillas listas para copiar (CLAUDE.md, config.yaml, comandos, pipeline, PR) |
| 09 | `09-plan-de-adopcion-y-riesgos.md` | Plan por sprints, Definition of Done, métricas y riesgos |
| 10 | `10-faq.md` | Preguntas frecuentes |

## Cómo montar el cuaderno en NotebookLM

1. Entra en https://notebooklm.google.com y crea un cuaderno nuevo llamado **"OpenSpec — Adopción en proyectos"**.
2. Pulsa **Añadir fuentes → Subir** y selecciona los 11 ficheros `.md` (NotebookLM admite Markdown como fuente).
3. Añade también como fuentes web (opcional, pero recomendable):
   - https://github.com/Fission-AI/OpenSpec (README del repositorio)
   - https://openspec.dev
   - https://intent-driven.dev/knowledge/openspec/
   - Los vídeos de YouTube listados en `02-recursos-y-aprendizaje.md` (NotebookLM admite enlaces de YouTube con transcripción)
4. Revisa que todas las fuentes estén marcadas como activas.

## Instrucciones sugeridas para el chat del cuaderno

Configura el cuaderno (icono de ajustes del chat → estilo personalizado) con algo como:

> Responde en español de España, con tono técnico y directo, para un equipo de desarrollo .NET Core + Angular. Cita siempre la fuente. Si algo no está en las fuentes, dilo explícitamente.

## Prompts útiles para explotar el cuaderno

- "Genérame una guía de estudio de OpenSpec para un desarrollador que no lo conoce."
- "¿Qué pasos concretos tengo que seguir para aplicar OpenSpec a una historia de Jira?"
- "Explica la diferencia entre `openspec/specs` y `openspec/changes` con un ejemplo."
- "Hazme un checklist para la revisión de una PR que incluye un cambio OpenSpec."
- "¿Qué riesgos tiene conectar el MCP de Azure DevOps a Claude Code?"
- "Resume el plan de adopción en 5 puntos para presentarlo a dirección."

## Resúmenes de audio y vídeo

- **Resumen en audio (Audio Overview):** personalízalo con "Enfócate en el flujo de trabajo diario y en la integración con Jira/Azure DevOps; público: desarrolladores senior".
- **Guía de estudio / FAQ / Cronología:** útiles para el onboarding del equipo.
- **Mapa mental:** útil para visualizar la relación entre specs, changes, comandos y herramientas.

## Glosario rápido

- **SDD (Spec-Driven Development):** desarrollo en el que una especificación estructurada guía la implementación del agente de IA.
- **Spec:** documento en `openspec/specs/<dominio>/` que describe el comportamiento actual del sistema (la fuente de verdad).
- **Change:** carpeta en `openspec/changes/<id>/` con una propuesta de cambio (proposal, delta specs, design, tasks).
- **Delta spec:** fragmento de spec que marca requisitos como ADDED, MODIFIED o REMOVED.
- **Archive:** operación que fusiona las delta specs en `openspec/specs/` y mueve el change a `changes/archive/`.
- **MCP (Model Context Protocol):** protocolo para que el agente de IA acceda a herramientas externas (Jira, Azure DevOps…).
- **Brownfield:** proyecto existente (frente a greenfield, proyecto desde cero).
