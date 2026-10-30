# Tasks

## 0. Requisito previo

- [ ] 0.1 Archivar `w15-infografia-sdd` (cerrar su tarea 5.2) en su propia rama antes de aplicar este change; verificar que `openspec/specs/landing/spec.md` contiene «Infografía del método en la landing»

## 1. Captura de la instantánea (manual, autor)

- [ ] 1.1 En un directorio temporal fuera del repo, con `@fission-ai/openspec@1.14.0` y Claude Code, seguir `/empieza/primer-cambio/` al pie de la letra (mismo requisito de cancelación de reservas); copiar `openspec/` tras `/opsx:propose` a `examples/reservas-demo/propuesta/openspec/` y tras `/opsx:archive` a `examples/reservas-demo/archivado/openspec/`; verificar que ambos árboles coinciden con D1
- [ ] 1.2 Crear `examples/reservas-demo/captura.json` con `openspecVersion`, `agent` y `capturedAt` (ISO 8601); verificar que el JSON parsea y que la versión es `1.14.0`
- [ ] 1.3 Añadir a `CLAUDE.md` una línea que indique que `examples/` es contenido de ejemplo y solo se toca para recapturar; verificar que el fichero sigue por debajo de su tamaño actual más una línea

## 2. Validación de la instantánea

- [ ] 2.1 Crear `tests/ejemplo/ejemplo-reservas.test.ts` con los tests «Scenario: Instantánea válida» (ambos estados) y «Scenario: Instantánea inválida» (copia temporal sin un `#### Scenario:`); añadir `test:ejemplo` a `package.json` y excluir `tests/ejemplo` del `include` por defecto de Vitest; verificar con `npm run test:ejemplo` en verde y `npm run test` sin ejecutarlo
- [ ] 2.2 Añadir `npm ci` y `npm run test:ejemplo` al job `openspec` de `.github/workflows/ci.yml`; verificar que el YAML es válido y que el paso usa la versión de `OPENSPEC_VERSION`
- [ ] 2.3 Añadir en `tests/unit/` el test «Scenario: Versión de procedencia distinta de la página», que compare `captura.json.openspecVersion` con el frontmatter de `primer-cambio.mdx` y falle mostrando ambas versiones; verificar con `npx vitest run tests/unit/<fichero>`

## 3. Tokens compartidos de infografía

- [ ] 3.1 Mover los tokens `--ig-*` de `src/components/InfografiaSdd.astro` a `src/styles/infografia.css` e importarlo desde el componente; verificar que los E2E de la infografía de w15 en `tests/e2e/landing.spec.ts` y `tests/e2e/manual.spec.ts` siguen en verde

## 4. Infografía «Ciclo de vida de OpenSpec»

- [ ] 4.1 Crear `src/components/CicloDeVida.astro` con las seis etapas de D6 (`figure` con nombre accesible, datos tipados en el frontmatter, SVG con `aria-hidden="true"`, `break-inside: avoid` al imprimir, sin `<script>`) e insertarlo tras «Antes de empezar» en `primer-cambio.mdx`
- [ ] 4.2 E2E en `tests/e2e/empieza.spec.ts`: «Scenario: Etapas en orden», «Scenario: Entrada, salida y criterio por etapa» y «Scenario: Comando inexistente en la figura» (reutilizando `undocumentedCommands`); verificar con `npx playwright test tests/e2e/empieza.spec.ts`

## 5. Infografía «Anatomía de un change»

- [ ] 5.1 Crear `src/components/AnatomiaChange.astro` (ficheros del change con su función y la cadena Requisito → Escenario → Tarea → Test; mismas pautas que 4.1) e insertarlo al principio del paso 2 de `primer-cambio.mdx`
- [ ] 5.2 E2E: «Scenario: Ficheros del change» y «Scenario: Cadena de trazabilidad»; verificar con `npx playwright test tests/e2e/empieza.spec.ts`

## 6. Artefactos en el tutorial

- [ ] 6.1 En `primer-cambio.mdx`, importar con `?raw` los cuatro artefactos de `propuesta/` y la spec principal de `archivado/`, y mostrarlos con `<Code lang="md" title="openspec/…">` en los pasos 2 y 4 (D2), con el texto «Compara con lo que te ha generado tu agente»; mantener `duration: 30` y los encabezados de paso
- [ ] 6.2 Añadir antes del primer artefacto un `Aside` de procedencia alimentado por `captura.json` (D3)
- [ ] 6.3 Escribir una nota «Qué mirar» tras cada artefacto, con al menos un enlace interno a una página de concepto (`/empieza/conceptos/`, `/guias/formato-de-specs/`, `/guias/flujo-opsx/`…)
- [ ] 6.4 E2E: «Scenario: Artefactos del paso de propuesta», «Scenario: Spec principal tras archivar», «Scenario: Bloques copiables», «Scenario: Página fiel a la instantánea» (compara el texto del bloque con el fichero leído del disco), «Scenario: Aviso de procedencia», «Scenario: Nota tras cada artefacto» y «Scenario: Enlaces de las notas válidos»; verificar con `npx playwright test tests/e2e/empieza.spec.ts`

## 7. Accesibilidad, JS y manual

- [ ] 7.1 E2E: «Scenario: Contenido como texto», «Scenario: Iconos decorativos ocultos», «Scenario: Sin desbordamiento a 360 px» y «Scenario: Sin JavaScript añadido» para `/empieza/primer-cambio/`; verificar con Playwright
- [ ] 7.2 Test de axe «Scenario: Sin violaciones de accesibilidad» en modo claro y oscuro para `/empieza/primer-cambio/` (helper `tests/e2e/axe.ts`); verificar con Playwright
- [ ] 7.3 E2E en `tests/e2e/manual.spec.ts`: «Scenario: Figuras sin cortes al imprimir» con emulación de impresión A4; verificar con Playwright
- [ ] 7.4 Regenerar `public/manual-openspec.pdf` con `npm run manual:pdf`; verificar que `npm run manual:check` pasa

## 8. Verificación final

- [ ] 8.1 `npm run build`, `npx astro check`, `npm run test`, `npm run test:e2e`, `npm run test:ejemplo` y `openspec validate --all --strict --no-interactive` en verde; revisar la preview en 360 px y en escritorio
