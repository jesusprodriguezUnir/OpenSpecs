## ADDED Requirements

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

## MODIFIED Requirements

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

### Requirement: Landing accesible
La página `/` SHALL no tener violaciones de axe con impacto `serious` o `critical` ni en el tema oscuro ni en el tema claro.

#### Scenario: La landing sin violaciones graves de accesibilidad
- **WHEN** axe analiza `/` en el tema oscuro
- **THEN** no informa de violaciones con impacto `serious` ni `critical`

#### Scenario: La landing en tema claro sin violaciones graves
- **WHEN** axe analiza `/` con `data-theme="light"`
- **THEN** no informa de violaciones con impacto `serious` ni `critical`

## REMOVED Requirements

### Requirement: Diagrama accesible del ciclo /opsx
**Reason**: El diseño 1a sustituye el diagrama SVG por una franja de cuatro pasos en texto, más legible y accesible por sí misma.
**Migration**: El ciclo queda cubierto por "Ciclo /opsx en cuatro pasos"; los tests del SVG se sustituyen por los de la lista ordenada.
