Fuera de roadmap: observación del spec-verifier sobre w13-rediseno-landing (incoherencia entre design.md D2 y la implementación).

## Why

En w13 el `design.md` (D2) fija que las animaciones de la terminal se reproducen una sola vez para no distraer ni gastar CPU, pero el cursor de la terminal parpadea en bucle infinito (`animation: blink 1s steps(1) infinite`). El spec se cumple con movimiento reducido, pero diseño y código se contradicen.

## What Changes

- El cursor de la terminal parpadea un número finito de veces (5 ciclos, ~5 s, lo que dura la aparición de las líneas) y queda visible y fijo.
- Nuevo requisito en `landing`: ninguna animación de la terminal ni del ciclo es infinita.

## Capabilities

### New Capabilities
<!-- ninguna -->

### Modified Capabilities
- `landing`: añade el requisito "Animaciones finitas".

## Impact

- **JavaScript de cliente**: ninguno. **Terceros**: ninguno. **Almacenamiento en el navegador**: sin cambios.
- **Ficheros**: `src/components/overrides/Hero.astro` (CSS del cursor), `tests/e2e/landing.spec.ts`.

## Fuera de alcance

- Archivar `w13-rediseno-landing` (se hace aparte cuando se cierre su tarea 4.4).
- Cualquier otro cambio visual de la landing.

## Preguntas abiertas

- Ninguna.
