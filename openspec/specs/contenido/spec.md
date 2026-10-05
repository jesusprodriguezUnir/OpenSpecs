# contenido Specification

## Purpose
Define los metadatos que deben declarar las guías del sitio, cómo se muestran al lector y cuándo se le avisa de que el contenido puede estar desactualizado.

## Requirements

### Requirement: Metadatos obligatorios en guías
El build SHALL fallar si una página bajo `/empieza/`, `/guias/`, `/agentes/` o `/equipo/` no declara en su frontmatter `openspecVersion`, `lastReviewed`, `level` y `description`. `duration` SHALL ser opcional.

#### Scenario: Guía sin openspecVersion
- **WHEN** una página bajo `/guias/` omite `openspecVersion` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin lastReviewed
- **WHEN** una página bajo `/empieza/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin level
- **WHEN** una página bajo `/agentes/` omite `level` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Guía sin description
- **WHEN** una página bajo `/guias/` omite `description` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo `description`

#### Scenario: Guía sin duration
- **WHEN** una página bajo `/equipo/` declara `openspecVersion`, `lastReviewed`, `level` y `description` pero no `duration`
- **THEN** el build termina correctamente

### Requirement: Metadatos obligatorios en referencia
El build SHALL fallar si una página bajo `/referencia/` no declara `openspecVersion`, `lastReviewed` y `description`. `level` y `duration` SHALL ser opcionales.

#### Scenario: Referencia sin lastReviewed
- **WHEN** una página bajo `/referencia/` omite `lastReviewed` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo ausente

#### Scenario: Referencia sin description
- **WHEN** una página bajo `/referencia/` omite `description` y se ejecuta el build
- **THEN** el build termina con error y el mensaje identifica la página y el campo `description`

#### Scenario: Referencia sin level
- **WHEN** una página bajo `/referencia/` declara `openspecVersion`, `lastReviewed` y `description` pero no `level`
- **THEN** el build termina correctamente

### Requirement: Páginas fuera de las secciones de guía
Las páginas que no están bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` ni `/referencia/` (landing, 404, `/recursos/`, `/como-se-hizo/`) SHALL construirse sin declarar los metadatos de guía.

#### Scenario: Landing sin metadatos
- **WHEN** la landing `/` no declara `openspecVersion`, `lastReviewed`, `level` ni `duration`
- **THEN** el build termina correctamente

### Requirement: Valores de metadatos válidos
El build SHALL fallar si `openspecVersion` no tiene formato `X.Y` o `X.Y.Z`, si `level` no es `inicio`, `intermedio` o `avanzado`, si `lastReviewed` no es una fecha válida o si `duration` no es un entero positivo (minutos).

#### Scenario: Nivel no permitido
- **WHEN** una guía declara `level: experto`
- **THEN** el build termina con error que identifica el campo `level`

#### Scenario: Versión con formato inválido
- **WHEN** una guía declara `openspecVersion: "v1"`
- **THEN** el build termina con error que identifica el campo `openspecVersion`

### Requirement: Cabecera de metadatos
Cada página bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/` SHALL mostrar, junto al título, una cabecera con el nivel (si existe), la duración estimada en minutos (si existe), la versión de OpenSpec y la fecha de revisión en formato es-ES. Las páginas fuera de esas secciones SHALL NOT mostrarla.

#### Scenario: Cabecera completa en una guía
- **WHEN** el lector abre una guía con `level`, `duration`, `openspecVersion` y `lastReviewed`
- **THEN** la cabecera muestra el nivel, la duración en minutos, la versión de OpenSpec y la fecha de revisión

#### Scenario: Guía sin duración
- **WHEN** el lector abre una guía sin `duration`
- **THEN** la cabecera muestra nivel, versión y fecha, y no muestra ninguna duración

#### Scenario: Página fuera de guías sin cabecera
- **WHEN** el lector abre `/recursos/`
- **THEN** la página no muestra la cabecera de metadatos

### Requirement: Aviso de contenido desactualizado
Una página con `lastReviewed` anterior en más de 180 días a la fecha del build SHALL mostrar el aviso "contenido posiblemente desactualizado". Con 180 días o menos SHALL NOT mostrarlo.

#### Scenario: Página revisada hace más de 180 días
- **WHEN** una guía tiene `lastReviewed` 181 días anterior a la fecha del build
- **THEN** la página muestra el aviso "contenido posiblemente desactualizado"

#### Scenario: Página revisada hace exactamente 180 días
- **WHEN** una guía tiene `lastReviewed` 180 días anterior a la fecha del build
- **THEN** la página no muestra el aviso

#### Scenario: Página revisada recientemente
- **WHEN** una guía tiene `lastReviewed` igual a la fecha del build
- **THEN** la página no muestra el aviso

### Requirement: Páginas de Empieza con contenido
Las páginas `/empieza/que-es/`, `/empieza/conceptos/`, `/empieza/instalacion/` y `/empieza/primer-cambio/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Empieza sin marcadores de preparación
- **WHEN** se carga cada una de las cuatro páginas de Empieza
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Empieza en el sidebar
El grupo Empieza del sidebar SHALL listar sus páginas en este orden: ¿Qué es OpenSpec?, Conceptos, Instalación, Tu primer cambio.

