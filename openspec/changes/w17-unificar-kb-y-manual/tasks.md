# Tasks

## 1. Sincronizar la base de conocimiento

- [x] 1.1 Copiar desde el proyecto OpenSpecs de claude.ai a `docs/openspec-kb/` los ficheros `11-skills-mattpocock.md` y `12-roberto-canales-libro-sdd.md` y las versiones actuales de 00, 02, 09 y 10; verificar con `git diff --stat docs/openspec-kb` que solo cambian esos seis
- [x] 1.2 Añadir en `docs/openspec-kb/00-indice-y-guia-notebooklm.md` la nota de edición canónica (D1) y escribir la misma nota en el proyecto de claude.ai
- [x] 1.3 Añadir las dos filas nuevas al mapa del sitio en `docs/proyecto/03-arquitectura-de-informacion.md` (fuentes 11 y 12) y la regla de sincronización de D7 en `docs/proyecto/05-convenciones.md`

## 2. Página Gobierno del cambio

- [x] 2.1 Crear `src/content/docs/equipo/gobierno.mdx` (frontmatter completo, `level: avanzado`, `sidebar.order: 4`) con estas secciones: espectro de autoridad (tabla), «Detección temprana frente a verja», reparto de papeles, cierre calculado y matriz de cobertura, «Lo que OpenSpec deja fuera» (tabla Carencia | Cómo cubrirla), «Para saber más» y «Siguiente paso» → `/equipo/adopcion/`; ejemplos en el dominio de reservas (D3)
- [x] 2.2 Cambiar `sidebar.order` de `equipo/adopcion.mdx` a 5 y el «Siguiente paso» de `equipo/ci.mdx` a `/equipo/gobierno/`
- [x] 2.3 E2E en `tests/e2e/agentes-equipo.spec.ts`: «Scenario: Espectro de autoridad», «Scenario: Carencias de OpenSpec con su cobertura», «Scenario: Verja diferenciada del hook» y «Scenario: Términos enlazados al glosario»; verificar con `npx playwright test tests/e2e/agentes-equipo.spec.ts`

## 3. Página Skills complementarias

- [x] 3.1 Crear `src/content/docs/agentes/skills.mdx` (`level: intermedio`, `sidebar.order: 3`) con: qué es una skill y sus dos tipos, la tabla Fase | Skill | Veredicto, conflictos antes de instalar, la instalación como ficheros (`<Tabs syncKey="shell">`), un Aside con «cadena de suministro» y fecha de contraste, y «Siguiente paso» → `/equipo/jira/`
- [x] 3.2 Cambiar el «Siguiente paso» de `agentes/otros.mdx` a `/agentes/skills/`
- [x] 3.3 Añadir en `src/lib/content-rules.ts` la lista de veredictos permitidos y una función que valide las filas de la tabla. Tests unitarios: «Scenario: Valor de veredicto no permitido», que falla mostrando la skill y el valor recibido
- [x] 3.4 E2E: «Scenario: Tabla de mapeo con veredicto», «Scenario: Aviso de cadena de suministro», «Scenario: Skills solapadas marcadas como No usar» y «Scenario: Skills enlaza a Jira»

## 4. Navegación de Con tu agente y En equipo

- [x] 4.1 Ampliar `AGENTES`, `EQUIPO` y `tests/e2e/site-map.ts` con las dos rutas nuevas, y actualizar los tests «Scenario: Agentes y equipo sin marcadores de preparación», «Scenario: Orden de las páginas de Con tu agente», «Scenario: Orden de las páginas de En equipo», «Scenario: Cadena de Siguiente paso en agentes y equipo» y «Scenario: Adopción enlaza a comandos de chat»; verificar que los tests de accesibilidad cubren las páginas nuevas

## 5. Páginas existentes

- [x] 5.1 `equipo/adopcion.mdx`: actualizar las fases 1 y 3 (skills, verja, CODEOWNERS), la DoD (tests en rojo, tabla del verificador, verde en la pipeline), la métrica de omisiones, el criterio de corte, los riesgos nuevos (D2) y el checklist (skills como ficheros, glosario único); actualizar `lastReviewed`
- [x] 5.2 `referencia/faq.mdx`: añadir las cinco preguntas nuevas; las dos de gobierno enlazan a `/equipo/gobierno/` y las tres de skills a `/agentes/skills/`
- [x] 5.3 `referencia/glosario.mdx`: añadir la subsección «Gobierno del cambio» con los seis términos (D4)
- [x] 5.4 `src/data/resources.yaml`: añadir `mattpocock-skills` (comunidad, en) y `roberto-canales-libro-sdd` (comunidad, es)
- [x] 5.5 E2E: «Scenario: Tests en rojo en la DoD», «Scenario: Riesgos nuevos en adopción», «Scenario: Preguntas de gobierno en la FAQ», «Scenario: Anclas de gobierno», «Scenario: Recursos complementarios listados» y «Scenario: Recurso en español marcado»

## 6. Manual

- [x] 6.1 Actualizar `MANUAL_READING_ROUTE` (D6) y añadir `MANUAL_SOURCES` en `src/config/manual.mjs`
- [x] 6.2 Renderizar el colofón en `src/pages/manual.astro`, con estilos de pantalla e impresión (D5) y su entrada sin número en el índice
- [x] 6.3 E2E en `tests/e2e/manual.spec.ts`: «Scenario: Colofón al final del manual», «Scenario: Ficha de edición coherente con la portada», «Scenario: Edición en línea y fuentes» y «Scenario: Colofón sin numerar»; verificar que siguen en verde «Scenario: Manual con todas las páginas en orden del sidebar» y «Scenario: Numeración de capítulos y anexos»
- [x] 6.4 Ejecutar `npm run manual:pdf`; abrir el PDF y revisar a ojo la portada, el índice, los dos capítulos nuevos, las tablas anchas y el colofón (sin cortes ni desbordes); comprobar después `npm run manual:check` en verde

## 7. Cierre

- [ ] 7.1 Ejecutar `npm run links` sin enlaces rotos (pendiente: `lychee` no está instalado en el entorno de apply; se ejecuta en local o en CI)
- [x] 7.2 Tarea final obligatoria: `npm run build`, `npx astro check`, `npm run test` y `openspec validate --all --strict --no-interactive` en verde
- [ ] 7.3 Pasar el subagente `spec-verifier`: ningún Scenario sin test

> Nota de apply (30/10/2026): comprobación manual previa al verificador, los 24 escenarios del delta tienen un test con `Scenario: <nombre>`; build, `astro check`, 82 unitarios, 157 E2E y `openspec validate --all --strict` en verde. El colofón usa `MANUAL_ONLINE_URL` fija para que la huella del PDF no dependa de `SITE_URL`.
