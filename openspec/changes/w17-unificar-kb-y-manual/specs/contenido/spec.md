# Spec Delta

## MODIFIED Requirements

### Requirement: Páginas de Con tu agente y En equipo con contenido
Las páginas `/agentes/claude-code/`, `/agentes/otros/`, `/agentes/skills/`, `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/`, `/equipo/gobierno/` y `/equipo/adopcion/` SHALL publicar contenido propio y SHALL NOT contener el texto "Página en preparación".

#### Scenario: Agentes y equipo sin marcadores de preparación
- **WHEN** se carga cada una de las ocho páginas de Con tu agente y En equipo
- **THEN** ninguna contiene el texto "Página en preparación"

### Requirement: Orden de Con tu agente y En equipo en el sidebar
El grupo Con tu agente SHALL listar Claude Code, Otros agentes y Skills complementarias, en ese orden. El grupo En equipo SHALL listar Integración con Jira, Integración con Azure DevOps, Pipeline y validación en CI, Gobierno del cambio y Plan de adopción y riesgos, en ese orden.

#### Scenario: Orden de las páginas de Con tu agente
- **WHEN** se carga `/agentes/claude-code/`
- **THEN** los enlaces del grupo Con tu agente apuntan, en orden, a `/agentes/claude-code/`, `/agentes/otros/` y `/agentes/skills/`

#### Scenario: Orden de las páginas de En equipo
- **WHEN** se carga `/equipo/jira/`
- **THEN** los enlaces del grupo En equipo apuntan, en orden, a `/equipo/jira/`, `/equipo/azure-devops/`, `/equipo/ci/`, `/equipo/gobierno/` y `/equipo/adopcion/`

### Requirement: Enlace "Siguiente paso" en Con tu agente y En equipo
Cada una de las ocho páginas SHALL terminar con un enlace "Siguiente paso" hacia la página siguiente: claude-code → otros → skills → jira → azure-devops → ci → gobierno → adopcion → `/referencia/comandos-chat/`. El destino SHALL existir en el sitio construido.

#### Scenario: Cadena de Siguiente paso en agentes y equipo
- **WHEN** se carga cada página de Con tu agente y En equipo
- **THEN** contiene un enlace "Siguiente paso" cuyo `href` es la página siguiente de la cadena

#### Scenario: Adopción enlaza a comandos de chat
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** su enlace "Siguiente paso" apunta a `/referencia/comandos-chat/` y ese destino responde HTTP 200

#### Scenario: Skills enlaza a Jira
- **WHEN** se carga `/agentes/skills/`
- **THEN** su enlace "Siguiente paso" apunta a `/equipo/jira/`, primera página del grupo En equipo

## ADDED Requirements

### Requirement: Página Gobierno del cambio
La página `/equipo/gobierno/` SHALL incluir:
- una tabla del espectro de autoridad de la spec con una fila por cada modelo ("spec-first", "spec-anchored" y "spec-as-source");
- una sección «Lo que OpenSpec deja fuera» con una tabla de columnas Carencia y Cómo cubrirla;
- una sección «Detección temprana frente a verja».

Cada término de gobierno que mencione SHALL enlazar al menos una vez a su ancla en `/referencia/glosario/`.

#### Scenario: Espectro de autoridad
- **WHEN** se carga `/equipo/gobierno/`
- **THEN** existe una tabla con una fila por cada modelo: "spec-first", "spec-anchored" y "spec-as-source"

#### Scenario: Carencias de OpenSpec con su cobertura
- **WHEN** se carga `/equipo/gobierno/`
- **THEN** existe un encabezado «Lo que OpenSpec deja fuera» seguido de una tabla con las columnas Carencia y Cómo cubrirla y al menos una fila

#### Scenario: Verja diferenciada del hook
- **WHEN** se carga `/equipo/gobierno/`
- **THEN** existe un encabezado «Detección temprana frente a verja»

#### Scenario: Términos enlazados al glosario
- **WHEN** se carga `/equipo/gobierno/`
- **THEN** hay enlaces a `/referencia/glosario/#spec-anchored` y a `/referencia/glosario/#verja`, y los dos `id` existen en el glosario

### Requirement: Página Skills complementarias
La página `/agentes/skills/` SHALL incluir:
- una tabla de mapeo con las columnas Fase, Skill y Veredicto, donde cada valor de Veredicto es uno de «Adoptar», «Probar», «Inspirarse», «Opcional» o «No usar»;
- un aviso destacado (componente Aside) cuyo texto mencione "cadena de suministro";
- la fecha en que se contrastó el catálogo de skills.

La página SHALL NOT recomendar el uso de comandos que solapen con `/opsx:propose` o con `tasks.md` sin marcarlos como «No usar».

