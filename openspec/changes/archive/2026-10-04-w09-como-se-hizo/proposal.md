Roadmap: 09 · docs/proyecto/04-roadmap-de-changes.md

## Why

The site teaches OpenSpec but does not yet show its own OpenSpec history: `/como-se-hizo/` is a placeholder. Rendering the archived changes and current specs from the repository at build time turns the site itself into a living, always-current example of the workflow.

## What Changes

- Replace the `/como-se-hizo/` placeholder with a page generated at build time from the repository's `openspec/` folder.
- List every archived change (from `openspec/changes/archive/*/proposal.md`), newest first, with its date (folder prefix `YYYY-MM-DD`), name, and summary (first paragraph of the `## Why` section).
- Link each change to its folder in the GitHub repository (`REPO_URL` + `/tree/main/openspec/changes/archive/<folder>`).
- Show a summary of current spec domains (from `openspec/specs/*/spec.md`) with the number of requirements in each, linked to the spec file on GitHub.
- Show an explanatory empty state when there are no archived changes (and, likewise, no specs).
- Add two content collections using Astro's `glob()` loader with a base outside `src/`.
- Unit tests (Vitest) for the parsing logic and E2E tests (Playwright) for the page.

## Capabilities

### New Capabilities
- `showcase`: the build-time page that exposes the site's own OpenSpec history (archived changes and spec domains) with links to the repository.

### Modified Capabilities
<!-- none -->

## Impact

- `src/content.config.ts`: two new collections (archived proposals, current specs).
- `src/content/docs/como-se-hizo.md` → `.mdx` rendering a new Astro component.
- New parsing helper in `src/lib/` and a single `REPO_URL` constant.
- No client-side JavaScript, no third parties, no browser storage (no LSSI-CE/RGPD impact).
- Build now depends on `openspec/` being present in the deploy checkout (it is: Vercel builds from the full repo).

## Fuera de alcance

- Rendering full proposal/spec contents inside the site (only summaries + links).
- Active (non-archived) changes in `openspec/changes/`.
- Per-change detail pages, filtering or search.
- Git history/commit data.

## Open Questions

- None blocking. Assumptions recorded: `REPO_URL = https://github.com/jesusprodriguezUnir/OpenSpecs` with branch `main`; the page stays a Starlight docs page (keeps sidebar and layout) instead of a custom `src/pages` route.
