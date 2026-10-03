# 04 · Formato de las specs

## Reglas básicas

- Las specs se organizan **por dominio funcional** (`specs/solicitudes/`, `specs/autenticacion/`, `specs/titulos/`), no por capas técnicas ni por proyecto de la solución.
- Cada **Requirement** declara un comportamiento con lenguaje normativo: **SHALL** / **MUST** (obligatorio).
- Cada requisito tiene uno o más **Scenario** en formato **Given / When / Then**.
- Las specs describen **comportamiento observable**, no implementación (nada de nombres de clases o tablas, salvo que sean parte del contrato).

## Spec principal (fuente de verdad)

`openspec/specs/solicitudes/spec.md`

```markdown
# Solicitudes

## Requirements

### Requirement: Alta de solicitud
The system SHALL allow an authenticated alumno to create a solicitud for an asignatura in which they are enrolled.

#### Scenario: Alta correcta
- GIVEN an authenticated alumno enrolled in asignatura X
- WHEN the alumno submits a solicitud for X
- THEN the API returns 201 Created with the solicitud id
- AND the solicitud is stored with estado "Pendiente"

#### Scenario: Alumno no matriculado
- GIVEN an authenticated alumno not enrolled in asignatura X
- WHEN the alumno submits a solicitud for X
- THEN the API returns 422 with code ALUMNO_NO_MATRICULADO
```

## Delta specs (dentro de un cambio)

`openspec/changes/proj-1234-rechazo-duplicados/specs/solicitudes/spec.md`

### ADDED — nuevo requisito

```markdown
## ADDED Requirements

### Requirement: Rechazo de solicitudes duplicadas
The system SHALL reject a new solicitud when an active solicitud exists for the same alumno and asignatura.

#### Scenario: Solicitud duplicada
- GIVEN an active solicitud for alumno A in asignatura X
- WHEN alumno A submits a new solicitud for X
- THEN the API returns 409 Conflict with code SOLICITUD_DUPLICADA

#### Scenario: Solicitud anterior cerrada
- GIVEN a closed solicitud for alumno A in asignatura X
- WHEN alumno A submits a new solicitud for X
- THEN the API returns 201 Created
```

### MODIFIED — cambio de comportamiento existente (típico de un bug)

```markdown
## MODIFIED Requirements

### Requirement: Alta de solicitud
The system SHALL allow an authenticated alumno to create a solicitud for an asignatura in which they are enrolled **in the current academic year**.

#### Scenario: Matrícula de un curso anterior
- GIVEN an alumno enrolled in asignatura X only in a previous academic year
- WHEN the alumno submits a solicitud for X
- THEN the API returns 422 with code ALUMNO_NO_MATRICULADO
```

### REMOVED — comportamiento que desaparece

```markdown
## REMOVED Requirements

### Requirement: Envío de solicitud por email
**Reason**: sustituido por el formulario web; el buzón se da de baja.
**Migration**: las solicitudes pendientes por email se migran manualmente antes del despliegue.
```

## Buenas prácticas

1. **Un escenario por regla de negocio y por caso de error.** Los errores también son comportamiento.
2. **Códigos de error estables** (`SOLICITUD_DUPLICADA`) en lugar de mensajes literales: el front (Angular) y los tests dependen de ellos.
3. **Criterios de aceptación → escenarios.** Cada criterio del ticket debe tener al menos un Scenario; si un criterio es ambiguo, se pregunta, no se inventa.
4. **Escenarios → tests.** Cada Scenario debe tener un test automatizado (xUnit para backend, Jest/Karma para Angular). El subagente verificador comprueba esta trazabilidad (ver fichero 07).
5. **Bugs como MODIFIED.** Describir el comportamiento correcto, no "arreglar X". Así el bug queda documentado como requisito y no vuelve.
6. **Refactors sin delta.** Si el comportamiento no cambia, no hay delta specs; se archiva con `--skip-specs`.
7. **Idioma.** Palabras normativas (SHALL/MUST, GIVEN/WHEN/THEN) en inglés para que el validador y el agente las reconozcan; términos de dominio en español si es el lenguaje del negocio. Mantener el criterio uniforme en todo el repo.
8. **No backfilling masivo.** No documentar todo el sistema de golpe: las specs crecen cambio a cambio.

## Checklist de revisión de una delta spec

- [ ] Cada requisito usa SHALL/MUST y describe comportamiento observable.
- [ ] Todos los criterios de aceptación del ticket están cubiertos por escenarios.
- [ ] Hay escenarios para los casos de error y los límites.
- [ ] Los MODIFIED reescriben el requisito completo, no solo la diferencia.
- [ ] Los REMOVED indican motivo y migración.
- [ ] No hay detalles de implementación que deberían ir en `design.md`.
- [ ] `openspec validate <cambio> --strict` pasa sin errores.
