## ADDED Requirements

### Requirement: Páginas de Guías con contenido
Las páginas `/guias/formato-de-specs/`, `/guias/flujo-opsx/`, `/guias/recetas/`, `/guias/brownfield/` y `/guias/configuracion/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Guías sin marcadores de preparación
- **WHEN** se carga cada una de las cinco páginas de Guías
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Guías en el sidebar
El grupo Guías del sidebar SHALL listar sus páginas en este orden: Escribir specs, Flujo /opsx, Recetas, Proyectos existentes (brownfield), config.yaml y schemas personalizados.

#### Scenario: Orden de las páginas de Guías
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** los enlaces del grupo Guías apuntan, en orden, a `/guias/formato-de-specs/`, `/guias/flujo-opsx/`, `/guias/recetas/`, `/guias/brownfield/` y `/guias/configuracion/`

### Requirement: Enlace "Siguiente paso" en Guías
Cada página de Guías SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente: formato-de-specs → flujo-opsx → recetas → brownfield → configuracion → `/agentes/claude-code/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso en Guías
- **WHEN** se carga cada página de Guías
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente de la cadena

#### Scenario: Configuración enlaza a Claude Code
- **WHEN** se carga `/guias/configuracion/`
- **THEN** su enlace "Siguiente paso" apunta a `/agentes/claude-code/` y ese destino responde HTTP 200

### Requirement: Deltas con marcadores de diff
La página `/guias/formato-de-specs/` SHALL mostrar los ejemplos de delta specs en bloques de código cuyas líneas añadidas y eliminadas están marcadas visual y semánticamente como insertadas y eliminadas.

#### Scenario: Bloque con líneas insertadas
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** la página contiene al menos un bloque de código con una línea marcada como insertada

#### Scenario: Bloque con líneas eliminadas
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** la página contiene al menos un bloque de código con una línea marcada como eliminada

### Requirement: Comandos de Guías con variantes PowerShell y bash
Las páginas `/guias/recetas/` y `/guias/configuracion/` SHALL mostrar sus comandos de terminal en pestañas sincronizadas con las variantes "PowerShell" y "bash".

#### Scenario: Pestañas de shell en recetas
- **WHEN** se carga `/guias/recetas/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"

#### Scenario: Pestañas de shell en configuración
- **WHEN** se carga `/guias/configuracion/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"
