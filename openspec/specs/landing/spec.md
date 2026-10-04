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
La página `/` SHALL contener una sección con un encabezado que incluya "OpenSpec" cuyo cuerpo tenga exactamente tres frases.

#### Scenario: Tres frases bajo el encabezado
- **WHEN** un visitante abre `/`
- **THEN** a un encabezado que contiene "OpenSpec" le sigue un párrafo con exactamente tres frases

### Requirement: Diagrama accesible del ciclo /opsx
La página `/` SHALL contener un diagrama SVG en línea del ciclo explore → propose → apply → archive, expuesto como imagen (`role="img"`), con nombre accesible tomado de su `<title>` y un texto alternativo en `<desc>` que nombre los cuatro pasos en orden.

#### Scenario: Diagrama con nombre accesible
- **WHEN** un visitante abre `/`
- **THEN** existe un `svg` con `role="img"` cuyo nombre accesible no está vacío y procede de su `<title>`

#### Scenario: Texto alternativo con los cuatro pasos en orden
- **WHEN** se lee el `<desc>` del diagrama
- **THEN** contiene "explore", "propose", "apply" y "archive" en ese orden

#### Scenario: Diagrama sin imagen externa
- **WHEN** se inspecciona el HTML de `/`
- **THEN** el diagrama es marcado en línea y no un elemento `<img>`

### Requirement: Tres recorridos
La página `/` SHALL presentar tres recorridos llamados "Inicio", "Equipo" y "Consulta", cada uno con un enlace a su página de entrada: `/empieza/que-es/`, `/equipo/adopcion/` y `/referencia/cli/` respectivamente. El recorrido "Consulta" SHALL mencionar la búsqueda del sitio.

#### Scenario: Recorridos con su destino
- **WHEN** un visitante abre `/`
- **THEN** los recorridos "Inicio", "Equipo" y "Consulta" enlazan cada uno a su página de entrada

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
La página `/` SHALL no tener violaciones de axe con impacto `serious` o `critical`.

#### Scenario: La landing sin violaciones graves de accesibilidad
- **WHEN** axe analiza `/`
- **THEN** no informa de violaciones con impacto `serious` ni `critical`
