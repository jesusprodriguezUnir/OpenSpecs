# 07 · Diferencias entre la KB (v1.13.0) y OpenSpec 1.14.0

La base de conocimiento de `docs/openspec-kb/` se escribió para la 1.13.0. Lo siguiente se ha **observado en la CLI 1.14.0** (03/10/2026); no se ha contrastado si cada punto apareció exactamente en la 1.14 o antes. Antes de redactar las páginas de referencia, contrastar con `docs/` del repositorio oficial y con `openspec --help`.

## `openspec init`

- Modo no interactivo: `openspec init --tools claude` (lista de más de 40 herramientas; `all` / `none`).
- `--language <idioma>`: escribe los artefactos nuevos en ese idioma. **No sobrescribe un `config.yaml` existente**: si ya existe, el idioma se indica en `context` (es lo que hace este proyecto).
- `--profile core|custom`, `--force` (limpia ficheros legacy).
- Con el perfil core genera en `.claude/`: **6 skills** (`openspec-propose`, `-explore`, `-apply-change`, `-archive-change`, `-sync-specs`, `-update-change`) y **6 comandos** (`/opsx:propose`, `explore`, `apply`, `archive`, `sync`, `update`).
- Workflows adicionales vía `openspec config profile`: `new`, `continue`, `ff`, `bulk-archive`, `verify`, `onboard`.

## Comando de chat nuevo respecto a la KB

- **`/opsx:update`** *(experimental)*: revisa los artefactos de planificación de un change y los mantiene coherentes entre sí. No toca código. Útil tras feedback en la revisión de la propuesta.

## `config.yaml`

La plantilla generada documenta tres bloques:

- `context` (todos los artefactos) — la plantilla recomienda incluir **solo restricciones que el agente no puede inferir leyendo el código**.
- `rules.<artefacto>` (por artefacto).
- **`operations.apply.guidance` / `operations.archive.guidance`** — orientación para la ejecución de apply y archive, separada de las reglas de artefacto. *No aparece en la KB.*

## CLI: comandos no recogidos en la KB

| Comando | Qué hace |
|---|---|
| `openspec version` | Versión instalada y si hay actualización |
| `openspec status` | Estado de completitud de artefactos de un change |
| `openspec instructions [artefacto]` | Instrucciones enriquecidas para artefactos, apply o archive (lo que usan las skills) |
| `openspec templates` / `openspec schemas` | Rutas de plantillas resueltas / schemas disponibles |
| `openspec doctor` | Salud de relaciones en la raíz OpenSpec |
| `openspec context` | Contexto de trabajo de la raíz resuelta |
| `openspec workset` | Vistas de trabajo personales (locales) |
| `openspec store` | Stores: repos OpenSpec independientes registrados en la máquina (`--store <id>` en muchos comandos) |
| `openspec feedback` | Enviar feedback |
| `openspec completion` | Autocompletado de shell |

## Validación sin contenido

`openspec validate --all --strict --no-interactive` en un repo recién inicializado devuelve "No items found to validate." con **código 0** → el hook `Stop` y el job de CI no fallan antes del primer change.

## Impacto en la web

- Las páginas de Referencia (w08) deben partir de `openspec --help` de la versión fijada, no de la KB.
- La página de Instalación (w05) debe usar `openspec init --tools claude` como ruta rápida y explicar `--language`.
- La guía de configuración (w06) debe cubrir `operations`.
