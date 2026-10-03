# calidad Specification

## Purpose
Define qué hace fallar la puerta de calidad del repositorio, tanto en local como en la integración continua, para que ninguna regresión de specs, tipos, contenido, enlaces o accesibilidad llegue a `main`.

## Requirements

### Requirement: Scripts de la puerta de calidad
El repositorio SHALL exponer los scripts npm `check`, `test:unit`, `test:e2e`, `test` y `links`, y cada uno MUST terminar con código de salida distinto de cero cuando su comprobación falla.

#### Scenario: Scripts de calidad disponibles
- **WHEN** se listan los scripts de `package.json`
- **THEN** existen `check`, `test:unit`, `test:e2e`, `test` y `links`

#### Scenario: El script test encadena unitarios y E2E
- **WHEN** se ejecuta `npm run test`
- **THEN** se ejecutan primero los tests unitarios y después los E2E, y el comando falla si falla cualquiera de los dos

### Requirement: Validación de specs en CI
La CI SHALL ejecutar `openspec validate --all --strict --no-interactive` con OpenSpec fijado a la versión 1.14.0 y MUST fallar si alguna spec o change es inválido.

#### Scenario: Un PR con specs inválidas falla el job openspec
- **WHEN** un PR introduce una spec con un Requirement sin Scenario
- **THEN** el job `openspec` termina en rojo y el PR no pasa la puerta de calidad

#### Scenario: Versión de OpenSpec fijada
- **WHEN** se inspecciona el workflow de CI
- **THEN** OpenSpec se instala en la versión exacta 1.14.0, sin rangos ni `latest`

### Requirement: Tipos y contenido validados en CI
La CI SHALL ejecutar la comprobación de tipos y de esquema de contenido (`astro check`) y el build de producción, y MUST fallar si cualquiera de los dos falla.

#### Scenario: Un error de tipos falla la CI
- **WHEN** un PR introduce un error de TypeScript en el código del sitio
- **THEN** el job `build` termina en rojo en el paso de comprobación de tipos

#### Scenario: Frontmatter inválido falla la CI
- **WHEN** un PR añade una página de contenido con un campo de frontmatter que incumple el esquema de la colección
- **THEN** el job `build` termina en rojo

### Requirement: Enlaces internos rotos bloquean la CI
La CI SHALL comprobar sobre `dist/` que todos los enlaces internos, incluidos los fragmentos (`#ancla`), resuelven a un fichero o ancla existente, y MUST fallar si encuentra alguno roto. Los enlaces externos MUST NOT bloquear la puerta.

#### Scenario: Un enlace interno roto falla el job de enlaces
- **WHEN** una página enlaza a una ruta interna que no existe en `dist/`
- **THEN** el job `links` termina en rojo e informa de la página de origen y del destino roto

#### Scenario: Un fragmento inexistente falla el job de enlaces
- **WHEN** una página enlaza a una página existente con un `#ancla` que no está en ella
- **THEN** el job `links` termina en rojo

#### Scenario: Un enlace externo no bloquea
- **WHEN** una página contiene un enlace a un dominio externo inalcanzable
- **THEN** el job `links` no falla por ese enlace

### Requirement: Tests unitarios y E2E en CI
La CI SHALL ejecutar los tests unitarios y los E2E como jobs bloqueantes. Los E2E MUST ejecutarse contra el sitio construido y servido con `astro preview`, nunca contra el servidor de desarrollo.

#### Scenario: Los tests de Playwright usan astro preview
- **WHEN** se ejecuta `npm run test:e2e`
- **THEN** Playwright construye el sitio y lo sirve con `astro preview` antes de lanzar los tests

#### Scenario: Un test unitario en rojo falla la CI
- **WHEN** un PR rompe un test de Vitest
- **THEN** el job `unit` termina en rojo

#### Scenario: Un test E2E en rojo falla la CI
- **WHEN** un PR rompe un test de Playwright
- **THEN** el job `e2e` termina en rojo

### Requirement: Comprobación automática de accesibilidad
El conjunto E2E SHALL incluir una comprobación con axe sobre las plantillas principales existentes (portada, página de guía y 404), y MUST fallar si axe detecta violaciones de nivel `serious` o `critical`.

#### Scenario: Una página de guía sin violaciones graves de accesibilidad
- **WHEN** axe analiza `/empieza/que-es/`
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: La 404 sin violaciones graves de accesibilidad
- **WHEN** axe analiza una ruta inexistente
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: Una violación grave falla el test
- **WHEN** una página contiene una imagen sin texto alternativo
- **THEN** el test de accesibilidad de esa página falla

### Requirement: Jobs independientes y paralelos
Los jobs de la CI SHALL ser independientes entre sí salvo la dependencia de `links` sobre el build, de modo que un fallo en uno no oculte el resultado de los demás.

#### Scenario: Un fallo no oculta a los demás jobs
- **WHEN** el job `unit` falla en un PR
- **THEN** los jobs `openspec`, `build`, `e2e` y `links` se ejecutan igualmente y publican su propio resultado
