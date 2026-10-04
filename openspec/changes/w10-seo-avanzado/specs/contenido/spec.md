## MODIFIED Requirements

### Requirement: Metadatos obligatorios en guías
El build SHALL fallar si una página bajo `/empieza/`, `/guias/`, `/agentes/` o `/equipo/` no declara en su frontmatter `openspecVersion`, `lastReviewed`, `level` y `description`. `duration` SHALL ser opcional.

#### Scenario: Guía sin openspecVersion
- **WHEN** una página bajo `/guias/` omite `openspecVersion` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin lastReviewed
- **WHEN** una página bajo `/empieza/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin level
- **WHEN** una página bajo `/agentes/` omite `level` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin description
- **WHEN** una página bajo `/guias/` omite `description` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo `description`

#### Scenario: Guía sin duration
- **WHEN** una página bajo `/equipo/` declara `openspecVersion`, `lastReviewed`, `level` y `description` pero no `duration`
- **THEN** el build termina correctamente

### Requirement: Metadatos obligatorios en referencia
El build SHALL fallar si una página bajo `/referencia/` no declara `openspecVersion`, `lastReviewed` y `description`. `level` y `duration` SHALL ser opcionales.

#### Scenario: Referencia sin lastReviewed
- **WHEN** una página bajo `/referencia/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Referencia sin description
- **WHEN** una página bajo `/referencia/` omite `description` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo `description`

#### Scenario: Referencia sin level
- **WHEN** una página bajo `/referencia/` declara `openspecVersion`, `lastReviewed` y `description` pero no `level`
- **THEN** el build termina correctamente

## ADDED Requirements

### Requirement: Longitud de description
En las páginas bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/`, el build SHALL fallar si `description` tiene menos de 50 o más de 160 caracteres. Las páginas fuera de esas secciones SHALL construirse con cualquier `description` o sin ella.

#### Scenario: Description demasiado corta
- **WHEN** una guía declara una `description` de 49 caracteres
- **THEN** la validación falla e identifica la página y el campo `description`

#### Scenario: Description demasiado larga
- **WHEN** una guía declara una `description` de 161 caracteres
- **THEN** la validación falla e identifica la página y el campo `description`

#### Scenario: Description en los límites
- **WHEN** una guía declara una `description` de 50 caracteres y otra de 160
- **THEN** ambas pasan la validación

#### Scenario: Description libre fuera de guías
- **WHEN** una página de `/recursos/` declara una `description` de 20 caracteres
- **THEN** la validación no reporta ningún problema
