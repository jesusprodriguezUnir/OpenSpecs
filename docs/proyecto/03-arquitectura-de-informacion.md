# 03 · Arquitectura de información

## Mapa del sitio (v1)

| Sección (sidebar) | Página | Slug | Fuente en `openspec-kb/` | Nivel |
|---|---|---|---|---|
| — | Landing | `/` | 00, 01 | — |
| **Empieza** | ¿Qué es OpenSpec? | `/empieza/que-es/` | 01 | inicio |
| | Conceptos: specs, changes y deltas | `/empieza/conceptos/` | 01, 04 | inicio |
| | Instalación | `/empieza/instalacion/` | 03 | inicio |
| | Tu primer cambio en 30 minutos | `/empieza/primer-cambio/` | 05 (receta 1) | inicio |
| **Guías** | Escribir specs | `/guias/formato-de-specs/` | 04 | intermedio |
| | Flujo /opsx de principio a fin | `/guias/flujo-opsx/` | 05 | intermedio |
| | Recetas: feature, bugfix, refactor, paralelo | `/guias/recetas/` | 05 | intermedio |
| | Proyectos existentes (brownfield) | `/guias/brownfield/` | 01, 09 | intermedio |
| | config.yaml y schemas personalizados | `/guias/configuracion/` | 03 | avanzado |
| **Con tu agente** | Claude Code | `/agentes/claude-code/` | 07 | intermedio |
| | Otros agentes (Copilot, Cursor, Codex…) | `/agentes/otros/` | 01, 02 | intermedio |
| **En equipo** | Integración con Jira | `/equipo/jira/` | 06 | avanzado |
| | Integración con Azure DevOps | `/equipo/azure-devops/` | 06 | avanzado |
| | Pipeline y validación en CI | `/equipo/ci/` | 06, 08 | avanzado |
| | Plan de adopción y riesgos | `/equipo/adopcion/` | 09 | avanzado |
| **Referencia** | Comandos de chat `/opsx:*` | `/referencia/comandos-chat/` | 05 + 07-novedades | — |
| | CLI `openspec` | `/referencia/cli/` | 03 + 07-novedades | — |
| | Plantillas | `/referencia/plantillas/` | 08 | — |
| | Glosario | `/referencia/glosario/` | 00 | — |
| | FAQ | `/referencia/faq/` | 10 | — |
| **Recursos** | Documentación, vídeos y comunidad | `/recursos/` | 02 (colección YAML) | — |
| **Cómo se hizo** | Esta web, construida con OpenSpec | `/como-se-hizo/` | `openspec/` del repo | — |
| — | Aviso legal / Privacidad | `/legal/…` | — | — |

## Reglas editoriales

- Cada página responde a **una** pregunta; el título es esa pregunta o su respuesta.
- Estructura: contexto (2–3 líneas) → pasos/contenido → "Siguiente paso" (enlace a la página siguiente en el recorrido).
- Los ejemplos de specs usan un dominio neutro y comprensible para todos (p. ej. **gestión de reservas** o el propio sitio), no el dominio académico interno de la KB.
- Comandos: siempre en bloque de código con título (`title="PowerShell"` / `title="bash"`) y, si aplica, ambas variantes con `<Tabs syncKey="shell">`.
- Avisos de versión con `<Aside type="caution">` cuando un comando cambió entre versiones.
- Sin datos personales reales en ejemplos.

## Frontmatter obligatorio (extiende `docsSchema`)

```ts
// src/content.config.ts (orientativo — lo definirá el change 03)
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'; // `z` desde 'astro:content' está deprecado en Astro 7 y desaparece en Astro 8
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        openspecVersion: z.string().regex(/^\d+\.\d+(\.\d+)?$/).optional(),
        lastReviewed: z.coerce.date().optional(),
        level: z.enum(['inicio', 'intermedio', 'avanzado']).optional(),
        duration: z.number().int().positive().optional(), // minutos
      }),
    }),
  }),
};
```

> Se declaran `optional()` en el schema para no romper la landing ni las páginas legales; la obligatoriedad en páginas de guía se impone con un `superRefine` o un test de contenido (decisión del `design.md` del change 03).

## Recorridos

- **Inicio**: Landing → Qué es → Conceptos → Instalación → Primer cambio → Escribir specs.
- **Equipo**: Landing → Plan de adopción → Jira/Azure DevOps → CI → Plantillas.
- **Consulta**: Búsqueda (Pagefind) o Referencia.
