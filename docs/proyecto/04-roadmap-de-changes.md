# 04 · Roadmap de changes

Backlog ordenado del proyecto. **Cada fila es un change de OpenSpec** (= una rama = una PR). No hay Jira: este fichero hace de backlog y el `id` es la clave.

- Nombre del change y de la rama: `wNN-<slug>` (p. ej. `w01-fundacion-starlight`).
- Lanzar con `/roadmap-propose NN` (comando del proyecto) o copiando el prompt en `/opsx:propose`.
- Revisar **siempre** proposal + delta specs antes de `/opsx:apply`.
- Dominios de spec previstos: `navegacion`, `contenido`, `seo`, `accesibilidad`, `busqueda`, `calidad`, `despliegue`, `showcase`, `legal`.

## Resumen

| NN | Change | Tipo | Dominios | Depende de |
|---|---|---|---|---|
| 00 | *Bootstrap (manual, sin change)* | setup | — | — |
| 01 | `w01-fundacion-starlight` | feature | navegacion, seo | 00 |
| 02 | `w02-calidad-ci` | feature | calidad | 01 |
| 03 | `w03-esquema-de-contenido` | feature | contenido | 01 |
| 04 | `w04-landing` | feature | navegacion, seo | 01 |
| 05 | `w05-seccion-empieza` | contenido | contenido | 03 |
| 06 | `w06-seccion-guias` | contenido | contenido | 03 |
| 07 | `w07-agentes-y-equipo` | contenido | contenido | 03 |
| 08 | `w08-referencia-y-recursos` | feature + contenido | contenido, busqueda | 03 |
| 09 | `w09-como-se-hizo` | feature | showcase | 03 |
| 10 | `w10-seo-avanzado` | feature | seo | 04 |
| 11 | `w11-legal-y-analitica` | feature | legal | 01 |
| 12 | `w12-despliegue-vercel` | feature | despliegue | 02 |

> **Orden recomendado**: 01 → 02 → 03 → 12 (desplegar pronto, preview por PR) → 04 → 05… El contenido (05–08) puede ir en paralelo con git worktrees (receta 4).

---

## 00 · Bootstrap (manual)

Lo hace `docs/bootstrap/bootstrap.ps1`. No es un change: es la infraestructura mínima para poder usar OpenSpec. Resultado: proyecto Starlight vacío, `openspec/` inicializado, `CLAUDE.md`, `.claude/`, `.github/`, primer commit en `main`.

---

## 01 · `w01-fundacion-starlight`

**Objetivo**: configurar Starlight como base del sitio: idioma, título, sidebar con las secciones del mapa, `site`, sitemap, favicon, tema de color y página 404.

**Escenarios esperados (orientativos)**
- Navegación: el sidebar muestra las secciones en el orden de `03-arquitectura-de-informacion.md`.
- Idioma: `<html lang="es-ES">` en todas las páginas; URLs sin prefijo de locale.
- 404: una ruta inexistente devuelve la página 404 personalizada con enlace a inicio y a la búsqueda.
- SEO base: cada página tiene `<title>` con sufijo del sitio, `<link rel="canonical">` absoluto y aparece en `sitemap-index.xml`.

**Prompt**
```
/opsx:propose w01-fundacion-starlight
Configura la base del sitio Starlight según docs/proyecto/02-adr-0001-stack.md y
docs/proyecto/03-arquitectura-de-informacion.md: locale root es-ES, título
"OpenSpec desde cero", sidebar con las secciones Empieza, Guías, Con tu agente,
En equipo, Referencia, Recursos y Cómo se hizo (páginas placeholder con
draft o una línea), `site` leído de una variable (SITE_URL) con fallback,
página 404 propia y tokens de color propios. Fija versiones exactas de astro y
@astrojs/starlight. Incluye Playwright con escenarios de navegación, idioma, 404
y canónicas. Fuera de alcance: landing, contenido real, despliegue.
```

---

## 02 · `w02-calidad-ci`

**Objetivo**: puerta de calidad local y en GitHub Actions.

