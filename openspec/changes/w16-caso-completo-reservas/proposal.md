Fuera de roadmap: revisión externa de la web; la mejora prioritaria es un caso práctico de principio a fin con los artefactos reales que genera OpenSpec.

# Proposal

## Why

`/empieza/primer-cambio/` recorre el ciclo completo sobre la gestión de reservas, pero solo muestra comandos y comprobaciones («Deberías ver…»). El lector nunca ve el contenido de un `proposal.md`, una delta spec, un `design.md` o un `tasks.md` reales, y por eso no sabe juzgar si lo que le ha generado su agente es bueno. Además, el ciclo de vida y la anatomía de un change se explican solo con texto y árboles de ficheros, sin una vista de conjunto.

## What Changes

- El tutorial `/empieza/primer-cambio/` incorpora, en cada paso, el artefacto real que produjo una ejecución de OpenSpec 1.14 sobre el mismo requisito de cancelación de reservas: `proposal.md`, `specs/reservas/spec.md`, `design.md`, `tasks.md` y, tras archivar, la spec principal `openspec/specs/reservas/spec.md`.
- Cada artefacto se muestra en un bloque de código copiable cuyo título es la ruta del fichero, seguido de una nota breve «Qué mirar» y de un enlace a la página de concepto relacionada.
- La página indica de dónde salen los artefactos (versión de OpenSpec, agente y fecha de captura) y advierte de que la salida del lector será distinta, aunque equivalente en estructura.
- Los artefactos capturados se versionan en el repositorio como una instantánea de un proyecto de ejemplo. La página los incluye desde esos ficheros, sin copiarlos a mano, y un test comprueba que la instantánea pasa `openspec validate --strict`.
- Dos infografías nuevas con el sistema visual de w15:
  - **01 · Ciclo de vida de OpenSpec**: etapas desde explorar hasta archivar, con la entrada, la salida y el criterio de «hecho» de cada una.
  - **02 · Anatomía de un change**: estructura de carpetas y ficheros, función de cada artefacto y la cadena requisito → escenario → tarea → test.
- Ambas infografías tienen una alternativa textual equivalente, funcionan en modo claro y oscuro, y en el manual imprimible no se parten entre páginas.
- No añade JavaScript de cliente, terceros ni almacenamiento en el navegador. No hay impacto LSSI-CE/RGPD.

## Capabilities

### New Capabilities

Ninguna. Todo encaja en el dominio permitido `contenido`.

### Modified Capabilities

- `contenido`: se añaden requisitos para el caso completo con artefactos reales en `/empieza/primer-cambio/`, para la instantánea versionada y validada de esos artefactos, y para las dos infografías nuevas (contenido, alternativa textual e impresión).

## Fuera de alcance

- Una página o sección nueva en el sidebar. El caso vive dentro de `/empieza/primer-cambio/`, así que no cambian el orden de Empieza ni la cadena «Siguiente paso».
- Las infografías 03 (equipo con Azure DevOps), 04 (antes y después con IA) y 05 (checklist de adopción), que ya cubren `/equipo/azure-devops/` y `/equipo/adopcion/`.
- Indicador de progreso, búsqueda agrupada, analítica de eventos y otras sugerencias de la revisión que se descartaron.
- Implementar la cancelación de reservas como código ejecutable dentro del sitio. Solo se muestran los artefactos de OpenSpec y, si procede, un extracto del código generado.
- Cambios en la infografía de w15.

## Impact

- `src/content/docs/empieza/primer-cambio.mdx`: crece el contenido. Se mantiene `duration` dentro de 1–30 minutos, como exige la spec actual.
- Nueva instantánea del proyecto de ejemplo (ruta en `design.md`), que queda fuera de `openspec/` en la raíz para no mezclarse con los changes del propio sitio.
- Componentes Astro nuevos para las dos infografías, que reutilizan los tokens y estilos de la infografía de w15.
- `/manual/` y `/manual-openspec.pdf` incluirán automáticamente el contenido ampliado, porque el manual se construye a partir de las páginas del sidebar.
- Tests: unitarios para la instantánea (validación estricta y versión) y E2E y de accesibilidad para la página y las infografías.
- Sin dependencias nuevas.

## Preguntas abiertas

- ¿Quién captura los artefactos reales? Se propone que lo haga el autor (o el agente de apply en una sesión aparte) con Claude Code y OpenSpec 1.14 en un repositorio temporal, siguiendo el procedimiento descrito en `design.md`. Hay que confirmar qué agente se cita como fuente.
- ¿Las infografías deben reutilizarse también en `/empieza/conceptos/` (anatomía) y `/guias/flujo-opsx/` (ciclo de vida)? Esta propuesta las coloca solo en el tutorial; reutilizarlas sería un change posterior.
- Supuesto registrado en `design.md` (D7): se mantiene `duration: 30` porque los artefactos se presentan como referencia para comparar, no como pasos nuevos. Si en la revisión se considera que la lectura supera los 30 minutos, habrá que modificar el requisito «Duración del tutorial Tu primer cambio».
