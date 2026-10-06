# Spec Delta

## ADDED Requirements

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
