# contenido Specification

## Purpose
Define los metadatos que deben declarar las guías del sitio, cómo se muestran al lector y cuándo se le avisa de que el contenido puede estar desactualizado.

## Requirements

### Requirement: Metadatos obligatorios en guías
El build SHALL fallar si una página bajo `/empieza/`, `/guias/`, `/agentes/` o `/equipo/` no declara en su frontmatter `openspecVersion`, `lastReviewed` y `level`. `duration` SHALL ser opcional.

#### Scenario: Guía sin openspecVersion
- **WHEN** una página bajo `/guias/` omite `openspecVersion` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin lastReviewed
- **WHEN** una página bajo `/empieza/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin level
- **WHEN** una página bajo `/agentes/` omite `level` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin duration
- **WHEN** una página bajo `/equipo/` declara `openspecVersion`, `lastReviewed` y `level` pero no `duration`
- **THEN** el build termina correctamente

### Requirement: Metadatos obligatorios en referencia
El build SHALL fallar si una página bajo `/referencia/` no declara `openspecVersion` y `lastReviewed`. `level` y `duration` SHALL ser opcionales.

#### Scenario: Referencia sin lastReviewed
- **WHEN** una página bajo `/referencia/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Referencia sin level
- **WHEN** una página bajo `/referencia/` declara `openspecVersion` y `lastReviewed` pero no `level`
- **THEN** el build termina correctamente

### Requirement: Páginas fuera de las secciones de guía
Las páginas que no están bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` ni `/referencia/` (landing, 404, `/recursos/`, `/como-se-hizo/`) SHALL construirse sin declarar los metadatos de guía.

#### Scenario: Landing sin metadatos
- **WHEN** la landing `/` no declara `openspecVersion`, `lastReviewed`, `level` ni `duration`
- **THEN** el build termina correctamente

### Requirement: Valores de metadatos válidos
El build SHALL fallar si `openspecVersion` no tiene formato `X.Y` o `X.Y.Z`, si `level` no es `inicio`, `intermedio` o `avanzado`, si `lastReviewed` no es una fecha válida o si `duration` no es un entero positivo (minutos).

#### Scenario: Nivel no permitido
- **WHEN** una guía declara `level: experto`
- **THEN** el build termina con error que identifica el campo `level`

#### Scenario: Versión con formato inválido
- **WHEN** una guía declara `openspecVersion: "v1"`
- **THEN** el build termina con error que identifica el campo `openspecVersion`

### Requirement: Cabecera de metadatos
Cada página bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/` SHALL mostrar, junto al título, una cabecera con el nivel (si existe), la duración estimada en minutos (si existe), la versión de OpenSpec y la fecha de revisión en formato es-ES. Las páginas fuera de esas secciones SHALL NOT mostrarla.

#### Scenario: Cabecera completa en una guía
- **WHEN** el lector abre una guía con `level`, `duration`, `openspecVersion` y `lastReviewed`
- **THEN** la cabecera muestra el nivel, la duración en minutos, la versión de OpenSpec y la fecha de revisión

#### Scenario: Guía sin duración
- **WHEN** el lector abre una guía sin `duration`
- **THEN** la cabecera muestra nivel, versión y fecha, y no muestra ninguna duración

#### Scenario: Página fuera de guías sin cabecera
- **WHEN** el lector abre `/recursos/`
- **THEN** la página no muestra la cabecera de metadatos

### Requirement: Aviso de contenido desactualizado
Una página con `lastReviewed` anterior en más de 180 días a la fecha del build SHALL mostrar el aviso "contenido posiblemente desactualizado". Con 180 días o menos SHALL NOT mostrarlo.

#### Scenario: Página revisada hace más de 180 días
- **WHEN** una guía tiene `lastReviewed` 181 días anterior a la fecha del build
- **THEN** la página muestra el aviso "contenido posiblemente desactualizado"

#### Scenario: Página revisada hace exactamente 180 días
- **WHEN** una guía tiene `lastReviewed` 180 días anterior a la fecha del build
- **THEN** la página no muestra el aviso

#### Scenario: Página revisada recientemente
- **WHEN** una guía tiene `lastReviewed` igual a la fecha del build
- **THEN** la página no muestra el aviso

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