#### Scenario: Tabla de mapeo con veredicto
- **WHEN** se carga `/agentes/skills/`
- **THEN** existe una tabla con las columnas Fase, Skill y Veredicto, y cada celda de Veredicto contiene uno de los valores permitidos

#### Scenario: Valor de veredicto no permitido
- **WHEN** una fila de la tabla de mapeo tiene un veredicto fuera de la lista permitida
- **THEN** el test de contenido falla e indica la skill y el valor recibido

#### Scenario: Aviso de cadena de suministro
- **WHEN** se carga `/agentes/skills/`
- **THEN** la página contiene un aviso destacado que incluye el texto "cadena de suministro"

#### Scenario: Skills solapadas marcadas como No usar
- **WHEN** se carga `/agentes/skills/`
- **THEN** las filas de `to-spec` y `to-tickets` tienen el veredicto «No usar»

### Requirement: Términos de gobierno en el glosario
`/referencia/glosario/` SHALL incluir los términos «Spec-first», «Spec-anchored», «Spec-as-source», «Verja», «Trinquete» y «Cierre calculado», cada uno con ancla estable según la regla de «Anclas estables en el glosario».

#### Scenario: Anclas de gobierno
- **WHEN** se carga `/referencia/glosario/`
- **THEN** existen encabezados con los `id` `spec-first`, `spec-anchored`, `spec-as-source`, `verja`, `trinquete` y `cierre-calculado`

### Requirement: Recursos complementarios
La colección `resources` SHALL incluir las entradas `mattpocock-skills` (repositorio de skills de Matt Pocock, en inglés) y `roberto-canales-libro-sdd` (documento «Desarrollo de Software Basado en Especificaciones», en español), y ambas SHALL aparecer en `/recursos/`.

#### Scenario: Recursos complementarios listados
- **WHEN** se carga `/recursos/`
- **THEN** el listado contiene un enlace a `https://github.com/mattpocock/skills` y otro a `https://robertocanales.com/proyectos/libro-sdd`

#### Scenario: Recurso en español marcado
- **WHEN** se carga `/recursos/`
- **THEN** la entrada `roberto-canales-libro-sdd` indica el idioma español

### Requirement: Contenido incorporado de la base de conocimiento
`/equipo/adopcion/` SHALL incluir, en su Definition of Done, un elemento que exija ver en rojo los tests de los escenarios antes de implementar. En «Riesgos y mitigaciones» SHALL incluir filas para tres riesgos: «Válido» confundido con «correcto», el agente que ajusta los tests para que pasen y las skills de terceros que se actualizan solas. `/referencia/faq/` SHALL incluir las preguntas «Si `openspec validate` pasa, ¿la spec es correcta?» y «¿El hook `Stop` sustituye a la pipeline?», y cada respuesta SHALL enlazar a `/equipo/gobierno/`.

#### Scenario: Tests en rojo en la DoD
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** la lista bajo «Definition of Done» contiene un elemento que menciona los tests en rojo antes de implementar

#### Scenario: Riesgos nuevos en adopción
- **WHEN** se carga `/equipo/adopcion/`
- **THEN** la tabla de riesgos contiene filas sobre «válido» frente a «correcto», el ajuste de tests por el agente y la actualización automática de skills

#### Scenario: Preguntas de gobierno en la FAQ
- **WHEN** se carga `/referencia/faq/`
- **THEN** existen las dos preguntas de gobierno como encabezados, y cada respuesta contiene un enlace a `/equipo/gobierno/`

### Requirement: Colofón del manual
`/manual/` SHALL terminar con una sección «Colofón», posterior al último anexo, que muestre:
- la versión de OpenSpec de referencia y el mes de revisión, con los mismos valores que la portada;
- la URL absoluta de la edición en línea;
- una lista de fuentes principales con un enlace por fuente.

La sección SHALL NOT llevar etiqueta de capítulo ni de anexo, y SHALL NOT aparecer en el índice como parte numerada.

#### Scenario: Colofón al final del manual
- **WHEN** se carga `/manual/`
- **THEN** la última sección tiene el encabezado «Colofón» y va después de la sección del último anexo

#### Scenario: Ficha de edición coherente con la portada
- **WHEN** se carga `/manual/`
- **THEN** la versión de OpenSpec y el mes de revisión del colofón coinciden con los de la portada

#### Scenario: Edición en línea y fuentes
- **WHEN** se carga `/manual/`
- **THEN** el colofón contiene un enlace absoluto a la URL del sitio y al menos tres enlaces a fuentes externas con esquema https

#### Scenario: Colofón sin numerar
- **WHEN** se carga `/manual/`
- **THEN** la sección «Colofón» no lleva etiqueta «Capítulo» ni «Anexo», y ninguna entrada numerada del índice apunta a ella
