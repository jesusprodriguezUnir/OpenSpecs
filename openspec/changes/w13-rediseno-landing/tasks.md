## 1. Fuentes y tokens

- [x] 1.1 Instalar `@fontsource/ibm-plex-sans` y `@fontsource/ibm-plex-mono` con versión exacta; importar solo los CSS `latin` de los pesos de D3 y apuntar `--sl-font` / `--sl-font-mono` a Plex con fallback de sistema
- [x] 1.2 Añadir preload del woff2 de Plex Sans 700 para el `h1`
- [x] 1.3 Tests E2E "Scenario: Fuentes servidas desde el propio sitio" y "Scenario: Sin Google Fonts"
- [x] 1.4 Tokens de landing (`--landing-bg`, `--landing-surface`) y estilos CSS de la cabecera nativa (D5) en `src/styles/custom.css`

## 2. Hero y terminal

- [x] 2.1 Crear `src/components/overrides/Hero.astro` (D1) y registrarlo en `astro.config.mjs`; hero a dos columnas con antetítulo, `h1` en dos líneas, tagline y CTA del frontmatter
- [x] 2.2 Terminal decorativa con `aria-hidden="true"` y animación solo CSS de una pasada (D2), con opacidad inicial solo bajo `prefers-reduced-motion: no-preference`
- [x] 2.3 Comprobar que siguen en verde "Scenario: CTA primario al primer cambio", "Scenario: CTA secundario a qué es OpenSpec" y "Scenario: Destinos de los CTA existen"
- [x] 2.4 Tests E2E "Scenario: Terminal oculta a tecnologías de apoyo" y "Scenario: Terminal visible con JavaScript desactivado"

## 3. Cuerpo de la landing

- [x] 3.1 Crear `CicloPasos.astro` (lista ordenada con nombre accesible y paso activo animado por CSS) y sustituir `CicloOpsx` en `index.mdx`; borrar `CicloOpsx.astro` si no tiene más usos
- [x] 3.2 Tests E2E "Scenario: Cuatro pasos en orden" y "Scenario: Cada paso tiene descripción"; eliminar los tests del SVG retirado
- [x] 3.3 Convertir "Qué es OpenSpec en 3 frases" en lista numerada de tres elementos y adaptar "Scenario: Tres frases bajo el encabezado"
- [x] 3.4 Crear `Recorridos.astro` (orden Equipo, Inicio, Consulta; badge "Recomendado") y sustituir `CardGrid`
- [x] 3.5 Adaptar "Scenario: Recorridos con su destino" y "Scenario: Consulta menciona la búsqueda"; añadir "Scenario: Equipo marcado como recomendado"

## 4. Movimiento, JS y accesibilidad

- [x] 4.1 Test E2E "Scenario: Sin animaciones con prefers-reduced-motion" (emulando `reducedMotion: 'reduce'` y comprobando `getAnimations()` vacío y líneas visibles)
- [x] 4.2 Comprobar que siguen en verde "Scenario: Mismos scripts que una guía" y "Scenario: Script extra detectado"
- [x] 4.3 Test "Scenario: La landing en tema claro sin violaciones graves" en `tests/e2e/accesibilidad.spec.ts` y verde en "Scenario: La landing sin violaciones graves de accesibilidad"
- [ ] 4.4 Revisión visual en el preview de Vercel frente a la opción 1a (escritorio y 375 px, ambos temas) y comprobación de LCP < 2,0 s y CLS < 0,05 con Lighthouse

## 5. Cierre

- [x] 5.1 `npm run build`, `npx astro check` y `openspec validate --all --strict --no-interactive` en verde
