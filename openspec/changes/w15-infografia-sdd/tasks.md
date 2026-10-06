# Tasks

## 1. Contenido verificado de la infografía

- [x] 1.1 Redactar en `src/components/InfografiaSdd.astro` el array tipado de los cuatro bloques (título, textos, enlaces y marca `extended` para comandos del perfil ampliado), contrastando cada afirmación con las fuentes de la tabla D7 del design. Verificación: cada texto tiene una página de origen anotada en un comentario del array y ninguna cadena contiene «.NET» ni «Angular»
- [x] 1.2 Confirmar con `openspec --help` y `/referencia/comandos-chat/` los comandos y rutas citados (`/opsx:explore|propose|apply|archive`, `/opsx:verify` como perfil ampliado, `openspec validate --all --strict`, `openspec/specs/`, `openspec/changes/`). Verificación: la lista queda reflejada en el array sin comandos adicionales

## 2. Componente de la infografía

- [x] 2.1 Maquetar el `<figure>` con `<figcaption>` «OpenSpec: desarrollo guiado por especificaciones con IA», cuatro `<section>` numeradas con `<h3>` y los iconos SVG en línea (`aria-hidden="true"`, `width`/`height` fijos), con la paleta papel y los tokens `--ig-*` de D3 y la rejilla responsive de D4. Verificación: `npm run dev` y revisión visual a 360 px, 800 px y 1280 px frente a la referencia
- [x] 2.2 Comprobar el contraste de todos los pares texto/fondo (≥ 4,5:1) con axe en ambos temas. Verificación: `tests/e2e/accesibilidad.spec.ts` existente en verde para `/`

## 3. Integración en la landing

- [x] 3.1 Insertar `<InfografiaSdd />` en `src/content/docs/index.mdx` entre «Qué es OpenSpec en 3 frases» y «El ciclo de trabajo». Verificación: `npm run build` en verde
- [x] 3.2 E2E en `tests/e2e/landing.spec.ts`: «Scenario: Infografía tras el bloque de tres frases», «Scenario: Contenido como texto y no como imagen», «Scenario: Cuatro bloques en orden», «Scenario: Cada bloque enlaza a una guía existente»
- [x] 3.3 E2E en `tests/e2e/landing.spec.ts`: «Scenario: Comandos /opsx documentados» (extrae `/opsx:<nombre>` de la figura y lo busca en `/referencia/comandos-chat/` como comando o como workflow del perfil ampliado), «Scenario: Comando inexistente detectado» (prueba la función de comprobación con una cadena falsa, sin modificar el componente), «Scenario: Comando del perfil ampliado marcado», «Scenario: Rutas y artefactos correctos» y «Scenario: Sin referencias a un stack concreto»
- [x] 3.4 E2E en `tests/e2e/landing.spec.ts`: «Scenario: Sin desbordamiento horizontal a 360 px» y «Scenario: Iconos decorativos ocultos a tecnologías de apoyo». Verificación: el escenario existente «Mismos scripts que una guía» sigue en verde (sin JS nuevo)

## 4. Integración en el manual

- [x] 4.1 Añadir en `src/pages/manual.astro` la sección `data-manual-infografia` entre la portada y «Cómo usar este manual», con `break-before`/`break-after: page`, `print-color-adjust: exact` y escala reducida (`--ig-scale`) para A4 vertical. Recurrir a la página apaisada con nombre solo si no cabe (D6)
- [x] 4.2 E2E en `tests/e2e/manual.spec.ts`: «Scenario: Infografía tras la portada» e «Scenario: Infografía en una página propia al imprimir» (con `page.emulateMedia({ media: 'print' })`, comprobando los saltos calculados y que la altura sea ≤ 297 mm − márgenes). Verificación: los escenarios existentes del manual siguen en verde
- [x] 4.3 Regenerar el PDF con `npm run manual:pdf` y revisar visualmente la página 2 (infografía completa, colores, sin cortes). Verificación: `npm run manual:check` en verde con el nuevo hash

## 5. Cierre

- [x] 5.1 Lighthouse local sobre `/` (rendimiento y accesibilidad ≥ 95, CLS < 0,05). Verificación: anotar las cifras en la PR
- [ ] 5.2 `npm run build`, `npx astro check`, `npm run test`, `npm run test:e2e` y `openspec validate --all --strict --no-interactive` en verde
