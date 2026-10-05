## ADDED Requirements

### Requirement: Animaciones finitas
Las animaciones de la terminal y de la franja del ciclo de `/` MUST NOT repetirse indefinidamente: cada una SHALL tener un número finito de iteraciones. Al terminar, el cursor de la terminal SHALL quedar visible.

#### Scenario: Ninguna animación infinita en la landing
- **WHEN** se abre `/` sin preferencia de movimiento reducido
- **THEN** ninguna animación de la terminal ni del ciclo tiene un número de iteraciones infinito

#### Scenario: Cursor visible al terminar
- **WHEN** han terminado todas las animaciones de la terminal
- **THEN** el cursor de la terminal tiene opacidad 1
