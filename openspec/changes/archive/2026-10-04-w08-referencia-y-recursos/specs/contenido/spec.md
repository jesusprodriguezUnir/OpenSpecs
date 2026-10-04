## ADDED Requirements

### Requirement: Páginas de Referencia con contenido
Las páginas `/referencia/comandos-chat/`, `/referencia/cli/`, `/referencia/plantillas/`, `/referencia/glosario/` y `/referencia/faq/` SHALL NOT contener el texto "Página en preparación".

#### Scenario: Referencia sin marcadores de preparación
- **WHEN** se carga cada una de las cinco páginas de Referencia
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Enlace "Siguiente paso" en Referencia
Cada página de Referencia SHALL terminar con una sección "Siguiente paso" con un enlace según la cadena comandos-chat → cli → plantillas → glosario → faq → `/recursos/`, y cada destino SHALL responder HTTP 200.

#### Scenario: Cadena de Siguiente paso en Referencia
- **WHEN** se carga cada página de Referencia
- **THEN** su enlace "Siguiente paso" apunta a la siguiente de la cadena y ese destino responde HTTP 200

#### Scenario: FAQ enlaza a Recursos
- **WHEN** se carga `/referencia/faq/`
- **THEN** su enlace "Siguiente paso" apunta a `/recursos/` y ese destino responde HTTP 200

### Requirement: Anclas estables en el glosario
Cada término de `/referencia/glosario/` SHALL ser un encabezado cuyo `id` es el nombre del término en minúsculas, sin tildes y con guiones (p. ej. "Delta spec" → `delta-spec`).

#### Scenario: Ancla de delta spec
- **WHEN** se carga `/referencia/glosario/#delta-spec`
- **THEN** existe un encabezado con `id="delta-spec"` cuyo texto es "Delta spec"

#### Scenario: Anclas únicas en el glosario
- **WHEN** se carga `/referencia/glosario/`
- **THEN** ningún `id` de encabezado de término se repite

### Requirement: Referencia de comandos coherente con la CLI fijada
El repositorio SHALL versionar una fixture con la salida de ayuda de la CLI de OpenSpec y la lista de comandos de chat `/opsx:*` que genera `openspec init`, para la versión indicada en `openspecVersion` de las páginas de comandos. La comprobación SHALL fallar si `/referencia/cli/` documenta un comando o flag de `openspec` que no está en la fixture, si `/referencia/comandos-chat/` documenta un `/opsx:*` que no está en la fixture, o si la versión de la fixture no coincide con `openspecVersion` de esas páginas.

#### Scenario: Comando inexistente en la referencia CLI
- **WHEN** `/referencia/cli/` documenta `openspec deploy` y la fixture no contiene ese comando
- **THEN** la comprobación falla e identifica `deploy`

#### Scenario: Flag inexistente en la referencia CLI
- **WHEN** `/referencia/cli/` documenta `openspec archive --force-all` y la fixture no contiene ese flag para `archive`
- **THEN** la comprobación falla e identifica el comando y el flag

#### Scenario: Comando de chat inexistente
- **WHEN** `/referencia/comandos-chat/` documenta `/opsx:proposal` y la fixture no lo contiene
- **THEN** la comprobación falla e identifica `/opsx:proposal`

#### Scenario: Versión de la fixture distinta de la página
- **WHEN** la fixture corresponde a la versión 1.14.0 y `/referencia/cli/` declara `openspecVersion: "1.15.0"`
- **THEN** la comprobación falla e indica ambas versiones

#### Scenario: Comandos principales documentados
- **WHEN** se carga `/referencia/cli/`
- **THEN** cada comando de primer nivel de la fixture, salvo `help`, aparece en la página

### Requirement: Colección de recursos validada
Cada entrada de la colección `resources` SHALL declarar `title`, `url`, `type` y `lang`. El build SHALL fallar, identificando la entrada y el campo, si falta alguno, si `url` no es una URL absoluta con esquema `https`, si `type` no es `oficial`, `comunidad` o `video`, o si `lang` no es `es` o `en`.

#### Scenario: Recurso sin URL
- **WHEN** una entrada de `resources` omite `url` y se ejecuta el build
- **THEN** el build termina con error que identifica la entrada y el campo `url`

#### Scenario: URL no válida
- **WHEN** una entrada declara `url: "intent-driven.dev"`
- **THEN** el build termina con error que identifica el campo `url`

#### Scenario: URL sin https
- **WHEN** una entrada declara `url: "http://example.com"`
- **THEN** el build termina con error que identifica el campo `url`

#### Scenario: Tipo no permitido
- **WHEN** una entrada declara `type: blog`
- **THEN** el build termina con error que identifica el campo `type`

#### Scenario: Idioma no permitido
- **WHEN** una entrada declara `lang: fr`
- **THEN** el build termina con error que identifica el campo `lang`

### Requirement: Listado de recursos
La página `/recursos/` SHALL mostrar cada recurso de la colección como un enlace a su `url` con su título, e indicar su tipo y su idioma. Los enlaces externos SHALL llevar `rel` con `noopener`.

#### Scenario: Todos los recursos listados
- **WHEN** se carga `/recursos/`
- **THEN** hay un enlace por cada entrada de `resources`, con su título como texto y su `url` como `href`

#### Scenario: Tipo e idioma visibles
- **WHEN** se carga `/recursos/`
- **THEN** cada recurso muestra su tipo ("Oficial", "Comunidad" o "Vídeo") y su idioma

### Requirement: Filtro de recursos por tipo
La página `/recursos/` SHALL ofrecer un grupo de opciones etiquetado "Filtrar por tipo" con "Todos", "Oficial", "Comunidad" y "Vídeo", operable con teclado, que muestre solo los recursos del tipo elegido sin recargar la página y con JavaScript desactivado. Por defecto SHALL estar seleccionado "Todos". La página SHALL NOT cargar scripts que no cargue una guía.

#### Scenario: Filtrar vídeos sin JavaScript
- **WHEN** con JavaScript desactivado el lector selecciona "Vídeo" en `/recursos/`
- **THEN** solo son visibles los recursos de tipo vídeo y la URL de la página no cambia

#### Scenario: Todos por defecto
- **WHEN** se carga `/recursos/`
- **THEN** "Todos" está seleccionado y todos los recursos son visibles

#### Scenario: Filtro con teclado
- **WHEN** el lector llega al filtro con Tab y pulsa flecha a la derecha
- **THEN** cambia la opción seleccionada y la lista se actualiza

#### Scenario: Recursos sin scripts extra
- **WHEN** se comparan los scripts de `/recursos/` con los de una guía
- **THEN** `/recursos/` no carga ningún script adicional
