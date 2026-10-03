# 01 · Visión y alcance

## Objetivo

Publicar una guía web, en español de España, que lleve a un desarrollador **de cero a su primer change archivado con OpenSpec** en menos de una hora, y que después sirva de referencia diaria (comandos, formato de specs, plantillas, integración con backlog).

La web se construye **con OpenSpec**: cada funcionalidad nace como change, y el propio historial (`openspec/changes/archive/`) se expone como caso práctico real.

## Público

| Perfil | Necesidad principal | Páginas clave |
|---|---|---|
| Dev que no conoce SDD | Entender el porqué y hacer un primer ciclo guiado | Fundamentos, Instalación, Primer cambio |
| Dev que ya usa Claude Code / Copilot | Integrarlo en su repo con buenas prácticas | Configuración del agente, Formato de specs, Recetas |
| Tech Lead / Scrum Master | Adoptarlo en un equipo con Jira / Azure DevOps | Integración backlog, Plan de adopción, Plantillas |

## Propuesta de valor frente a la documentación oficial

1. **En español** y con ejemplos de stack real (.NET + Angular, Astro).
2. **Orientado a equipo**: backlog, PR, pipeline, DoD, RGPD; la documentación oficial se centra en el individuo.
3. **Caso vivo**: el sitio enseña sus propios changes, specs y PR.
4. **Versionado explícito**: cada página declara la versión de OpenSpec para la que se escribió.

## Objetivos medibles (6 meses tras publicar)

- Tiempo hasta el primer change archivado siguiendo la guía: < 60 min (prueba con 3 personas).
- Lighthouse ≥ 95 en Performance, Accessibility, Best Practices y SEO en todas las plantillas.
- 0 enlaces rotos en `main` (comprobado en CI).
- 100 % de páginas con `openspecVersion` y `lastReviewed` en frontmatter (forzado por el schema).

## Alcance v1

- Landing + ~20 páginas de guía (ver `03-arquitectura-de-informacion.md`).
- Búsqueda local (Pagefind, incluida en Starlight).
- Página "Cómo se hizo esta web" alimentada por `openspec/` en build.
- Plantillas copiables (CLAUDE.md, config.yaml, comandos, subagente, pipeline, PR).
- Despliegue en Vercel con CI en GitHub Actions.

## Fuera de alcance v1

- Multi-idioma (inglés). Se deja Starlight preparado para añadir locales.
- Contenido generado en runtime, comentarios, cuentas de usuario, newsletter.
- Playground interactivo de OpenSpec en el navegador (candidato a v2 como isla).
- Analítica con cookies (ver `06-calidad-seo-legal.md`).

## Supuestos y preguntas abiertas

- **Dominio**: ¿subdominio de un dominio propio o `*.vercel.app` al principio? Afecta a `site` en `astro.config.mjs`, canónicas y sitemap.
- **Autoría pública**: ¿firma personal, de webdespega o neutra? Afecta a la página de aviso legal (LSSI-CE art. 10).
- **Licencia del contenido**: propuesta CC BY 4.0 para textos y MIT para fragmentos de código.
