Roadmap: 07 · docs/proyecto/04-roadmap-de-changes.md

## Why

Las seis páginas de Con tu agente y En equipo son marcadores ("Página en preparación"). `/agentes/claude-code/` es el destino del último "Siguiente paso" de Guías (w06), así que el recorrido termina hoy en una página vacía. Sin estas secciones, el lector sabe escribir specs pero no cómo configurar su agente ni cómo llevar OpenSpec a un equipo con backlog, CI y un plan de adopción.

## What Changes

- Redactar en es-ES `/agentes/claude-code/`, `/agentes/otros/`, `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` y `/equipo/adopcion/` a partir de `docs/openspec-kb/01`, `02`, `06`, `07`, `08` y `09`, actualizadas a OpenSpec 1.14 según `docs/proyecto/07-novedades-openspec-1.14.md` y `openspec --help`.
- `/agentes/otros/` se limita a lo verificable: herramientas de `openspec init --tools` (1.14), qué es común y qué cambia respecto a Claude Code, y enlace a la documentación oficial. Sin configuraciones por agente inventadas.
- Cada página termina con "Siguiente paso": claude-code → otros → jira → azure-devops → ci → adopcion → `/referencia/comandos-chat/`.
- Avisos de RGPD con `Aside` en jira, azure-devops y adopcion.
- Las plantillas largas (CLAUDE.md, config.yaml, `/ticket-propose`, `spec-verifier`, plantillas de PR y de ticket) no se duplican: se enlazan a `/referencia/plantillas/`.
- `/equipo/ci/` muestra la validación de specs en pestañas sincronizadas "Azure Pipelines" / "GitHub Actions", con OpenSpec fijado a 1.14.x.
- Los datos de MCP sujetos a caducidad (endpoints de Atlassian Rovo, limitación del servidor remoto de Azure DevOps) se verifican contra la fuente oficial durante el apply y se presentan en un `Aside` de precaución con la fecha de revisión.
- Ejemplos migrados del contexto académico/.NET de la KB al dominio neutro "gestión de reservas" y a un stack genérico.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `contenido`: añade requisitos de Con tu agente y En equipo (sin marcadores, orden, cadena "Siguiente paso", avisos RGPD, plantillas enlazadas, pestañas de CI con versión fijada). Frontmatter y sidebar ya los cubren `contenido` y `navegacion`.

## Fuera de alcance

- Páginas de Referencia (w08); `/referencia/plantillas/` y `/referencia/comandos-chat/` siguen siendo marcadores (los enlaces devuelven 200).
- Componentes nuevos u overrides de Starlight.
- Calidad editorial del texto (se revisa en la PR, no en specs).

## Impacto

- `src/content/docs/agentes/*.md` y `src/content/docs/equipo/*.md` → `.mdx` (necesario para `Tabs`/`Aside`).
- Tests E2E nuevos en `tests/e2e/agentes-equipo.spec.ts`.
- Sin JavaScript de cliente nuevo (solo el script existente de las Tabs de Starlight) ni terceros: sin impacto LSSI-CE/RGPD en el sitio.
- Sin dependencias nuevas.

## Preguntas abiertas

_Ninguna._ Resueltas antes de proponer: alcance de "Otros agentes"; cadena hasta `/referencia/comandos-chat/`; enlaces a marcadores de w08 aceptados; CI con Azure Pipelines y GitHub Actions; datos de MCP verificados en apply; dominio neutro; RGPD como requisito comprobable.
