# Spec Delta

## MODIFIED Requirements

### Requirement: Maquetación del manual como libro
`/manual/` SHALL presentarse como un manual con portada (título «OpenSpec desde cero», subtítulo, autor y versión de OpenSpec de referencia), una página con la infografía «OpenSpec: desarrollo guiado por especificaciones con IA», un capítulo «00 · Cómo usar este manual» con una ruta de lectura por días, un índice agrupado en partes y una cabecera numerada por sección. Las secciones de los grupos Empieza, Guías, Con tu agente y En equipo SHALL numerarse como capítulos («Capítulo 01», «Capítulo 02»…) y las de Referencia, Recursos y Cómo se hizo como anexos con letra («Anexo A», «Anexo B»…), conservando el orden del sidebar.

#### Scenario: Portada del manual
- **WHEN** se carga `/manual/`
- **THEN** la primera sección contiene el título «OpenSpec desde cero», el nombre del autor y la versión de OpenSpec de referencia del sitio

#### Scenario: Infografía tras la portada
- **WHEN** se carga `/manual/`
- **THEN** la sección inmediatamente posterior a la portada contiene la figura con nombre accesible «OpenSpec: desarrollo guiado por especificaciones con IA» y precede a la sección «Cómo usar este manual»

#### Scenario: Infografía en una página propia al imprimir
- **WHEN** se emula el medio de impresión en `/manual/` con tamaño A4
- **THEN** la sección de la infografía empieza en una página nueva, la siguiente sección empieza también en una página nueva y la altura de la infografía no supera el área imprimible de una página

#### Scenario: Capítulo de cómo usar el manual
- **WHEN** se carga `/manual/`
- **THEN** antes del primer capítulo de contenido hay una sección «Cómo usar este manual» con una tabla de ruta de lectura cuyas filas enlazan a capítulos existentes del propio manual

#### Scenario: Numeración de capítulos y anexos
- **WHEN** se carga `/manual/`
- **THEN** cada sección de Empieza, Guías, Con tu agente y En equipo lleva la etiqueta «Capítulo NN» con numeración consecutiva desde 01, y cada sección de Referencia, Recursos y Cómo se hizo lleva la etiqueta «Anexo X» con letras consecutivas desde A

#### Scenario: Índice agrupado en partes
- **WHEN** se carga `/manual/`
- **THEN** el índice agrupa las entradas bajo un encabezado por parte, en el orden de los grupos del sidebar, y cada entrada muestra su número o letra
