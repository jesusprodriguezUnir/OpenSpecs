## ADDED Requirements

### Requirement: Página de manual imprimible
El sitio construido SHALL publicar `/manual/` con una portada, un índice y el contenido de todas las páginas enlazadas en el sidebar, en el mismo orden que el sidebar. La página SHALL no cargar JavaScript de cliente propio, SHALL incluir `<meta name="robots" content="noindex">` y SHALL quedar fuera del sitemap y del índice de búsqueda.

#### Scenario: Manual con todas las páginas en orden del sidebar
- **WHEN** se solicita `/manual/` al sitio construido
- **THEN** la respuesta es HTTP 200 y contiene una sección por cada página enlazada en el sidebar, con su título como encabezado, en el mismo orden que el sidebar

#### Scenario: Índice enlazado a cada sección
- **WHEN** se carga `/manual/`
- **THEN** el índice contiene un enlace por sección y cada enlace apunta a un ancla existente dentro de la propia página

#### Scenario: Manual fuera de buscadores y del sitemap
- **WHEN** se inspeccionan `/manual/` y el sitemap del sitio construido
- **THEN** `/manual/` tiene `noindex` y no aparece en el sitemap

#### Scenario: Manual excluido de la búsqueda
- **WHEN** se busca en el sitio un término que solo aparece en la portada del manual
- **THEN** ningún resultado apunta a `/manual/`

#### Scenario: Manual sin JavaScript propio
- **WHEN** se carga `/manual/`
- **THEN** la página respeta el presupuesto de scripts del sitio y no añade scripts propios

#### Scenario: Página nueva aparece en el manual
- **WHEN** se añade una página de contenido enlazada en el sidebar y se reconstruye el sitio
- **THEN** `/manual/` incluye su sección en la posición que ocupa en el sidebar

#### Scenario: Páginas no enlazadas en el sidebar quedan fuera
- **WHEN** se carga `/manual/`
- **THEN** no contiene secciones para la 404, las páginas legales ni la landing

### Requirement: Manual descargable en PDF
El sitio construido SHALL servir `/manual-openspec.pdf` con `Content-Type: application/pdf`, y SHALL enlazarlo con el texto «Manual en PDF», el atributo `download` y el peso del fichero indicado, desde la landing y desde el grupo «Recursos» del sidebar.

#### Scenario: PDF servido
- **WHEN** se solicita `/manual-openspec.pdf` al sitio construido
- **THEN** la respuesta es HTTP 200 con `Content-Type: application/pdf` y un cuerpo que empieza por `%PDF-`

#### Scenario: Enlace de descarga en la landing
- **WHEN** se carga `/`
- **THEN** hay un enlace «Manual en PDF» a `/manual-openspec.pdf` con atributo `download` y el peso en MB visible

#### Scenario: Enlace de descarga en el sidebar
- **WHEN** se carga cualquier página de guía
- **THEN** el grupo «Recursos» del sidebar contiene un enlace a `/manual-openspec.pdf` y el sidebar sigue mostrando solo los siete grupos de primer nivel

### Requirement: Maquetación del manual como libro
`/manual/` SHALL presentarse como un manual con portada (título «OpenSpec desde cero», subtítulo, autor y versión de OpenSpec de referencia), un capítulo «00 · Cómo usar este manual» con una ruta de lectura por días, un índice agrupado en partes y una cabecera numerada por sección. Las secciones de los grupos Empieza, Guías, Con tu agente y En equipo SHALL numerarse como capítulos («Capítulo 01», «Capítulo 02»…) y las de Referencia, Recursos y Cómo se hizo como anexos con letra («Anexo A», «Anexo B»…), conservando el orden del sidebar.

#### Scenario: Portada del manual
- **WHEN** se carga `/manual/`
- **THEN** la primera sección contiene el título «OpenSpec desde cero», el nombre del autor y la versión de OpenSpec de referencia del sitio

#### Scenario: Capítulo de cómo usar el manual
- **WHEN** se carga `/manual/`
- **THEN** antes del primer capítulo de contenido hay una sección «Cómo usar este manual» con una tabla de ruta de lectura cuyas filas enlazan a capítulos existentes del propio manual

#### Scenario: Numeración de capítulos y anexos
- **WHEN** se carga `/manual/`
- **THEN** cada sección de Empieza, Guías, Con tu agente y En equipo lleva la etiqueta «Capítulo NN» con numeración consecutiva desde 01, y cada sección de Referencia, Recursos y Cómo se hizo lleva la etiqueta «Anexo X» con letras consecutivas desde A

#### Scenario: Índice agrupado en partes
- **WHEN** se carga `/manual/`
- **THEN** el índice agrupa las entradas bajo un encabezado por parte, en el orden de los grupos del sidebar, y cada entrada muestra su número o letra

### Requirement: Contenido incorporado del manual previo
Las guías SHALL incluir las secciones que solo existían en el manual previo del autor, adaptadas a la versión de OpenSpec del sitio y al dominio neutro de ejemplo: «Qué revisar en cada punto de control» (tabla con momento, revisor y foco) en `/guias/flujo-opsx/` y «Antes de abrir la PR» (checklist) en `/equipo/adopcion/`.

#### Scenario: Tabla de revisión por punto de control
- **WHEN** se carga `/guias/flujo-opsx/`
- **THEN** existe un encabezado «Qué revisar en cada punto de control» seguido de una tabla con las columnas Momento, Revisor y Foco

#### Scenario: Checklist antes de abrir la PR
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** existe un encabezado «Antes de abrir la PR» seguido de una lista de comprobación
