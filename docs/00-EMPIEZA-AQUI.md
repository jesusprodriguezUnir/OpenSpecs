# OpenSpec desde cero — Empieza aquí

> Proyecto: web en Astro que enseña a usar OpenSpec desde cero, **construida a su vez con OpenSpec** (dogfooding).
> Ubicación: `D:\Personal\OpenSpecs` · Preparado el 03/10/2026

## Por qué la raíz solo contiene `docs/`

`create-astro` aborta si el directorio no está vacío, pero ignora una lista blanca de entradas (`docs`, `.git`, `.gitignore`, `LICENSE`…). Por eso **toda la documentación vive en `docs/`** y los ficheros que deben ir en la raíz (`CLAUDE.md`, `openspec/config.yaml`, `.claude/…`, `.github/…`) esperan en `docs/bootstrap/` hasta que el script los copie tras el scaffolding. Las carpetas `claude/` y `github/` se guardan **sin punto** y el script las copia como `.claude/` y `.github/` (además así Claude Code no las carga como configuración activa mientras están en `docs/`).

## Contenido de esta carpeta

```
docs/
├── 00-EMPIEZA-AQUI.md                 ← este fichero
├── openspec-kb/                       ← base de conocimiento (fuente del contenido de la web)
│   └── 00…10-*.md
├── proyecto/
│   ├── 01-vision-y-alcance.md         ← qué construimos, para quién, qué no
│   ├── 02-adr-0001-stack.md           ← Starlight vs Astro a medida vs alternativas
│   ├── 03-arquitectura-de-informacion.md ← mapa del sitio y mapeo KB → páginas
│   ├── 04-roadmap-de-changes.md       ← backlog ordenado de changes + prompt /opsx:propose de cada uno
│   ├── 05-convenciones.md             ← ramas, commits, idioma, PR, DoD
│   ├── 06-calidad-seo-legal.md        ← SEO, accesibilidad, rendimiento, LSSI-CE/RGPD
│   └── 07-novedades-openspec-1.14.md  ← diferencias entre la KB (1.13) y la versión actual
└── bootstrap/
    ├── bootstrap.ps1                  ← scaffolding + openspec init + copia de ficheros
    ├── README.md                      ← README definitivo del repo
    ├── CLAUDE.md
    ├── openspec/config.yaml
    ├── claude/settings.json           ← se copia a .claude/
    ├── claude/agents/spec-verifier.md
    ├── claude/commands/roadmap-propose.md
    ├── github/pull_request_template.md ← se copia a .github/
    └── github/workflows/ci.yml
```

## Versiones de referencia (comprobadas el 03/10/2026)

| Paquete | Versión | Nota |
|---|---|---|
| `@fission-ai/openspec` | 1.14.0 | Node ≥ 20.19.0 |
| `astro` | 7.3.x | **Node ≥ 22.12.0** (manda sobre el requisito de OpenSpec) |
| `@astrojs/starlight` | 0.42.x | peer `astro ^7.2.10` |
| `create-astro` | 5.2.x | |

## Arranque en 6 pasos

1. **Requisitos**: Node 22 LTS (≥ 22.12), Git y Claude Code. Comprueba con `node -v`.
2. **Scaffolding + OpenSpec**: desde PowerShell en `D:\Personal\OpenSpecs`:
   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\docs\bootstrap\bootstrap.ps1
   ```
   El script crea el proyecto Starlight, instala OpenSpec 1.14.0, ejecuta `openspec init --tools claude`, copia los ficheros de `docs/bootstrap/` a la raíz y hace el primer commit.
3. **Revisa** `CLAUDE.md` y `openspec/config.yaml`: son el contexto que el agente leerá en cada change. Ajusta lo que no encaje antes del primer `propose`.
4. **Abre Claude Code** en la raíz y comprueba que aparecen `/opsx:propose`, `/opsx:apply`, `/opsx:archive` y `/roadmap-propose`.
5. **Primer change**: `/roadmap-propose 01` (equivale a `/opsx:propose` con el prompt del roadmap). Revisa `proposal.md` y las delta specs **antes** de aplicar.
6. **Ciclo**: `/opsx:apply` → subagente `spec-verifier` → `/opsx:archive` → PR → merge. Repite con el siguiente change del roadmap.

## Decisiones ya tomadas (ver ADR-0001)

- **Starlight** sobre Astro 7: sidebar, búsqueda (Pagefind), modo oscuro, a11y y Expressive Code de serie. La landing se personaliza con `template: splash`.
- **Salida estática** en Vercel, sin adapter. Añadir `@astrojs/vercel` solo si aparece algo server-side.
- **Idioma único es-ES** con locale `root` (sin prefijo `/es/`). i18n se deja preparado pero fuera de alcance.
- **El repositorio es parte del contenido**: la web mostrará en build los changes archivados de su propio `openspec/` (change 09 del roadmap).

## Riesgos a vigilar desde el día 1

- **Specs de un sitio de contenidos**: el riesgo es escribir specs triviales ("la página X existe"). Las specs deben capturar comportamiento verificable (navegación, metadatos SEO, esquema de contenido, build que falla si falta un campo). El contenido editorial en sí no se especifica: se revisa en la PR.
- **Hook `Stop` en Windows**: Claude Code ejecuta los hooks con la shell configurada (Git Bash por defecto). Si `openspec` no está en el `PATH` de esa shell, el hook falla en cada turno. Verifícalo tras el paso 4.
- **Deriva de versiones**: la KB está escrita para 1.13; consulta `proyecto/07-novedades-openspec-1.14.md` antes de redactar las páginas de comandos.
