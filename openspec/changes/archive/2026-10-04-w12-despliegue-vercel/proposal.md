Roadmap: 12 · docs/proyecto/04-roadmap-de-changes.md

# Proposal

## Why

El sitio aún no tiene un despliegue declarado: faltan cabeceras de seguridad, política de caché y previews por PR revisables. Desplegar pronto (orden recomendado 01 → 02 → 03 → 12) permite revisar cada change en un preview real de Vercel, como exige la Definition of Done.

## What Changes

- Nuevo `vercel.json` para el despliegue estático sin adapter (ADR-0001): build `npm run build`, salida `dist/`.
- Cabeceras de seguridad en todas las respuestas: `Content-Security-Policy` compatible con Starlight y Pagefind, `Strict-Transport-Security` (sin `preload`), `Referrer-Policy`, `X-Content-Type-Options` y `X-Frame-Options`.
- Caché inmutable de un año para `/_astro/*`; el HTML no se declara inmutable.
- Mecanismo de redirecciones en `vercel.json`: el conjunto inicial está vacío y cada regla futura debe ser permanente y apuntar a una ruta existente.
- Previews por PR mediante la integración Git de Vercel; producción en `*.vercel.app` con `SITE_URL` configurada.
- Tests: Vitest valida `vercel.json` (cabeceras, caché y redirecciones), y un smoke test Playwright opcional se ejecuta contra la URL de un preview (`PREVIEW_URL`) y se omite si la variable no está definida.

## Capabilities

### New Capabilities
- `despliegue`: cabeceras HTTP observables, política de caché, redirecciones y entornos (producción y preview por PR) del sitio desplegado.

### Modified Capabilities
<!-- Ninguna -->

## Impact

- Ficheros nuevos: `vercel.json`, `tests/unit/vercel-config.test.ts`, `tests/e2e/despliegue.spec.ts`.
- Configuración externa: proyecto de Vercel enlazado al repositorio y variable `SITE_URL` en producción.
- Sin JavaScript de cliente nuevo, sin terceros y sin almacenamiento en el navegador: no hay impacto LSSI-CE/RGPD.
- Sin dependencias npm nuevas.

## Fuera de alcance

- Dominio propio (p. ej. `openspec.es`), HSTS `preload` y el cambio de `site` y canónicas: irán en un change futuro `chore-dominio-propio`.
- Permisos de CSP para Vercel Web Analytics: los añade `w11-legal-y-analitica` en su propio delta.
- Reglas de redirección concretas: cada change que mueva rutas añade la suya.
- Ejecutar `vercel dev` en CI.

## Preguntas abiertas

- ¿Tendrá el proyecto de Vercel activada la protección de despliegues (Vercel Authentication) en los previews? Si la tiene, el smoke test necesita un bypass secret o solo podrá ejecutarse contra producción.
