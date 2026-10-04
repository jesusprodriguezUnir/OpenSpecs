## ADDED Requirements

### Requirement: Términos del glosario localizables
La búsqueda del sitio SHALL devolver, al buscar el nombre de un término del glosario, un resultado que enlace a `/referencia/glosario/` con el ancla de ese término.

#### Scenario: Buscar delta spec
- **WHEN** el lector abre la búsqueda del sitio y escribe "delta spec"
- **THEN** aparece un resultado cuyo enlace es `/referencia/glosario/#delta-spec`

#### Scenario: Término sin coincidencias
- **WHEN** el lector busca un término que no existe en el sitio ("zzqxy")
- **THEN** la búsqueda indica que no hay resultados