#### Scenario: Orden de las páginas de Empieza
- **WHEN** se carga `/empieza/que-es/`
- **THEN** los enlaces del grupo Empieza apuntan, en orden, a `/empieza/que-es/`, `/empieza/conceptos/`, `/empieza/instalacion/` y `/empieza/primer-cambio/`

### Requirement: Enlace "Siguiente paso" en Empieza
Cada página de Empieza SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente del recorrido Inicio: qué es → conceptos → instalación → primer cambio → `/guias/formato-de-specs/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso
- **WHEN** se carga cada página de Empieza
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente del recorrido Inicio

#### Scenario: Primer cambio enlaza a Escribir specs
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** su enlace "Siguiente paso" apunta a `/guias/formato-de-specs/` y ese destino responde HTTP 200

### Requirement: Comandos con variantes PowerShell y bash
Las páginas `/empieza/instalacion/` y `/empieza/primer-cambio/` SHALL mostrar sus comandos de terminal en pestañas sincronizadas con las variantes "PowerShell" y "bash".

#### Scenario: Pestañas de shell en instalación
- **WHEN** se carga `/empieza/instalacion/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"

#### Scenario: Pestañas sincronizadas
- **WHEN** el lector selecciona "bash" en un grupo de pestañas de `/empieza/primer-cambio/`
- **THEN** todos los grupos de pestañas de shell de la página muestran la variante "bash"

### Requirement: Duración del tutorial Tu primer cambio
La página `/empieza/primer-cambio/` SHALL declarar `duration` con un valor entre 1 y 30 minutos, y la cabecera de metadatos SHALL mostrarlo.

#### Scenario: Duración declarada del tutorial
- **WHEN** se carga `/empieza/primer-cambio/`
- **THEN** la cabecera de metadatos muestra una duración de 30 minutos o menos

### Requirement: Páginas de Guías con contenido
Las páginas `/guias/formato-de-specs/`, `/guias/flujo-opsx/`, `/guias/recetas/`, `/guias/brownfield/` y `/guias/configuracion/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Guías sin marcadores de preparación
- **WHEN** se carga cada una de las cinco páginas de Guías
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Guías en el sidebar
El grupo Guías del sidebar SHALL listar sus páginas en este orden: Escribir specs, Flujo /opsx, Recetas, Proyectos existentes (brownfield), config.yaml y schemas personalizados.

#### Scenario: Orden de las páginas de Guías
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** los enlaces del grupo Guías apuntan, en orden, a `/guias/formato-de-specs/`, `/guias/flujo-opsx/`, `/guias/recetas/`, `/guias/brownfield/` y `/guias/configuracion/`

### Requirement: Enlace "Siguiente paso" en Guías
Cada página de Guías SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente: formato-de-specs → flujo-opsx → recetas → brownfield → configuracion → `/agentes/claude-code/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso en Guías
- **WHEN** se carga cada página de Guías
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente de la cadena

#### Scenario: Configuración enlaza a Claude Code
- **WHEN** se carga `/guias/configuracion/`
- **THEN** su enlace "Siguiente paso" apunta a `/agentes/claude-code/` y ese destino responde HTTP 200

### Requirement: Deltas con marcadores de diff
La página `/guias/formato-de-specs/` SHALL mostrar los ejemplos de delta specs en bloques de código cuyas líneas añadidas y eliminadas están marcadas visual y semánticamente como insertadas y eliminadas.

#### Scenario: Bloque con líneas insertadas
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** la página contiene al menos un bloque de código con una línea marcada como insertada

#### Scenario: Bloque con líneas eliminadas
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** la página contiene al menos un bloque de código con una línea marcada como eliminada

### Requirement: Comandos de Guías con variantes PowerShell y bash
Las páginas `/guias/recetas/` y `/guias/configuracion/` SHALL mostrar sus comandos de terminal en pestañas sincronizadas con las variantes "PowerShell" y "bash".

