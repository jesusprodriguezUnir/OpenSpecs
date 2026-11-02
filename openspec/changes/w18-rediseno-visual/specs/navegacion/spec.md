## ADDED Requirements

### Requirement: Grupos del sidebar numerados
Los cinco primeros grupos del sidebar (Empieza, Guías, Con tu agente, En equipo y Referencia) SHALL mostrar un prefijo numérico visual de dos cifras según su posición («01» a «05»). Los grupos Recursos y Cómo se hizo MUST NOT llevar número. El prefijo SHALL estar oculto a tecnologías de apoyo y las etiquetas de texto de los grupos MUST NOT cambiar.

#### Scenario: Prefijos en orden
- **WHEN** se abre una página de guía con viewport de escritorio
- **THEN** los cinco primeros grupos del sidebar muestran visualmente «01», «02», «03», «04» y «05» en ese orden

#### Scenario: Grupos sin número
- **WHEN** se inspeccionan los grupos Recursos y Cómo se hizo del sidebar
- **THEN** no muestran prefijo numérico

#### Scenario: Prefijo fuera del nombre accesible
- **WHEN** se lee el nombre accesible de cada grupo del sidebar
- **THEN** coincide con su etiqueta de texto sin el prefijo numérico

### Requirement: Banner de progreso en el grupo
Cada página que pertenezca a un grupo del sidebar con al menos dos páginas SHALL mostrar, junto al título, un banner con el nombre del grupo y el texto «paso N de M», donde N es la posición de la página en el grupo según el orden del sidebar y M el número de páginas del grupo. La barra de progreso del banner SHALL ser decorativa y estar oculta a tecnologías de apoyo. La landing, `/recursos/`, `/como-se-hizo/` y la 404 MUST NOT mostrar el banner.

#### Scenario: Primera página de Empieza
- **WHEN** se abre `/empieza/que-es/`
- **THEN** el banner incluye «Empieza» y «paso 1 de 4»

#### Scenario: Posición según el orden del sidebar
- **WHEN** se abre cualquier página de un grupo con al menos dos páginas
- **THEN** el N y el M del banner coinciden con la posición de su enlace en el grupo del sidebar y con el número de enlaces de ese grupo

#### Scenario: Barra decorativa oculta
- **WHEN** se inspecciona la barra de progreso del banner
- **THEN** está dentro de un elemento con `aria-hidden="true"`

#### Scenario: Páginas sin banner
- **WHEN** se abren `/`, `/recursos/`, `/como-se-hizo/` y una ruta inexistente
- **THEN** ninguna muestra el banner de progreso
