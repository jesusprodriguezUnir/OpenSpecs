## Context

The four `src/content/docs/empieza/*.md` files exist as placeholders with valid frontmatter (w03) and are already in the sidebar (w01). Sources: `docs/openspec-kb/01`, `03`, `04`, `05`, written for OpenSpec 1.13; `docs/proyecto/07-novedades-openspec-1.14.md` lists the deltas.

## Goals / Non-Goals

**Goals:** real content for the 4 pages, "Inicio" reading path, PowerShell/bash tabs, tutorial ≤ 30 min on an empty repo.

**Non-Goals:** Guías pages (w06), new components, client JS, editorial quality in specs.

## Decisions

- **`.md` → `.mdx`** for the four pages: needed for Starlight `Tabs`, `TabItem` and `Aside`. Slugs do not change.
- **"Siguiente paso" as a plain Markdown section** (`## Siguiente paso` + link) instead of Starlight's `next` pagination: the pagination is generic, and an explicit heading gives tests a stable selector (link inside the section after the `Siguiente paso` heading). Alternative (a shared component) rejected: four pages do not justify it.
- **Sidebar order** via existing `sidebar.order` 1–4 (verify current values).
- **Tabs**: `<Tabs syncKey="shell">` with `TabItem label="PowerShell"` / `label="bash"`. Starlight Tabs already ship their own script; no new island.
- **Commands verified** against the installed CLI (`openspec --help`, `openspec <cmd> --help`) before writing; anything that changed since 1.13 gets an `<Aside type="caution">`.
- **Tutorial**: `duration: 30`; flow `openspec init` → `/opsx:propose` → `/opsx:apply` → `/opsx:archive` on a "gestión de reservas" example, with a single small requirement so it fits in time.

## Risks / Trade-offs

- [KB is 1.13] → cross-check every command with 07-novedades and the CLI help.
- [Tutorial depends on an AI agent] → state the prerequisite explicitly and show the expected artifacts so the reader can verify each step.
- [30 min is not machine-verifiable] → spec only checks the declared `duration`; real timing is checked by hand in the PR.
