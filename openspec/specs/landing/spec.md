# landing Specification

## Purpose

Definir qué muestra y enlaza la página de inicio `/` y qué JavaScript de cliente puede cargar, para que oriente a cada perfil de lector a su punto de entrada.

## Requirements

### Requirement: Hero con propuesta de valor y llamadas a la acción
La página `/` SHALL mostrar un hero con un `h1`, un tagline, una llamada a la acción primaria que enlace a `/empieza/primer-cambio/` y una secundaria que enlace a `/empieza/que-es/`. La primaria SHALL aparecer antes que la secundaria en el orden del documento.

#### Scenario: CTA primario al primer cambio
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un enlace a `/empieza/primer-cambio/` cuyo nombre accesible incluye "30 minutos"

#### Scenario: CTA secundario a qué es OpenSpec
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un enlace a `/empieza/que-es/` situado después del CTA primario

#### Scenario: Destinos de los CTA existen
- **WHEN** se navega a cada destino de las llamadas a la acción de `/`
- **THEN** cada uno responde con estado 200

### Requirement: Bloque "qué es en 3 frases"
La página `/` SHALL contener una sección con un encabezado que incluya "OpenSpec" seguida de una lista con exactamente tres elementos, cada uno de una sola frase.

#### Scenario: Tres frases bajo el encabezado
- **WHEN** un visitante abre `/`
- **THEN** a un encabezado que contiene "OpenSpec" le sigue una lista con exactamente tres elementos, cada uno con una frase

### Requirement: Tres recorridos
La página `/` SHALL presentar tres recorridos llamados "Equipo", "Inicio" y "Consulta", en ese orden, cada uno con un enlace a su página de entrada: `/equipo/adopcion/`, `/empieza/que-es/` y `/referencia/cli/` respectivamente. El recorrido "Equipo" SHALL indicar en texto visible que es el recomendado. El recorrido "Consulta" SHALL mencionar la búsqueda del sitio.

#### Scenario: Recorridos con su destino
- **WHEN** un visitante abre `/`
- **THEN** los recorridos "Equipo", "Inicio" y "Consulta" aparecen en ese orden y enlazan cada uno a su página de entrada

#### Scenario: Equipo marcado como recomendado
- **WHEN** se lee el recorrido "Equipo"
- **THEN** su texto incluye "Recomendado" (sin distinguir mayúsculas)

#### Scenario: Consulta menciona la búsqueda
- **WHEN** se lee el recorrido "Consulta"
- **THEN** su texto menciona la búsqueda ("búsqueda" o "buscador")

### Requirement: Sin JavaScript de cliente propio
La página `/` MUST NOT cargar ningún script de cliente que no cargue también una página de guía normal (`/empieza/que-es/`). El JavaScript de cliente propio de la landing SHALL ser 0 KB.

#### Scenario: Mismos scripts que una guía
- **WHEN** se comparan los `<script>` de `/` y de `/empieza/que-es/` (por `src` los externos y por contenido los inline)
- **THEN** todo script de `/` está también en `/empieza/que-es/`

#### Scenario: Script extra detectado
- **WHEN** la comparación recibe un conjunto de scripts de la landing con uno ausente en la guía
- **THEN** la comprobación falla e identifica el script sobrante

### Requirement: Landing accesible
La página `/` SHALL no tener violaciones de axe con impacto `serious` o `critical` ni en el tema oscuro ni en el tema claro.

#### Scenario: La landing sin violaciones graves de accesibilidad
- **WHEN** axe analiza `/` en el tema oscuro
- **THEN** no informa de violaciones con impacto `serious` ni `critical`

#### Scenario: La landing en tema claro sin violaciones graves
- **WHEN** axe analiza `/` con `data-theme="light"`
- **THEN** no informa de violaciones con impacto `serious` ni `critical`

### Requirement: Ciclo /opsx en cuatro pasos
La página `/` SHALL contener una lista ordenada (`<ol>`) con exactamente cuatro elementos que nombren, en este orden, `/opsx:explore`, `/opsx:propose`, `/opsx:apply` y `/opsx:archive`, cada uno con una descripción de texto no vacía. La lista SHALL tener un nombre accesible.

#### Scenario: Cuatro pasos en orden
- **WHEN** un visitante abre `/`
- **THEN** existe una lista ordenada con nombre accesible cuyos cuatro elementos contienen "explore", "propose", "apply" y "archive" en ese orden

#### Scenario: Cada paso tiene descripción
- **WHEN** se lee cada elemento de la lista del ciclo
- **THEN** contiene texto además del nombre del comando

### Requirement: Terminal decorativa sin JavaScript
El hero de `/` SHALL incluir una terminal decorativa con las líneas `openspec init`, `/opsx:propose`, `/opsx:apply` y `/opsx:archive`. La terminal SHALL estar oculta a tecnologías de apoyo (`aria-hidden="true"`) y SHALL renderizarse sin JavaScript de cliente.

#### Scenario: Terminal oculta a tecnologías de apoyo
- **WHEN** un visitante abre `/`
- **THEN** el hero contiene un elemento con `aria-hidden="true"` cuyo texto incluye "openspec init" y "/opsx:archive"

#### Scenario: Terminal visible con JavaScript desactivado
- **WHEN** se abre `/` con JavaScript desactivado
- **THEN** la terminal es visible y su texto incluye "/opsx:apply"

### Requirement: Movimiento reducido
Cuando el usuario prefiere movimiento reducido, la página `/` MUST NOT animar la terminal ni la franja del ciclo, y SHALL mostrar todas las líneas de la terminal desde el primer pintado.

