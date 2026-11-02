## MODIFIED Requirements

### Requirement: Comprobación automática de accesibilidad
El conjunto E2E SHALL incluir una comprobación con axe sobre las plantillas principales existentes (portada, página de guía y 404), y MUST fallar si axe detecta violaciones de nivel `serious` o `critical`. La página de guía SHALL analizarse en tema claro y en tema oscuro.

#### Scenario: Una página de guía sin violaciones graves de accesibilidad
- **WHEN** axe analiza `/empieza/que-es/`
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: Página de guía en tema claro sin violaciones graves
- **WHEN** axe analiza `/empieza/que-es/` con el tema claro activo
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: Página de guía en tema oscuro sin violaciones graves
- **WHEN** axe analiza `/empieza/que-es/` con el tema oscuro activo
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: La 404 sin violaciones graves de accesibilidad
- **WHEN** axe analiza una ruta inexistente
- **THEN** no hay violaciones de impacto `serious` ni `critical`

#### Scenario: Una violación grave falla el test
- **WHEN** una página contiene una imagen sin texto alternativo
- **THEN** el test de accesibilidad de esa página falla
