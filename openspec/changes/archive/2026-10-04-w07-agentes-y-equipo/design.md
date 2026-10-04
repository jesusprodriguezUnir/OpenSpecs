## Context

Los seis `.md` de `src/content/docs/agentes/` y `src/content/docs/equipo/` existen como marcadores con frontmatter válido (w03), `sidebar.order` y presencia en el sidebar (w01). w05/w06 fijaron el patrón: `.mdx`, `## Siguiente paso`, `Tabs` con `syncKey` y `Aside`. Fuentes: `docs/openspec-kb/01`, `02`, `06`, `07`, `08`, `09` (1.13) y `docs/proyecto/07-novedades-openspec-1.14.md`. La rama sale de `main` (w06 ya mergeado).

## Goals / Non-Goals

**Goals:** contenido real de las seis páginas, cadena "Siguiente paso" hasta `/referencia/comandos-chat/`, avisos RGPD, plantillas enlazadas, CI en dos plataformas con versión fijada, datos de MCP verificados.

**Non-Goals:** páginas de Referencia (w08), componentes u overrides nuevos, JS de cliente nuevo.

## Decisions

- **`.md` → `.mdx`** en las seis páginas; slugs y `sidebar.order` sin cambios.
- **"Siguiente paso" como sección Markdown**, reutilizando el selector de los tests de w05/w06.
- **Fuentes por página**: claude-code ← KB 07 (KB 08 solo como enlaces); otros ← KB 01/02 + `openspec init --help`; jira ← KB 06; azure-devops ← KB 06 + 07 (servidor MCP local); ci ← KB 06 + 08 + `.github/workflows/ci.yml` de este repo; adopcion ← KB 09.
- **Otros agentes**: solo hechos verificables con `openspec init --help` (lista de `--tools`, `--copilot-cloud`) y lo que la CLI genera en el repo; diferencias con Claude Code en términos generales; enlace a la documentación oficial de OpenSpec.
- **CI**: `Tabs` con `syncKey="ci"` y etiquetas "Azure Pipelines" / "GitHub Actions"; versión fijada a la 1.14.x instalada (`openspec --version`). La regla opcional `no-spec` se explica con la de este propio repo.
- **RGPD**: `Aside type="caution"` con el texto "RGPD". El test localiza el aside de Starlight por su clase, verificada contra el build en la tarea 1.1.
- **MCP con fecha**: endpoints de Atlassian Rovo y estado del servidor remoto de Azure DevOps se contrastan en las fuentes oficiales durante el apply y se publican en un `Aside` de precaución con "Revisado: <fecha>". Si contradicen la KB, manda la fuente oficial.
- **Modelos por fase** con alias (`opus`, `sonnet`), como en la KB, sin versiones concretas.
- **Ejemplos** en dominio "gestión de reservas"; claves de ticket ficticias (`RES-123`, `AB#123`); sin datos personales.

## Risks / Trade-offs

- [Enlaces a marcadores de w08] → devuelven 200, pero el lector cae en una página vacía hasta w08. Aceptado.
- [Datos de MCP caducan] → fecha de revisión visible y `lastReviewed`; el aviso de desactualización (w03) cubre el resto.
- [Clase interna del aside en tests] → acopla el test a la versión fijada de Starlight; aceptable, fallaría de forma visible al actualizar.
- [Afirmaciones sobre otros agentes] → limitadas a lo que muestra la CLI 1.14 para no inventar.
