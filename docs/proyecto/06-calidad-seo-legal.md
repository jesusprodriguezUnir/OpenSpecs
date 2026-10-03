# 06 · Calidad, SEO y cumplimiento legal

## Presupuestos (budgets)

| Métrica | Umbral | Dónde se comprueba |
|---|---|---|
| Lighthouse Performance / A11y / BP / SEO | ≥ 95 | Lighthouse CI en PR (opcional desde w02) |
| JS propio en landing | 0 KB | Escenario de w04 |
| LCP (4G móvil) | < 2,0 s | Lighthouse |
| CLS | < 0,05 | Lighthouse |
| Enlaces rotos | 0 | Job de enlaces sobre `dist/` |

## SEO

- `site` correcto **antes** del primer deploy a producción: canónicas y sitemap dependen de él.
- Una página = una intención de búsqueda. Títulos con la consulta real ("Cómo instalar OpenSpec en Windows", no "Instalación").
- `description` obligatoria en guías (150–160 caracteres).
- JSON-LD `TechArticle` con `dateModified` desde `lastReviewed`: refuerza la señal de frescura en un tema que cambia rápido.
- Contenido en español sobre OpenSpec es escaso: oportunidad real de posicionar "OpenSpec tutorial español", "spec-driven development Claude Code".
- `hreflang` solo cuando exista la versión en inglés.

## Accesibilidad

- Starlight cumple de base (landmarks, skip link, foco visible, contraste en ambos temas). No romperlo con overrides.
- Diagramas SVG con `role="img"`, `<title>` y descripción; nunca texto dentro de imágenes raster.
- Contraste de los tokens de color propios verificado (AA mínimo, AAA en texto de cuerpo si es posible).
- Test automático con `@axe-core/playwright` en las plantillas principales (landing, página de guía, 404).

## LSSI-CE y RGPD

> No es asesoramiento jurídico; criterio técnico a validar si el sitio se asocia a una actividad económica.

- **Aviso legal (LSSI-CE art. 10)**: obligatorio si el sitio constituye actividad económica (incluida publicidad o promoción de servicios propios, p. ej. enlazar a webdespega). Datos identificativos del titular y contacto.
- **Cookies (LSSI-CE art. 22.2)**: Starlight guarda el tema elegido en `localStorage`; se considera almacenamiento estrictamente necesario para una funcionalidad solicitada por el usuario → exento de consentimiento. Pagefind no usa cookies. Vercel Web Analytics funciona sin cookies. Resultado: **sin banner** mientras no se añada nada más. Cualquier tercero nuevo (YouTube embebido, fuentes externas, analítica con cookies) obliga a revisar esto.
- **Vídeos de YouTube**: usar `youtube-nocookie.com` y patrón *facade* (miniatura + clic) para no cargar el iframe hasta la interacción.
- **Fuentes**: autoalojadas (API de fuentes de Astro o `@fontsource`), no Google Fonts remotas: evita transferencia de IP a terceros.
- **Política de privacidad (RGPD art. 13)**: aunque no haya formularios, informar de los logs del hosting (Vercel) y de la analítica agregada.
- Formularios: fuera de alcance v1. Si se añade uno, change propio con base jurídica, casilla no premarcada y registro de consentimiento.
