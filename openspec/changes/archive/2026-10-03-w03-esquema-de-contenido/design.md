# Design

## Context

`src/content.config.ts` usa `docsSchema()` sin extender. Las 24 páginas de `src/content/docs/` son placeholders `.md` con `title`, `description` y `sidebar.order`. No existe `src/components/`. Stack según ADR-0001 (`docs/proyecto/02-adr-0001-stack.md`): Astro 7 + Starlight, salida estática, cero JS de cliente.

## Goals / Non-Goals

**Goals:**
- Fallo de build (no solo de test) cuando falta un metadato obligatorio.
- Lógica de caducidad pura y testeable con Vitest, independiente de la fecha del sistema.

**Non-Goals:**
- Recalcular la caducidad en el navegador: el aviso refleja la fecha del build.

## Decisions

### D1 · Obligatoriedad con `superRefine` sobre el schema
Campos `optional()` en `docsSchema({ extend })` y un `superRefine` que exige los campos según la sección de la página, con mensaje que nombra página y campo. La regla sección → campos es una función pura `requiredFieldsFor(id)` en `src/lib/content-rules.ts`, testeada con Vitest.
- Riesgo a verificar en la primera tarea de apply: el `superRefine` del schema puede no recibir el `id`/ruta de la entrada. Si es así, la misma validación se aplica en un loader que envuelve `docsLoader()` y lanza el error tras cargar. Ambas variantes hacen fallar `npm run build`, que es lo que pide la spec.
- **Variante elegida (tarea 1.1): loader.** En Astro 7.3.5 el schema se evalúa con `schema.safeParseAsync(data)` sin `id` ni ruta (ver `astro/dist/content/utils.js`), así que el `superRefine` no puede saber la sección. `src/content.config.ts` envuelve `docsLoader()` e intercepta `context.parseData({ id, data })`: llama a `assertRequiredFields(id, data)` (de `src/lib/content-rules.ts`) antes de delegar en el parse normal. El error `[contenido] La página "<id>" no declara los campos obligatorios: <campos>` hace fallar `npm run build`. Los formatos (`level`, `openspecVersion`, `duration`, `lastReviewed`) los valida el schema extendido `guideMetadataSchema`, cuyo error de Astro ya nombra la entrada.
- Alternativa descartada: solo un test de contenido en Vitest. Fallaría `npm run test`, no el build.

### D2 · Override de `PageTitle`
La cabecera debe aparecer en todas las guías `.md` sin tocar cada página. Se sobrescribe `PageTitle` de Starlight (renderiza el título por defecto + cabecera + aviso), registrado en `astro.config.mjs`.
- Contradice la convención "overrides solo Head, Hero, Footer". Se amplía la convención en `CLAUDE.md` a `PageTitle`. No contradice el ADR-0001 (sigue estático, sin JS).
- Alternativa descartada: convertir las guías a `.mdx` e importar el componente en cada una; fricción editorial y riesgo de olvidar la cabecera.

### D3 · Caducidad calculada en build
`isStale(lastReviewed, now, thresholdDays = 180)` en `src/lib/staleness.ts`: `true` si la diferencia en días naturales (UTC) es > 180. `now` se inyecta (en build, `new Date()`); en tests E2E se fija mediante variable `BUILD_DATE` opcional para escenarios deterministas.
- Alternativa descartada: isla de cliente que compare con la fecha del lector; añade JS de cliente sin necesidad.

### D4 · Fecha y textos
Fecha formateada con `Intl.DateTimeFormat('es-ES', { dateStyle: 'long' })`. Nivel mostrado con mayúscula inicial. Duración como "N min". Aviso con `<Aside type="caution">`-equivalente (marcado de Starlight) y texto "Contenido posiblemente desactualizado".

### D5 · Fixtures para escenarios de error
Los escenarios de fallo de build se prueban en Vitest validando frontmatter sintético contra el mismo validador que usa el build, sin lanzar un build por escenario (coste de minutos). Los escenarios de cabecera se prueban con Playwright sobre `astro preview`. Los de aviso combinan Vitest sobre `isStale` (límites 180/181 días) y un E2E con `BUILD_DATE` fijado en el build de tests para ver el aviso renderizado.

## Risks / Trade-offs

- [El aviso depende de la fecha del build] → una página puede caducar sin que nadie lo vea hasta el siguiente despliegue. Aceptable: se redepliega en cada PR.
- [`BUILD_DATE` es una puerta de configuración extra] → solo afecta a tests; por defecto es la fecha real.
- [Override de `PageTitle` acoplado a la API interna de Starlight] → se fija la versión exacta y se renderiza el `PageTitle` por defecto dentro del override para minimizar divergencia.
