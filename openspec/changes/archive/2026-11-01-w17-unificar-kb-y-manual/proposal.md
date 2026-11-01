Fuera de roadmap: petición del autor de unificar la base de conocimiento del proyecto (13 documentos, `openspec-kb/`) con la web y su manual en PDF, para tener una única edición profesional.

# Proposal

## Why

Hoy conviven dos «manuales» que ya no dicen lo mismo:

- **La web y su PDF** (`/manual/` y `/manual-openspec.pdf`, generados desde las MDX). Son la edición pública, pero se construyeron a partir de la base de conocimiento cuando tenía 11 ficheros (00–10).
- **La base de conocimiento** del proyecto en claude.ai (fuente del cuaderno de NotebookLM). Ha crecido a 13 ficheros: `11-skills-mattpocock.md` y `12-roberto-canales-libro-sdd.md` son nuevos, y 00, 02, 09 y 10 se han actualizado. La copia de `docs/openspec-kb/` del repositorio está desfasada respecto a ella.

Por eso el PDF no recoge dos bloques que ahora son centrales en el plan de adopción: el **gobierno del cambio** (espectro de autoridad de la spec, «verja», cierre calculado, qué deja fuera OpenSpec y cómo cubrirlo) y las **skills complementarias** (qué skills de Matt Pocock enchufar alrededor de `/opsx:*` y cuáles no). Además, adopción, FAQ, glosario y recursos tienen huecos frente a la base de conocimiento.

## What Changes

- **Una sola fuente de verdad.** La web es la edición canónica. El PDF sigue saliendo de ella, y `docs/openspec-kb/` se sincroniza con los 13 ficheros del proyecto y pasa a ser material de trabajo, no contenido publicado. El índice de la base de conocimiento remite a la web como edición canónica.
- **Página nueva `/equipo/gobierno/` · «Gobierno del cambio»**, situada entre CI y Plan de adopción:
  - el espectro de autoridad de la spec (*spec-first*, *spec-anchored* y *spec-as-source*) y dónde se sitúa OpenSpec;
  - la diferencia entre detección temprana (hook `Stop`) y verja (Build Validation obligatoria), y el trinquete;
  - el reparto de papeles: el agente propone, la persona ratifica y el programa comprueba;
  - el cierre calculado y la matriz de cobertura Requirement → Scenario → Test;
  - la tabla «Lo que OpenSpec deja fuera», con la forma de cubrir cada carencia (CODEOWNERS, permisos `deny`, revisión de significado).
- **Página nueva `/agentes/skills/` · «Skills complementarias»**, tras «Otros agentes»: los dos tipos de skill, el mapeo fase a fase con veredicto (adoptar, probar, inspirarse, no usar), los conflictos que hay que resolver antes de instalar, la instalación como ficheros versionados y un aviso de cadena de suministro.
- **Páginas existentes actualizadas** con lo que añade la base de conocimiento:
  - `/equipo/adopcion/`: fases con skills y verja, DoD con tests vistos en rojo y tabla del verificador, métrica de omisiones, riesgos nuevos y checklist de arranque.
  - `/referencia/faq/`: cinco preguntas nuevas.
  - `/referencia/glosario/`: seis términos nuevos con ancla estable.
  - `/recursos/`: dos recursos nuevos en la colección.
- **Manual más profesional:**
  - la ruta de lectura incluye las dos páginas nuevas;
  - un **colofón** final con la ficha de la edición (versión de OpenSpec de referencia, mes de revisión y URL de la edición en línea) y las fuentes principales;
  - el PDF y su huella se regeneran.
- Los textos se adaptan a las reglas editoriales del sitio: ejemplos en el dominio neutro de reservas, sin referencias internas al stack del autor ni a «fichero NN» de la base de conocimiento.
- No añade JavaScript de cliente, terceros ni almacenamiento en el navegador. No hay impacto LSSI-CE/RGPD.

## Capabilities

### New Capabilities

Ninguna. Todo encaja en el dominio permitido `contenido`.

### Modified Capabilities

- `contenido`:
  - se amplían las páginas, el orden y la cadena «Siguiente paso» de Con tu agente y En equipo;
  - se añaden requisitos para Gobierno del cambio, Skills complementarias, los términos de gobierno del glosario, los recursos complementarios, el contenido incorporado de la base de conocimiento y el colofón del manual.

## Fuera de alcance

- Cambiar la infografía de w15 o los enlaces «Amplía» de la landing para apuntar a las páginas nuevas. Sería un change posterior sobre `landing`.
- Generar la base de conocimiento automáticamente a partir de las MDX, o al revés. La sincronización es manual y está documentada en `design.md`.
- Reproducir el documento de Roberto Canales o el catálogo completo de skills. Solo se resume y se enlaza a la fuente.
- Instalar skills de Matt Pocock en este repositorio.
- Versión en inglés.
- El caso completo de reservas (`w16-caso-completo-reservas`), que sigue su curso por separado.

## Impact

- Contenido: 2 MDX nuevas (`src/content/docs/agentes/skills.mdx` y `src/content/docs/equipo/gobierno.mdx`); se modifican `equipo/adopcion.mdx` (`sidebar.order` pasa de 4 a 5), `equipo/ci.mdx` y `agentes/otros.mdx` («Siguiente paso»), `referencia/faq.mdx` y `referencia/glosario.mdx`.
- Datos: `src/data/resources.yaml` (+2 entradas); `src/config/manual.mjs` (ruta de lectura y fuentes del colofón).
- Manual: `src/pages/manual.astro` (sección de colofón); `public/manual-openspec.pdf`, `public/manual-openspec.sha256` y `src/data/manual.json` se regeneran.
- Documentación del repo:
  - `docs/openspec-kb/`: se añaden 11 y 12 y se actualizan 00, 02, 09 y 10;
  - `docs/proyecto/03-arquitectura-de-informacion.md`: el mapa del sitio gana dos filas;
  - en claude.ai se actualiza el índice del proyecto OpenSpecs.
- Tests:
  - `tests/e2e/agentes-equipo.spec.ts`, `referencia-recursos.spec.ts`, `manual.spec.ts` y `site-map.ts` se amplían;
  - los tests de accesibilidad cubren las páginas nuevas porque recorren el mapa del sitio.
- Sin dependencias nuevas.
- Orden con w16: los dos regeneran el PDF. El que se fusione en segundo lugar lo regenera sobre `main` (lo exige `manual:check`).

## Preguntas abiertas

- ¿Se cita a Roberto Canales y a Matt Pocock por su nombre en los títulos de sección? Se propone citarlos en el texto y en Recursos, con títulos temáticos («Gobierno del cambio», «Skills complementarias») que no envejezcan si cambian las fuentes.
- El veredicto por skill (adoptar, probar, no usar) es criterio del autor. ¿Se publica tal cual o se presenta como «recomendación para un piloto»? Se propone la segunda opción, con un aviso de fecha de revisión, porque el repositorio de skills cambia a menudo.
- ¿Debe el colofón incluir la huella SHA-256 del contenido? Se propone que no, porque en un documento impreso no aporta al lector. Basta con versión y fecha.
