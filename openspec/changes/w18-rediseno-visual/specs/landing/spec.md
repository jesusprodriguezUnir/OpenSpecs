## MODIFIED Requirements

### Requirement: Hero con propuesta de valor y llamadas a la acción
La página `/` SHALL mostrar un hero con un `h1`, un tagline, una llamada a la acción primaria que enlace a `/empieza/primer-cambio/` y una secundaria que enlace a `/empieza/que-es/`. La primaria SHALL aparecer antes que la secundaria en el orden del documento. El hero SHALL incluir además un enlace de descarga al manual PDF que indique su tamaño real y la versión de OpenSpec de referencia del sitio.

#### Scenario: CTA primario al primer cambio
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un enlace a `/empieza/primer-cambio/` cuyo nombre accesible incluye "30 minutos"

#### Scenario: CTA secundario a qué es OpenSpec
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un enlace a `/empieza/que-es/` situado después del CTA primario

#### Scenario: Destinos de los CTA existen
- **WHEN** se navega a cada destino de las llamadas a la acción de `/`
- **THEN** cada uno responde con estado 200

#### Scenario: Enlace al manual PDF con su tamaño real
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un enlace a `/manual-openspec.pdf` cuyo texto incluye el tamaño del fichero servido, expresado en MB con coma decimal y una cifra decimal

#### Scenario: Versión de OpenSpec de referencia en el hero
- **WHEN** un visitante abre `/`
- **THEN** el hero muestra "OpenSpec" seguido de la versión más alta declarada en el campo `openspecVersion` de las páginas de guía

### Requirement: Tres recorridos
La página `/` SHALL presentar, bajo un encabezado "¿Desde dónde partes?", tres recorridos llamados "Inicio", "Equipo" y "Consulta", en ese orden, cada uno con un enlace a su página de entrada: `/empieza/que-es/`, `/equipo/adopcion/` y `/referencia/cli/` respectivamente. El recorrido "Equipo" SHALL indicar en texto visible que es el recomendado. El recorrido "Consulta" SHALL mencionar la búsqueda del sitio. Cada recorrido SHALL indicar el número de páginas de su sección.

#### Scenario: Recorridos con su destino
- **WHEN** un visitante abre `/`
- **THEN** los recorridos "Inicio", "Equipo" y "Consulta" aparecen en ese orden y enlazan cada uno a su página de entrada

#### Scenario: Equipo marcado como recomendado
- **WHEN** se lee el recorrido "Equipo"
- **THEN** su texto incluye "Recomendado" (sin distinguir mayúsculas)

#### Scenario: Consulta menciona la búsqueda
- **WHEN** se lee el recorrido "Consulta"
- **THEN** su texto menciona la búsqueda ("búsqueda" o "buscador")

#### Scenario: Número de páginas coherente con el sidebar
- **WHEN** se lee el número de páginas de cada recorrido
- **THEN** coincide con el número de enlaces del grupo del sidebar al que pertenece su página de entrada

### Requirement: Movimiento reducido
Cuando el usuario prefiere movimiento reducido, la página `/` MUST NOT tener animaciones ni transiciones en curso.

#### Scenario: Sin animaciones con prefers-reduced-motion
- **WHEN** se abre `/` emulando `prefers-reduced-motion: reduce`
- **THEN** ningún elemento de la página tiene una animación ni una transición en curso

## ADDED Requirements

### Requirement: Ciclo de un change en seis pasos
La página `/` SHALL contener, bajo un encabezado "El ciclo de un change", una lista ordenada con nombre accesible y exactamente seis elementos que nombren, en este orden, `/opsx:explore`, `/opsx:propose`, una revisión humana, `/opsx:apply`, `/opsx:verify` y `/opsx:archive`, cada uno con una descripción de texto. El paso de `/opsx:explore` SHALL indicar que es opcional y el de `/opsx:verify` SHALL indicar «perfil ampliado».

#### Scenario: Seis pasos en orden
- **WHEN** un visitante abre `/`
- **THEN** existe una lista ordenada con nombre accesible cuyos seis elementos contienen "explore", "propose", "Revisión", "apply", "verify" y "archive" en ese orden

#### Scenario: Cada paso tiene descripción
- **WHEN** se lee cada elemento de la lista del ciclo
- **THEN** contiene texto además del nombre del paso

#### Scenario: Paso opcional y paso del perfil ampliado marcados
- **WHEN** se leen los pasos de `/opsx:explore` y `/opsx:verify`
- **THEN** el primero incluye «opcional» y el segundo incluye «perfil ampliado»

### Requirement: Comandos de la home documentados
Toda cadena con forma `/opsx:<nombre>` que aparezca en la página `/` SHALL estar documentada en `/referencia/comandos-chat/`, bien como comando `/opsx:<nombre>`, bien como workflow `<nombre>` de la tabla del perfil ampliado.

#### Scenario: Comandos /opsx de la home documentados
- **WHEN** se extraen de `/` todas las cadenas con forma `/opsx:<nombre>`
- **THEN** cada `<nombre>` aparece en `/referencia/comandos-chat/` como comando o como workflow

#### Scenario: Comando inexistente en la home detectado
- **WHEN** `/` contiene un comando `/opsx:<nombre>` que no figura en `/referencia/comandos-chat/`
- **THEN** la comprobación falla e identifica el comando

