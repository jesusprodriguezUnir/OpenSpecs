# OpenSpec desde cero

Guía web en español para aprender a usar [OpenSpec](https://openspec.dev) desde cero, construida con **Astro + Starlight** y desarrollada, a su vez, **con OpenSpec**.

## Requisitos

- Node.js ≥ 22.12 (Astro 7)
- OpenSpec CLI 1.14.0: `npm i -g @fission-ai/openspec@1.14.0`
- Claude Code

## Comandos

| Comando | Acción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run check` | Tipos y esquema de contenido (`astro check`) |
| `npm run test:unit` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests E2E y de accesibilidad (Playwright contra `astro preview`) |
| `npm run test` | Unitarios y después E2E |
| `npm run links` | Enlaces internos de `dist/` (requiere `npm run build` y lychee) |
| `openspec validate --all --strict` | Valida specs y changes |

## Comprobar enlaces

`npm run links` usa [lychee](https://github.com/lycheeverse/lychee) en modo offline (solo enlaces internos y fragmentos). Instálalo una vez:

```powershell
winget install lycheeverse.lychee
```

```bash
cargo install lychee   # o: brew install lychee
```

Sin lychee, `npm run links` falla con un mensaje claro y los tests de enlaces de `tests/unit/` se saltan en local (en CI siempre se ejecutan).

## Cómo se trabaja

1. Elige el siguiente change en [`docs/proyecto/04-roadmap-de-changes.md`](docs/proyecto/04-roadmap-de-changes.md).
2. En Claude Code: `/roadmap-propose NN` → revisa proposal y specs.
3. `/opsx:apply` → subagente `spec-verifier` → `/opsx:archive`.
4. PR contra `main` (plantilla incluida) → CI verde → merge.

Detalles en [`docs/00-EMPIEZA-AQUI.md`](docs/00-EMPIEZA-AQUI.md) y [`docs/proyecto/05-convenciones.md`](docs/proyecto/05-convenciones.md).

## Estructura

```
.
├── docs/                 # documentación del proyecto y base de conocimiento (no se publica)
├── openspec/             # specs (fuente de verdad) y changes
├── src/content/docs/     # contenido publicado (Starlight)
├── .claude/              # comandos, skills, subagente y settings de Claude Code
└── .github/              # CI y plantilla de PR
```
