Roadmap: 08 · docs/proyecto/04-roadmap-de-changes.md

## Why

Las cinco páginas de Referencia y `/recursos/` son marcadores ("Página en preparación"). Referencia es la entrada del recorrido "Consulta" de la landing y el destino del último "Siguiente paso" de En equipo (w07), así que hoy el lector termina en páginas vacías. Además, la KB se escribió para OpenSpec 1.13 y la CLI fijada es la 1.14.0: una referencia de comandos copiada de la KB enseñaría comandos y flags que ya no coinciden.

## What Changes

- Redactar en es-ES `/referencia/comandos-chat/`, `/referencia/cli/`, `/referencia/plantillas/`, `/referencia/glosario/` y `/referencia/faq/` a partir de `docs/openspec-kb/00`, `03`, `05`, `08`, `10` y `docs/proyecto/07-novedades-openspec-1.14.md`.
- La referencia de comandos parte de la salida real de la CLI fijada: se versiona en el repo una fixture con `openspec --help` y `openspec <cmd> --help` de la 1.14.0 y la lista de comandos `/opsx:*` que genera `openspec init`; un script `npm run` la regenera al subir de versión y un test comprueba que lo documentado existe en la fixture y que su versión coincide con `openspecVersion` de la página.
- Cada término del glosario tiene un ancla estable derivada de su nombre (`#delta-spec`).
- Cadena "Siguiente paso": comandos-chat → cli → plantillas → glosario → faq → `/recursos/`.
- Nueva colección `resources` (YAML + Zod) con título, URL, tipo (`oficial`, `comunidad`, `video`) e idioma (`es`, `en`), poblada desde `docs/openspec-kb/02`. El build falla si falta un campo, la URL no es `https` válida o el tipo/idioma no está permitido.
- `/recursos/` lista los recursos agrupados y permite filtrar por tipo sin recargar y sin JavaScript (CSS `:has()` con un grupo de radios accesible).
- Los términos del glosario son localizables con la búsqueda del sitio y el resultado lleva a su ancla.

## Capabilities

### New Capabilities

- `busqueda`: dominio permitido por `config.yaml` sin spec todavía; se crea con un único requisito (glosario localizable con ancla).

### Modified Capabilities

- `contenido`: añade requisitos de Referencia (sin marcadores, cadena "Siguiente paso", anclas del glosario, coherencia con la CLI fijada) y de la colección `resources` y la página `/recursos/` (validación de datos, listado y filtro). El orden de Referencia en el sidebar ya existe por `sidebar.order` (1–5) y lo cubre `navegacion`.

## Fuera de alcance

- Comprobar en el build que las URL de los recursos responden (sin red en el build; solo formato).
- Ejecutar la CLI de OpenSpec en CI: la comprobación usa la fixture versionada.
- Traducción de recursos o contenido a otros idiomas.
- Overrides de Starlight nuevos y calidad editorial del texto.
- La ruta de aprendizaje de la KB 02 como página propia (puede citarse en `/recursos/` como texto).

## Impacto

- `src/content/docs/referencia/*.md` → `.mdx`; `src/content/docs/recursos.md` → `.mdx`.
- `src/content.config.ts`: colección `resources` con loader `file()`; datos en `src/data/resources.yaml`.
- Componente de contenido nuevo para el listado/filtro de recursos (no es override de Starlight).
- Fixture `tests/fixtures/openspec-cli-1.14.0.json` y script `scripts/openspec-help-snapshot.mjs` (`npm run snapshot:openspec`).
- Tests: Vitest (esquema de recursos, coherencia con la fixture) y Playwright (`tests/e2e/referencia-recursos.spec.ts`).
- Sin JavaScript de cliente nuevo, sin terceros, sin almacenamiento en el navegador: sin impacto LSSI-CE/RGPD. Los recursos son enlaces externos sin embeber (los vídeos se enlazan, no se incrustan).
- Sin dependencias nuevas.

## Preguntas abiertas

_Ninguna._ Resueltas antes de proponer: coherencia con la CLI mediante fixture versionada (opción b); `busqueda` con un solo requisito; filtro con CSS `:has()`; URL validadas solo por formato `https`, idioma `es | en`.