**Escenarios esperados**
- Un PR con specs inválidas falla el job `openspec`.
- Un PR con error de tipos o de frontmatter falla `astro check` / build.
- Un enlace interno roto en `dist/` falla el job de enlaces.
- Los tests de Playwright se ejecutan contra `astro preview`.

**Prompt**
```
/opsx:propose w02-calidad-ci
Añade la puerta de calidad: scripts npm (check, test:unit con Vitest, test:e2e con
Playwright, links), y ajusta .github/workflows/ci.yml para ejecutar
openspec validate --all --strict, astro check, build, tests y comprobación de
enlaces sobre dist/. OpenSpec fijado a 1.14.0 en CI. Documenta en design.md por
qué cada comprobación y su coste en tiempo. Spec de dominio "calidad" con
escenarios observables (qué hace fallar el pipeline).
```

---

## 03 · `w03-esquema-de-contenido`

**Objetivo**: frontmatter tipado y componentes de metadatos.

**Escenarios esperados**
- El build falla si una página de guía no declara `openspecVersion`, `lastReviewed` o `level`.
- Cada página de guía muestra una cabecera con nivel, duración estimada, versión de OpenSpec y fecha de revisión.
- Una página revisada hace más de 180 días muestra un aviso "contenido posiblemente desactualizado".

**Prompt**
```
/opsx:propose w03-esquema-de-contenido
Extiende docsSchema con openspecVersion, lastReviewed, level y duration
(ver docs/proyecto/03-arquitectura-de-informacion.md; z desde 'astro/zod').
Las páginas bajo /empieza, /guias, /agentes, /equipo y /referencia deben
declararlos obligatoriamente (decide el mecanismo en design.md). Añade un
componente de cabecera de metadatos y un aviso de contenido desactualizado
(>180 días). Tests: Vitest para la lógica de caducidad y Playwright para la
cabecera.
```

---

## 04 · `w04-landing`

**Objetivo**: landing `template: splash` que convierta a "Empieza en 30 minutos".

**Escenarios esperados**
- El hero muestra propuesta de valor, CTA primario a `/empieza/primer-cambio/` y secundario a `/empieza/que-es/`.
- Se muestra el ciclo explore → propose → apply → archive como diagrama accesible (SVG con `<title>` y texto alternativo).
- La landing no carga JavaScript de cliente salvo el que aporta Starlight.

**Prompt**
```
/opsx:propose w04-landing
Crea la landing (template splash) con hero, bloque "qué es en 3 frases", diagrama
SVG accesible del ciclo /opsx, tres recorridos (Inicio, Equipo, Consulta) y CTA.
Sin islas de cliente. Imágenes con <Image /> de astro:assets. Escenarios de
contenido observable, CTA y peso de la página (sin JS propio).
```

---

## 05 · `w05-seccion-empieza`

**Objetivo**: las 4 páginas de "Empieza" a partir de `openspec-kb/01`, `03` y `05`.

**Prompt**
```
/opsx:propose w05-seccion-empieza
Redacta las páginas de la sección Empieza según docs/proyecto/03-arquitectura-de-informacion.md
usando docs/openspec-kb/01, 03 y 05 como fuente, actualizadas a OpenSpec 1.14
(docs/proyecto/07-novedades-openspec-1.14.md). Ejemplos con dominio neutro
(gestión de reservas), comandos con Tabs PowerShell/bash. El tutorial
"Tu primer cambio" debe poder completarse en <30 min sobre un repo vacío.
Specs: solo comportamiento verificable (frontmatter, enlace "Siguiente paso",
presencia en sidebar); la calidad editorial se revisa en la PR.
```

---

## 06 · `w06-seccion-guias`

**Prompt**
```
/opsx:propose w06-seccion-guias
Redacta las páginas de Guías (formato de specs, flujo /opsx, recetas, brownfield,
configuración) desde docs/openspec-kb/03, 04, 05 y 09. Usa Expressive Code con
marcadores de diff para ADDED/MODIFIED/REMOVED. Mismas reglas editoriales.
```

---

