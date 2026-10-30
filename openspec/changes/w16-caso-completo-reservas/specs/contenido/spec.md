# Spec Delta

## ADDED Requirements

### Requirement: Artefactos reales en Tu primer cambio
La página `/empieza/primer-cambio/` SHALL mostrar, cada uno en un bloque de código con botón de copiar y cuyo título es la ruta del fichero, el contenido de `openspec/changes/reservas-cancelacion/proposal.md`, `specs/reservas/spec.md`, `design.md` y `tasks.md` de ese change, y el de `openspec/specs/reservas/spec.md` tras archivar. Cada bloque SHALL estar en la sección del paso que genera ese fichero.

#### Scenario: Artefactos del paso de propuesta
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la sección «2. Proponer el cambio» contiene cuatro bloques de código titulados con las rutas de `proposal.md`, `specs/reservas/spec.md`, `design.md` y `tasks.md` del change `reservas-cancelacion`

#### Scenario: Spec principal tras archivar
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la sección «4. Archivar» contiene un bloque de código titulado `openspec/specs/reservas/spec.md`

#### Scenario: Bloques copiables
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** cada bloque de artefacto tiene un botón de copiar con nombre accesible

### Requirement: Nota «Qué mirar» por artefacto
Cada bloque de artefacto de `/empieza/primer-cambio/` SHALL ir seguido de una nota titulada «Qué mirar» que contenga al menos un enlace interno a una página de concepto del sitio. Cada enlace SHALL resolver a una página existente del sitio construido.

#### Scenario: Nota tras cada artefacto
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** cada bloque de artefacto va seguido de una nota «Qué mirar» con al menos un enlace interno

#### Scenario: Enlaces de las notas válidos
- **WHEN** se recorren los enlaces de las notas «Qué mirar»
- **THEN** cada destino responde HTTP 200 y, si incluye un ancla, existe un elemento con ese `id`

### Requirement: Procedencia de los artefactos de ejemplo
`/empieza/primer-cambio/` SHALL indicar, antes del primer bloque de artefacto, la versión de OpenSpec, el agente y la fecha con que se capturaron los artefactos, y SHALL advertir de que la salida del lector será distinta. La versión indicada SHALL coincidir con `openspecVersion` de la página.

#### Scenario: Aviso de procedencia
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** antes del primer bloque de artefacto hay un aviso con la versión de OpenSpec, el agente y la fecha de captura

#### Scenario: Versión de procedencia distinta de la página
- **WHEN** la versión de captura de la instantánea no coincide con `openspecVersion` de `/empieza/primer-cambio/`
- **THEN** la comprobación de contenido falla indicando ambas versiones

### Requirement: Instantánea del ejemplo versionada y válida
El repositorio SHALL versionar los artefactos del ejemplo como un proyecto OpenSpec de ejemplo, y la página SHALL mostrar el contenido literal de esos ficheros. La comprobación SHALL fallar si la instantánea no pasa `openspec validate --all --strict` con la versión de OpenSpec fijada en el proyecto.

#### Scenario: Instantánea válida
- **WHEN** se ejecuta la comprobación sobre la instantánea versionada
- **THEN** `openspec validate --all --strict` termina sin errores

#### Scenario: Instantánea inválida
- **WHEN** un fichero de la instantánea tiene un requisito sin `#### Scenario:`
- **THEN** la comprobación falla identificando el fichero

#### Scenario: Página fiel a la instantánea
- **WHEN** se construye el sitio
- **THEN** el texto de cada bloque de artefacto de `/empieza/primer-cambio/` es idéntico al del fichero correspondiente de la instantánea

### Requirement: Infografía del ciclo de vida
`/empieza/primer-cambio/` SHALL incluir, antes del paso 1, una figura con nombre accesible «Ciclo de vida de OpenSpec» que muestre, en orden, las etapas explorar, proponer, revisar, implementar, verificar y archivar, y para cada una su entrada, su salida y su criterio de «hecho». Cada comando `openspec` o `/opsx:*` que aparezca SHALL estar en la fixture de la CLI de la versión fijada.

#### Scenario: Etapas en orden
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la figura «Ciclo de vida de OpenSpec» contiene seis etapas en el orden explorar, proponer, revisar, implementar, verificar y archivar

#### Scenario: Entrada, salida y criterio por etapa
- **WHEN** se inspecciona cada etapa de la figura
- **THEN** contiene los rótulos «Entrada», «Salida» y «Hecho cuando» con texto no vacío

#### Scenario: Comando inexistente en la figura
- **WHEN** la figura menciona un comando `/opsx:*` u `openspec` que no está en la fixture de la CLI
- **THEN** la comprobación falla nombrando el comando

### Requirement: Infografía de la anatomía de un change
`/empieza/primer-cambio/`, en la sección del paso 2, SHALL incluir una figura con nombre accesible «Anatomía de un change» que muestre la estructura de carpetas de un change (`.openspec.yaml`, `proposal.md`, `specs/<dominio>/spec.md`, `design.md` y `tasks.md`), la función de cada fichero y la cadena requisito → escenario → tarea → test.

#### Scenario: Ficheros del change
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la figura «Anatomía de un change» nombra `.openspec.yaml`, `proposal.md`, `spec.md`, `design.md` y `tasks.md`, cada uno con una descripción de su función

#### Scenario: Cadena de trazabilidad
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la figura muestra en este orden los eslabones «Requisito», «Escenario», «Tarea» y «Test»

### Requirement: Infografías accesibles y sin JavaScript
Las figuras «Ciclo de vida de OpenSpec» y «Anatomía de un change» SHALL tener su contenido como texto HTML (no como imagen de mapa de bits), SHALL ocultar los iconos decorativos a las tecnologías de apoyo, SHALL no causar desbordamiento horizontal a 360 px de ancho y SHALL no añadir JavaScript de cliente a la página.

#### Scenario: Contenido como texto
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** el texto de las etapas y de los ficheros de ambas figuras está en el DOM y ninguna figura contiene un `img` de mapa de bits

#### Scenario: Iconos decorativos ocultos
- **WHEN** se inspeccionan los `svg` dentro de ambas figuras
- **THEN** cada uno tiene `aria-hidden="true"`

#### Scenario: Sin desbordamiento a 360 px
- **WHEN** se carga `/empieza/primer-cambio/` con un viewport de 360 px de ancho
- **THEN** el ancho de desplazamiento del documento no supera el del viewport

#### Scenario: Sin violaciones de accesibilidad
- **WHEN** se analiza `/empieza/primer-cambio/` con axe en modo claro y en modo oscuro
- **THEN** no hay violaciones de nivel serious ni critical

#### Scenario: Sin JavaScript añadido
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la página no carga ningún script que no cargue también `/empieza/que-es/`

### Requirement: Infografías del tutorial al imprimir el manual
En `/manual/` impreso en A4, ninguna de las figuras «Ciclo de vida de OpenSpec» y «Anatomía de un change» SHALL partirse entre dos páginas.

#### Scenario: Figuras sin cortes al imprimir
- **WHEN** se emula el medio de impresión en `/manual/` con tamaño A4
- **THEN** cada una de las dos figuras tiene `break-inside: avoid` y su altura no supera el área imprimible de una página
