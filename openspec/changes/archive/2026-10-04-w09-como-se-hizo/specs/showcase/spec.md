## Purpose

Expose the site's own OpenSpec history on `/como-se-hizo/`: archived changes and current spec domains, generated at build time from the repository.

## ADDED Requirements

### Requirement: Listado de changes archivados
The `/como-se-hizo/` page SHALL list every folder under `openspec/changes/archive/` that contains a `proposal.md`, ordered from most recent to oldest by the `YYYY-MM-DD` folder prefix. Each entry SHALL show the date, the change name (folder name without the date prefix) and a summary equal to the first paragraph of the proposal's `## Why` section.

#### Scenario: Changes ordenados del más reciente al más antiguo
- **WHEN** the site is built with several archived changes with different dates
- **THEN** the page lists them all, the newest date first, each with its date and name

#### Scenario: Resumen tomado del primer párrafo de Why
- **WHEN** an archived proposal has a `## Why` section with several paragraphs
- **THEN** the entry's summary is exactly the first paragraph of that section

#### Scenario: Proposal sin sección Why
- **WHEN** an archived proposal has no `## Why` section
- **THEN** the entry is still listed, without a summary, and the build does not fail

### Requirement: Enlace de cada change al repositorio
Each archived change entry SHALL link to its folder in the GitHub repository at `<REPO_URL>/tree/main/openspec/changes/archive/<folder>`.

#### Scenario: Enlace a la carpeta del change
- **WHEN** the page lists an archived change
- **THEN** the entry contains a link whose `href` is the repository URL of that change's archive folder

### Requirement: Estado vacío sin changes archivados
When there are no archived changes, the page SHALL show an explanatory empty-state message instead of the list.

#### Scenario: Sin changes archivados
- **WHEN** the change list is empty
- **THEN** an explanatory empty-state message is rendered and no change list is rendered

### Requirement: Resumen de dominios de spec
The page SHALL list each current spec domain (`openspec/specs/<domain>/spec.md`) with its number of requirements (`### Requirement:` headings) and a link to the spec file in the repository.

#### Scenario: Dominios con número de requisitos
- **WHEN** the site is built with the current specs
- **THEN** each domain appears with a requirement count equal to the number of `### Requirement:` headings in its spec

#### Scenario: Sin specs actuales
- **WHEN** there are no current specs
- **THEN** an explanatory empty-state message is rendered for the domains section

### Requirement: Página estática sin JavaScript de cliente
The `/como-se-hizo/` page SHALL be fully generated at build time and ship no client-side JavaScript of its own.

#### Scenario: Página sin scripts propios
- **WHEN** `/como-se-hizo/` is loaded from the built site
- **THEN** it renders the lists with no additional script beyond the site's existing budget and passes the axe accessibility check
