# Spec Delta

## Purpose

Define cómo se orienta el lector en el sitio: las secciones del sidebar, sus rutas publicadas y la respuesta ante rutas que no existen.

## ADDED Requirements

### Requirement: Secciones del sidebar en orden
El sidebar de las páginas de guía SHALL mostrar, en este orden, los grupos: Empieza, Guías, Con tu agente, En equipo, Referencia, Recursos y Cómo se hizo.

#### Scenario: Orden de las secciones del sidebar
- **WHEN** se carga cualquier página de guía, por ejemplo `/empieza/que-es/`
- **THEN** el sidebar muestra los siete grupos en el orden indicado y ningún otro grupo de primer nivel

### Requirement: Páginas del mapa del sitio publicadas
Cada página del mapa del sitio v1 (salvo la landing y las páginas legales) SHALL existir en el build de producción en su slug definitivo y SHALL aparecer como enlace en el sidebar.

#### Scenario: Todas las rutas del mapa responden
- **WHEN** se solicita cada slug del mapa del sitio v1 (p. ej. `/empieza/instalacion/`, `/guias/recetas/`, `/como-se-hizo/`) al sitio construido
- **THEN** la respuesta es HTTP 200 con un `<h1>` no vacío

#### Scenario: Cada página del mapa está enlazada en el sidebar
- **WHEN** se carga una página de guía
- **THEN** el sidebar contiene un enlace a cada slug del mapa del sitio v1

#### Scenario: Página actual marcada en el sidebar
- **WHEN** se carga `/guias/flujo-opsx/`
- **THEN** su enlace en el sidebar tiene `aria-current="page"`

### Requirement: Página 404 propia
Una ruta inexistente SHALL responder con estado HTTP 404 y una página en español que ofrezca un enlace a la página de inicio y acceso a la búsqueda del sitio.

#### Scenario: Ruta inexistente devuelve la 404 propia
- **WHEN** se solicita `/esta-ruta-no-existe/`
- **THEN** la respuesta tiene estado 404 y el `<h1>` es el título propio de la 404 en español

#### Scenario: La 404 enlaza a inicio
- **WHEN** se carga la página 404
- **THEN** contiene un enlace con `href="/"`

#### Scenario: La 404 da acceso a la búsqueda
- **WHEN** se carga la página 404
- **THEN** contiene un control de búsqueda que, al activarse, abre el diálogo de búsqueda del sitio

### Requirement: Páginas de ejemplo de la plantilla eliminadas
El sitio construido MUST NOT publicar las páginas de ejemplo de la plantilla de Starlight.

#### Scenario: Ruta de ejemplo no publicada
- **WHEN** se solicita `/guides/example/`
- **THEN** la respuesta tiene estado 404
