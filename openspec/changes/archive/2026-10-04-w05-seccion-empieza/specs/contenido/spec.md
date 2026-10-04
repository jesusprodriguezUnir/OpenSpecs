## ADDED Requirements

### Requirement: Páginas de Empieza con contenido
Las páginas `/empieza/que-es/`, `/empieza/conceptos/`, `/empieza/instalacion/` y `/empieza/primer-cambio/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Empieza sin marcadores de preparación
- **WHEN** se carga cada una de las cuatro páginas de Empieza
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Empieza en el sidebar
El grupo Empieza del sidebar SHALL listar sus páginas en este orden: ¿Qué es OpenSpec?, Conceptos, Instalación, Tu primer cambio.

#### Scenario: Orden de las páginas de Empieza
- **WHEN** se carga `/empieza/que-es/`
- **THEN** los enlaces del grupo Empieza apuntan, en orden, a `/empieza/que-es/`, `/empieza/conceptos/`, `/empieza/instalacion/` y `/empieza/primer-cambio/`

### Requirement: Enlace "Siguiente paso" en Empieza
Cada página de Empieza SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente del recorrido Inicio: qué es → conceptos → instalación → primer cambio → `/guias/formato-de-specs/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso
- **WHEN** se carga cada página de Empieza
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente del recorrido Inicio

#### Scenario: Primer cambio enlaza a Escribir specs
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** su enlace "Siguiente paso" apunta a `/guias/formato-de-specs/` y ese destino responde HTTP 200

### Requirement: Comandos con variantes PowerShell y bash
Las páginas `/empieza/instalacion/` y `/empieza/primer-cambio/` SHALL mostrar sus comandos de terminal en pestañas sincronizadas con las variantes "PowerShell" y "bash".

#### Scenario: Pestañas de shell en instalación
- **WHEN** se carga `/empieza/instalacion/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"

#### Scenario: Pestañas sincronizadas
- **WHEN** el lector selecciona "bash" en un grupo de pestañas de `/empieza/primer-cambio/`
- **THEN** todos los grupos de pestañas de shell de la página muestran la variante "bash"

### Requirement: Duración del tutorial Tu primer cambio
La página `/empieza/primer-cambio/` SHALL declarar `duration` con un valor entre 1 y 30 minutos, y la cabecera de metadatos SHALL mostrarlo.

#### Scenario: Duración declarada del tutorial
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la cabecera de metadatos muestra una duración de 30 minutos o menos
