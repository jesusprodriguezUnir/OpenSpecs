# Design

## Context

`/como-se-hizo/` is a placeholder Markdown page in the Starlight `docs` collection. `src/content.config.ts` already defines `docs` and `resources` (file loader). ADR-0001 fixes static output, no adapter, and zero client JS by default. Archived changes live in `openspec/changes/archive/YYYY-MM-DD-<name>/proposal.md`; specs in `openspec/specs/<domain>/spec.md`.

## Goals / Non-Goals

**Goals:** build-time listing of archived changes and spec domains; pure, unit-testable parsing; no client JS.

**Non-Goals:** rendering full Markdown of proposals/specs; active changes; detail pages.

## Decisions

1. **Two collections with `glob()` loader, base outside `src/`.**
   - `changelog`: `glob({ base: './openspec/changes/archive', pattern: '*/proposal.md' })`.
   - `specDomains`: `glob({ base: './openspec/specs', pattern: '*/spec.md' })`.
   - Neither file has frontmatter, so schemas are empty/passthrough; derived data comes from `entry.id`/`filePath` and `entry.body`.
   - Alternative discarded: `import.meta.glob('?raw')` — works, but bypasses content collections (the roadmap explicitly asks for collections) and loses cache/HMR integration.
   - Note: glob ids are slugified; the folder name is derived from `filePath` instead to keep exact names for links.

2. **Pure parsing helpers in `src/lib/openspec-history.ts`**: `parseArchiveFolder(folder) → { date, name }` (returns null if no date prefix), `extractWhySummary(markdown) → string | undefined`, `countRequirements(markdown) → number`, `sortChangesDesc(...)`. Tested with Vitest, Scenario names in test titles.

3. **`REPO_URL` as a single constant** in `src/lib/site.ts` (`https://github.com/jesusprodriguezUnir/OpenSpecs`, branch `main`). Alternative discarded: env var — adds config surface for a value that never changes per environment.

4. **Rendering**: rename `como-se-hizo.md` → `.mdx`, import an `OpenspecHistory.astro` component under `src/components/` (no Starlight override needed). Keeps sidebar, title and SEO from Starlight. Alternative discarded: custom `src/pages/como-se-hizo.astro` — loses Starlight layout and duplicates head/SEO.

5. **Summary as plain text**: the first paragraph of `## Why` rendered as plain text (backticks kept as-is). Keeps it XSS-safe and avoids a Markdown renderer dependency.

6. **Empty state testing**: the Playwright build always has archived changes, so the empty state is covered at the component/helper level via Vitest (`Scenario: Sin changes archivados`, `Scenario: Sin specs actuales`) using the Astro container API or by testing the view-model helper that decides empty vs list.

## Risks / Trade-offs

- **Build depends on `openspec/` in the checkout** → Vercel and CI clone the full repo; acceptable.
- **Proposal format drift** (e.g. `## Why` renamed) → summary becomes empty but build does not fail (spec'd).
- **Link to `main`**: on preview builds of a PR, links point to `main`, where a just-archived folder may not exist yet → acceptable; documented.
- This change's own proposal appears only after it is archived (expected, and a nice demo).
