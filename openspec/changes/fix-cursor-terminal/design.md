## Context

`Hero.astro` anima el cursor con `blink 1s steps(1) infinite`, en contra de D2 de `w13-rediseno-landing` (animaciones de una sola pasada).

## Goals / Non-Goals

**Goals:** cursor con parpadeo finito que acaba visible. **Non-Goals:** rediseñar la terminal.

## Decisions

- `animation: blink 1s steps(1) 5`: 5 ciclos cubren la aparición de las 8 líneas (la última a ~3,8 s). Como `@keyframes blink` solo define `50% { opacity: 0 }` y no se usa `fill-mode: forwards`, al terminar el cursor vuelve a su opacidad base (1). *Alternativa descartada*: quitar el parpadeo — pierde la metáfora de terminal del diseño 1a.
- Sin dependencias ni overrides nuevos (ADR-0001 sin cambios).

## Risks / Trade-offs

- [El test depende de tiempos] → se usa `animation.finished` / `getComputedTiming().iterations`, no esperas fijas.