#### Scenario: Sin animaciones con prefers-reduced-motion
- **WHEN** se abre `/` emulando `prefers-reduced-motion: reduce`
- **THEN** ningún elemento de la terminal ni del ciclo tiene una animación en curso y todas las líneas de la terminal son visibles

### Requirement: Tipografía autoalojada
La página `/` SHALL cargar sus fuentes solo desde el propio origen. MUST NOT hacer peticiones a `fonts.googleapis.com` ni a `fonts.gstatic.com`.

#### Scenario: Fuentes servidas desde el propio sitio
- **WHEN** se abre `/` y se registran las peticiones de red
- **THEN** toda petición de tipo `font` es al mismo origen y hay al menos una

#### Scenario: Sin Google Fonts
- **WHEN** se inspecciona el HTML de `/` y sus peticiones
- **THEN** no aparece ninguna referencia a `fonts.googleapis.com` ni `fonts.gstatic.com`

### Requirement: Animaciones finitas
Las animaciones de la terminal y de la franja del ciclo de `/` MUST NOT repetirse indefinidamente: cada una SHALL tener un número finito de iteraciones. Al terminar, el cursor de la terminal SHALL quedar visible.

#### Scenario: Ninguna animación infinita en la landing
- **WHEN** se abre `/` sin preferencia de movimiento reducido
- **THEN** ninguna animación de la terminal ni del ciclo tiene un número de iteraciones infinito

#### Scenario: Cursor visible al terminar
- **WHEN** han terminado todas las animaciones de la terminal
- **THEN** el cursor de la terminal tiene opacidad 1

### Requirement: Infografía del método en la landing
La página `/` SHALL contener una figura (`<figure>`) con nombre accesible «OpenSpec: desarrollo guiado por especificaciones con IA», situada después del bloque «Qué es OpenSpec en 3 frases» y antes de «El ciclo de trabajo». La figura SHALL presentar su contenido como texto HTML seleccionable, no como imagen rasterizada.

#### Scenario: Infografía tras el bloque de tres frases
- **WHEN** se carga `/`
- **THEN** existe una figura con nombre accesible «OpenSpec: desarrollo guiado por especificaciones con IA» y, en orden del documento, aparece después del encabezado «Qué es OpenSpec en 3 frases» y antes del encabezado «El ciclo de trabajo»

#### Scenario: Contenido como texto y no como imagen
- **WHEN** se inspecciona la figura de la infografía en `/`
- **THEN** no contiene elementos `<img>` ni imágenes de mapa de bits, y sus encabezados de bloque se pueden localizar como texto en el DOM

### Requirement: Bloques de la infografía
La infografía SHALL organizarse en bloques numerados con encabezado propio: «Fundamentos», «Los cuatro artefactos de un change», «El ciclo diario con /opsx» y «En equipo». Cada bloque SHALL incluir al menos un enlace a una guía existente del sitio que amplía su contenido.

#### Scenario: Cuatro bloques en orden
- **WHEN** se carga `/`
- **THEN** la infografía contiene exactamente cuatro encabezados de bloque numerados del 1 al 4 con esos títulos y en ese orden

#### Scenario: Cada bloque enlaza a una guía existente
- **WHEN** se recorren los enlaces de cada bloque de la infografía en el sitio construido
- **THEN** cada bloque tiene al menos un enlace y todos responden HTTP 200

### Requirement: Infografía fiel a OpenSpec
La infografía SHALL nombrar solo comandos de chat `/opsx:*` documentados en `/referencia/comandos-chat/`, SHALL marcar como «perfil ampliado» los que no pertenecen al perfil por defecto, SHALL usar las rutas `openspec/specs/` y `openspec/changes/` y los artefactos `proposal.md`, `specs/`, `design.md` y `tasks.md`, y SHALL no mencionar tecnologías de un stack concreto (como .NET o Angular).

#### Scenario: Comandos /opsx documentados
- **WHEN** se extraen de la infografía todas las cadenas con forma `/opsx:<nombre>`
- **THEN** cada `<nombre>` aparece en `/referencia/comandos-chat/`, bien como comando `/opsx:<nombre>`, bien como workflow `<nombre>` de la tabla del perfil ampliado

#### Scenario: Comando inexistente detectado
- **WHEN** la infografía contiene un comando `/opsx:<nombre>` que no figura en `/referencia/comandos-chat/`
- **THEN** la comprobación falla e identifica el comando

#### Scenario: Comando del perfil ampliado marcado
- **WHEN** la infografía muestra `/opsx:verify`
- **THEN** el mismo paso incluye el texto «perfil ampliado»

#### Scenario: Rutas y artefactos correctos
- **WHEN** se lee el texto de la infografía
- **THEN** contiene `openspec/specs/`, `openspec/changes/`, `proposal.md`, `specs/`, `design.md` y `tasks.md`

#### Scenario: Sin referencias a un stack concreto
- **WHEN** se lee el texto de la infografía
- **THEN** no contiene «.NET» ni «Angular»

### Requirement: Infografía adaptable a móvil
La infografía SHALL reorganizar sus bloques en una sola columna en pantallas estrechas sin provocar desplazamiento horizontal de la página.

#### Scenario: Sin desbordamiento horizontal a 360 px
- **WHEN** se carga `/` con un viewport de 360 px de ancho
- **THEN** el ancho de desplazamiento del documento no supera el ancho del viewport

#### Scenario: Iconos decorativos ocultos a tecnologías de apoyo
- **WHEN** se inspeccionan los iconos de la infografía
- **THEN** todos los iconos SVG tienen `aria-hidden="true"` y no aportan nombre accesible
