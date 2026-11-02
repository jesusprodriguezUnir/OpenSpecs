## MODIFIED Requirements

### Requirement: Cabecera de metadatos
Cada página bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/` SHALL mostrar, junto al título, una cabecera con el nivel (si existe), la duración estimada en minutos (si existe), la versión de OpenSpec y la fecha de revisión en formato es-ES. La cabecera SHALL ser una lista de descripción en la que cada dato tiene su término («Nivel», «Duración», «OpenSpec», «Revisado») y su valor. Las páginas fuera de esas secciones SHALL NOT mostrarla.

#### Scenario: Cabecera completa en una guía
- **WHEN** el lector abre una guía con `level`, `duration`, `openspecVersion` y `lastReviewed`
- **THEN** la cabecera muestra el nivel, la duración en minutos, la versión de OpenSpec y la fecha de revisión

#### Scenario: Guía sin duración
- **WHEN** el lector abre una guía sin `duration`
- **THEN** la cabecera muestra nivel, versión y fecha, y no muestra ninguna duración

#### Scenario: Página fuera de guías sin cabecera
- **WHEN** el lector abre `/recursos/`
- **THEN** la página no muestra la cabecera de metadatos

#### Scenario: Cada dato con su término
- **WHEN** se inspecciona la cabecera de una guía con los cuatro campos
- **THEN** es una lista de descripción con los términos «Nivel», «Duración», «OpenSpec» y «Revisado», cada uno seguido de su valor

## ADDED Requirements

### Requirement: Campo commands validado
Las páginas de `docs` MAY declarar en su frontmatter un campo `commands` con una lista de comandos de chat. Si existe, SHALL tener entre 1 y 8 elementos sin repetir y cada elemento SHALL tener la forma `/opsx:<nombre>`, con `<nombre>` en minúsculas, letras y guiones. Un valor inválido MUST hacer fallar el build con un mensaje que nombre la página y el campo `commands`.

#### Scenario: Lista de comandos válida
- **WHEN** una guía declara `commands: ["/opsx:propose", "/opsx:apply"]`
- **THEN** la validación del frontmatter no devuelve errores

#### Scenario: Comando con forma inválida
- **WHEN** una guía declara un elemento de `commands` que no tiene la forma `/opsx:<nombre>`
- **THEN** la validación falla con un mensaje que nombra la página y el campo `commands`

#### Scenario: Comando repetido
- **WHEN** una guía declara el mismo comando dos veces en `commands`
- **THEN** la validación falla con un mensaje que nombra el campo `commands`

#### Scenario: Lista vacía o demasiado larga
- **WHEN** una guía declara `commands` sin elementos o con más de ocho
- **THEN** la validación falla con un mensaje que nombra el campo `commands`

### Requirement: Caja de comandos de la página
Cada página que declare `commands` SHALL mostrar una región complementaria con nombre accesible «Comandos de esta página» que liste esos comandos como código, en el orden declarado, y enlace a `/referencia/comandos-chat/`. Las páginas sin `commands` MUST NOT mostrarla. La caja SHALL ser visible tanto con viewport de escritorio como a 360 px.

#### Scenario: Caja con los comandos declarados
- **WHEN** el lector abre una guía que declara `commands`
- **THEN** existe una región complementaria «Comandos de esta página» que lista como código esos comandos en el orden declarado y enlaza a `/referencia/comandos-chat/`

#### Scenario: Página sin commands
- **WHEN** el lector abre una guía que no declara `commands`
- **THEN** la página no contiene la región «Comandos de esta página»

#### Scenario: Caja visible en escritorio y en móvil
- **WHEN** se abre una guía que declara `commands` con viewports de 1440 px y de 360 px
- **THEN** en ambos la región «Comandos de esta página» es visible

### Requirement: Comandos declarados coherentes
Cada comando declarado en `commands` SHALL estar documentado en `/referencia/comandos-chat/`, como comando `/opsx:<nombre>` o como workflow `<nombre>` de la tabla del perfil ampliado, y SHALL aparecer también en el cuerpo de la propia página.

#### Scenario: Comandos declarados documentados
- **WHEN** se recorren los comandos de todas las páginas que declaran `commands`
- **THEN** cada `<nombre>` aparece en `/referencia/comandos-chat/` como comando o como workflow

#### Scenario: Comando declarado ausente del cuerpo
- **WHEN** una página declara en `commands` un comando que no aparece en su cuerpo
- **THEN** la comprobación falla e identifica la página y el comando

### Requirement: Infografía del manual fiel a OpenSpec
La infografía de `/manual/` SHALL nombrar solo comandos de chat `/opsx:*` documentados en `/referencia/comandos-chat/`, SHALL marcar como «perfil ampliado» los que no pertenecen al perfil por defecto, SHALL usar las rutas `openspec/specs/` y `openspec/changes/` y los artefactos `proposal.md`, `specs/`, `design.md` y `tasks.md`, y SHALL no mencionar tecnologías de un stack concreto (como .NET o Angular).

#### Scenario: Comandos /opsx del manual documentados
- **WHEN** se extraen de la infografía de `/manual/` todas las cadenas con forma `/opsx:<nombre>`
- **THEN** cada `<nombre>` aparece en `/referencia/comandos-chat/`, bien como comando `/opsx:<nombre>`, bien como workflow `<nombre>` de la tabla del perfil ampliado

#### Scenario: Comando inexistente en el manual detectado
- **WHEN** la infografía de `/manual/` contiene un comando `/opsx:<nombre>` que no figura en `/referencia/comandos-chat/`
- **THEN** la comprobación falla e identifica el comando

#### Scenario: Comando del perfil ampliado marcado en el manual
- **WHEN** la infografía de `/manual/` muestra `/opsx:verify`
- **THEN** el mismo paso incluye el texto «perfil ampliado»

#### Scenario: Rutas y artefactos correctos en el manual
- **WHEN** se lee el texto de la infografía de `/manual/`
- **THEN** contiene `openspec/specs/`, `openspec/changes/`, `proposal.md`, `specs/`, `design.md` y `tasks.md`

#### Scenario: Manual sin referencias a un stack concreto
- **WHEN** se lee el texto de la infografía de `/manual/`
- **THEN** no contiene «.NET» ni «Angular»