#### Scenario: Pestañas de shell en recetas
- **WHEN** se carga `/guias/recetas/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"

#### Scenario: Pestañas de shell en configuración
- **WHEN** se carga `/guias/configuracion/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "PowerShell" y "bash"

### Requirement: Páginas de Con tu agente y En equipo con contenido
Las páginas `/agentes/claude-code/`, `/agentes/otros/`, `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` y `/equipo/adopcion/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Agentes y equipo sin marcadores de preparación
- **WHEN** se carga cada una de las seis páginas de Con tu agente y En equipo
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Con tu agente y En equipo en el sidebar
El grupo Con tu agente SHALL listar Claude Code y Otros agentes, en ese orden. El grupo En equipo SHALL listar Integración con Jira, Integración con Azure DevOps, Pipeline y validación en CI y Plan de adopción y riesgos, en ese orden.

#### Scenario: Orden de las páginas de Con tu agente
- **WHEN** se carga `/agentes/claude-code/`
- **THEN** los enlaces del grupo Con tu agente apuntan, en orden, a `/agentes/claude-code/` y `/agentes/otros/`

#### Scenario: Orden de las páginas de En equipo
- **WHEN** se carga `/equipo/jira/`
- **THEN** los enlaces del grupo En equipo apuntan, en orden, a `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/` y `/equipo/adopcion/`

### Requirement: Enlace "Siguiente paso" en Con tu agente y En equipo
Cada una de las seis páginas SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente: claude-code → otros → jira → azure-devops → ci → adopcion → `/referencia/comandos-chat/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso en agentes y equipo
- **WHEN** se carga cada página de Con tu agente y En equipo
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente de la cadena

#### Scenario: Adopción enlaza a comandos de chat
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** su enlace "Siguiente paso" apunta a `/referencia/comandos-chat/` y ese destino responde HTTP 200

### Requirement: Avisos de RGPD
Las páginas `/equipo/jira/`, `/equipo/azure-devops/` y `/equipo/adopcion/` SHALL incluir al menos un aviso destacado (componente Aside) cuyo texto mencione "RGPD".

#### Scenario: Aviso de RGPD en las páginas de equipo
- **WHEN** se carga cada una de `/equipo/jira/`, `/equipo/azure-devops/` y `/equipo/adopcion/`
- **THEN** la página contiene al menos un aviso destacado que incluye el texto "RGPD"

### Requirement: Plantillas enlazadas, no duplicadas
La página `/agentes/claude-code/` SHALL enlazar a `/referencia/plantillas/` para las plantillas completas y SHALL NOT reproducir íntegras las plantillas de `CLAUDE.md`, `/ticket-propose` ni `spec-verifier`.

#### Scenario: Claude Code enlaza a plantillas
- **WHEN** se carga `/agentes/claude-code/`
- **THEN** la página contiene al menos un enlace cuyo `href` es `/referencia/plantillas/`

### Requirement: Validación en CI con variantes de plataforma
La página `/equipo/ci/` SHALL mostrar la validación de specs en pestañas sincronizadas con las variantes "Azure Pipelines" y "GitHub Actions", y SHALL fijar una versión concreta de OpenSpec (no `@latest`).

#### Scenario: Pestañas de plataforma en CI
- **WHEN** se carga `/equipo/ci/`
- **THEN** la página contiene al menos un grupo de pestañas con las etiquetas "Azure Pipelines" y "GitHub Actions"

#### Scenario: Versión de OpenSpec fijada en CI
- **WHEN** se carga `/equipo/ci/`
- **THEN** los bloques de código instalan `@fission-ai/openspec@` seguido de un número de versión y ninguno usa `@latest`

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

### Requirement: Longitud de description
En las páginas bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/`, el build SHALL fallar si `description` tiene menos de 50 o más de 160 caracteres. Las páginas fuera de esas secciones SHALL construirse con cualquier `description` o sin ella.

#### Scenario: Description demasiado corta
- **WHEN** una guía declara una `description` de 49 caracteres
- **THEN** la validación falla e identifica la página y el campo `description`

#### Scenario: Description demasiado larga
- **WHEN** una guía declara una `description` de 161 caracteres
- **THEN** la validación falla e identifica la página y el campo `description`

#### Scenario: Description en los límites
- **WHEN** una guía declara una `description` de 50 caracteres y otra de 160
- **THEN** ambas pasan la validación

#### Scenario: Description libre fuera de guías
- **WHEN** una página de `/recursos/` declara una `description` de 20 caracteres
- **THEN** la validación no reporta ningún problema

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
