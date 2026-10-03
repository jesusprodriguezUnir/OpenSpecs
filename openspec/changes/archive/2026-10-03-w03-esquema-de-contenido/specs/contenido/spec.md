## Purpose

Define los metadatos que deben declarar las guías del sitio, cómo se muestran al lector y cuándo se le avisa de que el contenido puede estar desactualizado.

## ADDED Requirements

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