## 07 · `w07-agentes-y-equipo`

**Prompt**
```
/opsx:propose w07-agentes-y-equipo
Redacta Con tu agente (Claude Code, otros agentes) y En equipo (Jira, Azure DevOps,
CI, adopción) desde docs/openspec-kb/06, 07, 08 y 09. Avisos de RGPD con Aside.
Las plantillas largas se enlazan a /referencia/plantillas/ en lugar de duplicarse.
```

---

## 08 · `w08-referencia-y-recursos`

**Objetivo**: referencia de comandos, plantillas, glosario, FAQ y página de recursos alimentada por una colección YAML con Zod.

**Escenarios esperados**
- Cada recurso tiene título, URL, tipo (oficial, comunidad, vídeo) e idioma; el build falla si falta alguno o la URL no es válida.
- La página de recursos permite filtrar por tipo sin recargar (isla mínima o CSS `:has()`; decidir en design).
- Los términos del glosario tienen ancla estable (`#delta-spec`).

**Prompt**
```
/opsx:propose w08-referencia-y-recursos
Crea la sección Referencia (comandos de chat, CLI, plantillas, glosario, FAQ) y la
página Recursos con una colección `resources` (YAML + Zod) a partir de
docs/openspec-kb/02. Filtro por tipo con el mínimo JS posible. Valida que la
referencia de comandos coincide con `openspec --help` de la versión fijada.
```

---

## 09 · `w09-como-se-hizo`

**Objetivo**: el sitio se muestra a sí mismo. Colección `changelog` con `glob()` loader sobre `openspec/changes/archive/*/proposal.md` y listado de specs actuales.

**Escenarios esperados**
- La página lista todos los changes archivados, del más reciente al más antiguo, con fecha (prefijo de carpeta) y resumen (primer párrafo de "Why").
- Cada change enlaza a su carpeta en el repositorio de GitHub.
- Si no hay changes archivados, se muestra un estado vacío explicativo.

**Prompt**
```
/opsx:propose w09-como-se-hizo
Crea la página /como-se-hizo/ que, en build, lea openspec/changes/archive/*/proposal.md
y openspec/specs/*/spec.md mediante colecciones con glob() loader (base fuera de src).
Lista de changes con fecha y resumen, enlace al repo (REPO_URL), y resumen de
dominios de spec con nº de requisitos. Tests Vitest del parseo y Playwright de la página.
```

---

## 10 · `w10-seo-avanzado`

**Prompt**
```
/opsx:propose w10-seo-avanzado
Añade Open Graph/Twitter cards por página (imagen OG generada en build o estática
por sección), JSON-LD (WebSite + TechArticle con dateModified = lastReviewed,
BreadcrumbList), robots.txt y meta description obligatoria en guías.
Override mínimo del componente Head de Starlight.
```

---

## 11 · `w11-legal-y-analitica`

**Prompt**
```
/opsx:propose w11-legal-y-analitica
Añade páginas de aviso legal y privacidad (LSSI-CE art. 10, RGPD art. 13) y
analítica sin cookies (Vercel Web Analytics). Sin banner de cookies mientras no
haya cookies ni almacenamiento no exento; documenta el criterio en design.md y
añade un test que falle si alguna página establece cookies.
```

---

## 12 · `w12-despliegue-vercel`

**Prompt**
```
/opsx:propose w12-despliegue-vercel
Configura el despliegue estático en Vercel sin adapter: vercel.json con cabeceras
de seguridad (CSP compatible con Starlight/Pagefind, HSTS, Referrer-Policy,
X-Content-Type-Options), caché inmutable para /_astro/*, redirecciones y
previews por PR. Escenarios sobre las cabeceras observables en la respuesta.
```

---

## Backlog v2 (sin priorizar)

- Versión en inglés (i18n Starlight).
- Playground: validador de specs en el navegador (isla) — evaluar si OpenSpec expone algo usable en browser.
- Generar automáticamente la referencia de CLI desde `openspec --help` en CI.
- Comparativa interactiva OpenSpec vs Spec Kit vs Kiro.