### Requirement: Figura de ejemplo de delta spec
El hero de `/` SHALL incluir una figura (`<figure>`) con un pie de figura que le da nombre accesible y que muestra, como texto seleccionable, un fragmento de delta spec con encabezados `## ADDED Requirements`, `### Requirement:` y `#### Scenario:` y cláusulas `WHEN`/`THEN`. Las pestañas de ficheros de la figura SHALL ser decorativas: ocultas a tecnologías de apoyo y no interactivas. La figura MUST NOT afirmar cifras que no se deriven de su propio contenido.

#### Scenario: Figura con nombre accesible y texto de spec
- **WHEN** se inspecciona la figura del hero de `/`
- **THEN** tiene nombre accesible, no contiene `<img>` y su texto incluye "ADDED Requirements", "Requirement:", "Scenario:", "WHEN" y "THEN"

#### Scenario: Pestañas decorativas no interactivas
- **WHEN** se inspeccionan las pestañas de ficheros de la figura
- **THEN** están dentro de un elemento con `aria-hidden="true"` y la figura no contiene elementos con `role="tab"` ni botones

#### Scenario: Recuento de escenarios coherente
- **WHEN** la figura muestra un número de escenarios
- **THEN** ese número es igual al número de líneas `#### Scenario:` visibles en la figura

### Requirement: Sección Dos carpetas
La página `/` SHALL contener una sección con encabezado "Dos carpetas, un modelo mental" que nombre `openspec/changes/`, `openspec/changes/archive/` y `openspec/specs/`, muestre las etiquetas de delta ADDED, MODIFIED, REMOVED y RENAMED como texto y enlace a `/empieza/conceptos/`.

#### Scenario: Carpetas y etiquetas presentes
- **WHEN** se lee la sección "Dos carpetas, un modelo mental"
- **THEN** su texto contiene `openspec/changes/`, `openspec/specs/`, "ADDED", "MODIFIED", "REMOVED" y "RENAMED"

#### Scenario: Enlace a conceptos
- **WHEN** se recorren los enlaces de la sección
- **THEN** uno de ellos apunta a `/empieza/conceptos/` y responde con estado 200

### Requirement: Sección En equipo
La página `/` SHALL contener una sección con encabezado "En equipo" con enlaces a `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/`, `/equipo/gobierno/` y `/equipo/adopcion/`.

#### Scenario: Enlaces de En equipo
- **WHEN** se recorren los enlaces de la sección "En equipo" de `/`
- **THEN** incluyen las cinco páginas de `/equipo/` indicadas y todas responden con estado 200

### Requirement: Sección Para llevártelo
La página `/` SHALL contener una sección con encabezado "Para llevártelo" con enlaces a `/manual-openspec.pdf`, `/recursos/` y `/como-se-hizo/`.

#### Scenario: Enlaces de Para llevártelo
- **WHEN** se recorren los enlaces de la sección "Para llevártelo" de `/`
- **THEN** incluyen los tres destinos indicados y todos responden con estado 200

### Requirement: Home adaptable a móvil
La página `/` SHALL mostrarse sin desplazamiento horizontal en pantallas estrechas, y sus iconos SVG decorativos SHALL estar ocultos a tecnologías de apoyo.

#### Scenario: Home sin desbordamiento horizontal a 360 px
- **WHEN** se carga `/` con un viewport de 360 px de ancho
- **THEN** el ancho de desplazamiento del documento no supera el ancho del viewport

#### Scenario: Iconos de la home ocultos a tecnologías de apoyo
- **WHEN** se inspeccionan los SVG de `main` en `/`
- **THEN** todos tienen `aria-hidden="true"`

## REMOVED Requirements

### Requirement: Bloque "qué es en 3 frases"
**Reason**: El hero nuevo resume el método en el `h1` y el subtítulo; el bloque de tres frases duplica ese mensaje.
**Migration**: La explicación ampliada sigue en `/empieza/que-es/`, enlazada desde el CTA secundario.

### Requirement: Ciclo /opsx en cuatro pasos
**Reason**: El ciclo pasa a seis pasos (explore opcional, propose, revisión humana, apply, verify del perfil ampliado y archive).
**Migration**: Sustituido por «Ciclo de un change en seis pasos».

### Requirement: Terminal decorativa sin JavaScript
**Reason**: La terminal animada se sustituye por la figura estática de delta spec.
**Migration**: Sustituida por «Figura de ejemplo de delta spec».

### Requirement: Animaciones finitas
**Reason**: La home nueva no tiene animaciones decorativas; desaparecen con la terminal y la franja del ciclo.
**Migration**: «Movimiento reducido» sigue garantizando que no hay animaciones en curso cuando el usuario lo prefiere.

### Requirement: Infografía del método en la landing
**Reason**: La infografía sale de la home; se mantiene solo en `/manual/`.
**Migration**: Su presencia en el manual la cubre «Maquetación del manual como libro» en `contenido`.

### Requirement: Bloques de la infografía
**Reason**: La infografía ya no está en `/`.
**Migration**: Los bloques se comprueban sobre `/manual/` mediante «Infografía del manual fiel a OpenSpec» en `contenido`.

### Requirement: Infografía fiel a OpenSpec
**Reason**: La infografía ya no está en `/`.
**Migration**: Trasladado a `contenido` como «Infografía del manual fiel a OpenSpec»; para la home lo sustituye «Comandos de la home documentados».

### Requirement: Infografía adaptable a móvil
**Reason**: La infografía ya no está en `/`.
**Migration**: El desbordamiento de la home lo cubre «Home adaptable a móvil»; el manual se imprime y no se valida a 360 px.
