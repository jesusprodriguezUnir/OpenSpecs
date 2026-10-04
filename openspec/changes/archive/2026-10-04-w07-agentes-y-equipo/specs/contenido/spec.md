## ADDED Requirements

### Requirement: Páginas de Con tu agente y En equipo con contenido
Las páginas `/agentes/claude-code/`, `/agentes/otros/`, `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` y `/equipo/adopcion/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Agentes y equipo sin marcadores de preparación
- **WHEN** se carga cada una de las seis páginas de Con tu agente y En equipo
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Con tu agente y En equipo en el sidebar
El grupo Con tu agente SHALL listar Claude Code y Otros agentes, en ese orden. El grupo En equipo SHALL listar Integración con Jira, Integración con Azure DevOps, Pipeline y validación en CI y Plan de adopción y riesgos, en ese orden.

#### Scenario: Orden de las páginas de Con tu agente
- **WHEN** se carga `/agentes/claude-code/`
- **THEN** los enlaces del grupo Con tu agente apuntan, en orden, a `/agentes/claude-code/` y `/agentes/otros/`

#### Scenario: Orden de las páginas de En equipo
- **WHEN** se carga `/equipo/jira/`
- **THEN** los enlaces del grupo En equipo apuntan, en orden, a `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` y `/equipo/adopcion/`

### Requirement: Enlace "Siguiente paso" en Con tu agente y En equipo
Cada una de las seis páginas SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente: claude-code → otros → jira → azure-devops → ci → adopcion → `/referencia/comandos-chat/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso en agentes y equipo
- **WHEN** se carga cada página de Con tu agente y En equipo
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente de la cadena

#### Scenario: Adopción enlaza a comandos de chat
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** su enlace "Siguiente paso" apunta a `/referencia/comandos-chat/` y ese destino responde HTTP 200

### Requirement: Avisos de RGPD
Las páginas `/equipo/jira/`, `/equipo/azure-devops/` y `/equipo/adopcion/` SHALL incluir al menos un aviso destacado (componente Aside) cuyo texto mencione "RGPD".

#### Scenario: Aviso de RGPD en las páginas de equipo
- **WHEN** se carga cada una de `/equipo/jira/`, `/equipo/azure-devops/` y `/equipo/adopcion/`
- **THEN** la página contiene al menos un aviso destacado que incluye el texto "RGPD"

### Requirement: Plantillas enlazadas, no duplicadas
La página `/agentes/claude-code/` SHALL enlazar a `/referencia/plantillas/` para las plantillas completas y SHALL NOT reproducir íntegras las plantillas de `CLAUDE.md`, `/ticket-propose` ni `spec-verifier`.

#### Scenario: Claude Code enlaza a plantillas
- **WHEN** se carga `/agentes/claude-code/`
- **THEN** la página contiene al menos un enlace cuyo `href` es `/referencia/plantillas/`

### Requirement: Validación en CI con variantes de plataforma
La página `/equipo/ci/` SHALL mostrar la validación de specs en pestañas sincronizadas con las variantes "Azure Pipelines" y "GitHub Actions", y SHALL fijar una versión concreta de OpenSpec (no `@latest`).

#### Scenario: Pestañas de plataforma en CI
- **WHEN** se carga `/equipo/ci/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "Azure Pipelines" y "GitHub Actions"

#### Scenario: Versión de OpenSpec fijada en CI
- **WHEN** se carga `/equipo/ci/`
- **THEN** los bloques de código instalan `@fission-ai/openspec@` seguido de un número de versión y ninguno usa `@latest`
