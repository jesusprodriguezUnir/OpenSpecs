# seo Specification

## Purpose

Garantiza las señales básicas que buscadores y lectores de pantalla necesitan en cada página: idioma, título, URL canónica y sitemap.

## Requirements

### Requirement: Idioma del documento
Todas las páginas del sitio construido SHALL declarar `<html lang="es-ES">` y sus URLs MUST NOT llevar prefijo de locale.

#### Scenario: lang es-ES en una página de guía
- **WHEN** se carga `/empieza/que-es/`
- **THEN** el elemento `<html>` tiene `lang="es-ES"`

#### Scenario: lang es-ES en la portada y en la 404
- **WHEN** se cargan `/` y una ruta inexistente
- **THEN** ambas páginas tienen `<html lang="es-ES">`

#### Scenario: URLs sin prefijo de locale
- **WHEN** se solicita `/es-es/empieza/que-es/`
- **THEN** la respuesta tiene estado 404

### Requirement: Título con sufijo del sitio
El `<title>` de cada página de contenido SHALL terminar con el sufijo `| OpenSpec desde cero`.

#### Scenario: Título de una página de guía
- **WHEN** se carga `/guias/formato-de-specs/`
- **THEN** el `<title>` termina en `| OpenSpec desde cero`

### Requirement: URL canónica absoluta
Cada página publicada SHALL incluir `<link rel="canonical">` con una URL absoluta formada por el origen configurado del sitio y la ruta de la página. El origen SHALL tomarse de la variable de entorno `SITE_URL` en build y, si no está definida, SHALL ser `http://localhost:4321`.

#### Scenario: Canónica con SITE_URL definida
- **WHEN** el sitio se construye con `SITE_URL=https://example.org` y se carga `/empieza/instalacion/`
- **THEN** la canónica es `https://example.org/empieza/instalacion/`

#### Scenario: Canónica con SITE_URL ausente
- **WHEN** el sitio se construye sin `SITE_URL` y se carga `/empieza/instalacion/`
- **THEN** la canónica es `http://localhost:4321/empieza/instalacion/`

### Requirement: Sitemap
El build SHALL generar `sitemap-index.xml` cuyo sitemap enlazado incluya la URL absoluta de cada página publicada y MUST NOT incluir la página 404.

#### Scenario: Página de guía presente en el sitemap
- **WHEN** se lee el sitemap enlazado desde `/sitemap-index.xml`
- **THEN** contiene la URL absoluta de `/empieza/primer-cambio/`

#### Scenario: La 404 no aparece en el sitemap
- **WHEN** se lee el sitemap enlazado desde `/sitemap-index.xml`
- **THEN** no contiene ninguna URL que termine en `/404/`

### Requirement: Etiquetas Open Graph
Cada página publicada SHALL incluir `og:title`, `og:description`, `og:url`, `og:type`, `og:locale` con valor `es_ES`, `og:site_name`, `og:image`, `og:image:width`, `og:image:height` y `og:image:alt`. `og:url` SHALL coincidir con la URL canónica. `og:type` SHALL ser `website` en la landing y `article` en el resto de páginas.

#### Scenario: Open Graph completo en una guía
- **WHEN** se carga `/empieza/que-es/`
- **THEN** el `<head>` contiene todas las etiquetas Open Graph requeridas, `og:type` es `article`, `og:locale` es `es_ES` y `og:url` coincide con la canónica

#### Scenario: og:type website en la landing
- **WHEN** se carga `/`
- **THEN** `og:type` es `website`

### Requirement: Imagen Open Graph por sección
`og:image` SHALL ser una URL absoluta formada por el origen configurado del sitio y `/og/<seccion>.png`, donde `<seccion>` es el primer segmento de la ruta. Las páginas sin sección propia (landing, 404) o cuya sección no tenga imagen SHALL usar `/og/default.png`. La imagen referenciada SHALL existir en el sitio construido.

#### Scenario: Imagen de sección en una guía
- **WHEN** la URL de imagen se calcula con origen `https://example.org` para `/guias/formato-de-specs/`
- **THEN** `og:image` es `https://example.org/og/guias.png`

#### Scenario: Imagen por defecto sin sección
- **WHEN** la URL de imagen se calcula para `/` o para una sección sin imagen propia
- **THEN** `og:image` termina en `/og/default.png`

#### Scenario: La imagen OG existe
- **WHEN** se solicita la URL de `og:image` de una página de cada sección
- **THEN** la respuesta tiene estado 200 y tipo `image/png`

### Requirement: Tarjeta de Twitter
Cada página publicada SHALL incluir `<meta name="twitter:card" content="summary_large_image">` y MUST NOT incluir `twitter:site` ni `twitter:creator`.

#### Scenario: Tarjeta grande en una guía
- **WHEN** se carga `/empieza/que-es/`
- **THEN** `twitter:card` es `summary_large_image` y no hay `twitter:site` ni `twitter:creator`

### Requirement: JSON-LD WebSite en la landing
La landing SHALL incluir un bloque `application/ld+json` de tipo `WebSite` con `name`, `url` (origen configurado) e `inLanguage` `es-ES`. Las demás páginas MUST NOT incluir `WebSite`.

#### Scenario: WebSite en la landing
- **WHEN** se carga `/`
- **THEN** hay un JSON-LD de tipo `WebSite` con `inLanguage` `es-ES` y `url` igual al origen del sitio

#### Scenario: Sin WebSite en una guía
- **WHEN** se carga `/empieza/que-es/`
- **THEN** ningún JSON-LD es de tipo `WebSite`

### Requirement: JSON-LD TechArticle en guías y referencia
Cada página bajo `/empieza/`, `/guias/`, `/agentes/`, `/equipo/` y `/referencia/` SHALL incluir un JSON-LD de tipo `TechArticle` con `headline` (título de la página), `description`, `url` (canónica), `inLanguage` `es-ES` y `dateModified` igual a `lastReviewed` en formato `YYYY-MM-DD`. MUST NOT incluir `datePublished`. Las páginas fuera de esas secciones MUST NOT incluir `TechArticle`.

#### Scenario: TechArticle con dateModified de lastReviewed
- **WHEN** se genera el JSON-LD de una guía con `lastReviewed: 2026-09-15`
- **THEN** el `TechArticle` tiene `dateModified` `2026-09-15`, `inLanguage` `es-ES` y no tiene `datePublished`

#### Scenario: TechArticle en una página de referencia
- **WHEN** se carga una página bajo `/referencia/`
- **THEN** hay un JSON-LD de tipo `TechArticle` cuyo `url` coincide con la canónica

#### Scenario: Sin TechArticle fuera de guías
- **WHEN** se carga `/recursos/`
- **THEN** ningún JSON-LD es de tipo `TechArticle`

### Requirement: JSON-LD BreadcrumbList
Cada página de contenido excepto la landing y la 404 SHALL incluir un JSON-LD de tipo `BreadcrumbList` cuyo primer elemento sea "Inicio" con la URL del origen, seguido de la sección y, si la página no es una página de primer nivel, de la propia página, con `position` consecutivas desde 1 y URLs absolutas. La URL de la miga de sección SHALL ser la de la primera página de la sección según el orden de la navegación lateral, nunca una ruta `/<seccion>/` inexistente. Toda URL de las migas SHALL existir en el sitio construido.

#### Scenario: Migas de una guía
- **WHEN** se genera el `BreadcrumbList` de `/guias/formato-de-specs/`
- **THEN** tiene tres elementos en orden: "Inicio", la sección de guías y la página, con posiciones 1, 2 y 3, y la URL de la sección es la de la primera página de la sección según el orden de la navegación lateral

#### Scenario: Las URLs de las migas existen
- **WHEN** se solicitan las URLs de todas las migas de una página de cada sección
- **THEN** todas responden con estado 200

#### Scenario: Migas de una página de primer nivel
- **WHEN** se genera el `BreadcrumbList` de `/recursos/`
- **THEN** tiene dos elementos: "Inicio" y la página, con posiciones 1 y 2

#### Scenario: Sin migas en la landing y la 404
- **WHEN** se cargan `/` y una ruta inexistente
- **THEN** ninguna de las dos incluye JSON-LD de tipo `BreadcrumbList`

### Requirement: robots.txt
El build SHALL generar `/robots.txt` que permita el rastreo de todo el sitio (`User-agent: *` y `Allow: /`) y contenga la línea `Sitemap:` con la URL absoluta de `sitemap-index.xml` formada con el origen configurado.

#### Scenario: robots.txt permite todo
- **WHEN** se solicita `/robots.txt`
- **THEN** la respuesta tiene estado 200 y contiene `User-agent: *` y `Allow: /`

#### Scenario: Sitemap con SITE_URL definida
- **WHEN** el contenido de `robots.txt` se genera con origen `https://example.org`
- **THEN** contiene `Sitemap: https://example.org/sitemap-index.xml`

#### Scenario: Sitemap con SITE_URL ausente
- **WHEN** el sitio se construye sin `SITE_URL` y se solicita `/robots.txt`
- **THEN** contiene `Sitemap: http://localhost:4321/sitemap-index.xml`

### Requirement: Sin JavaScript de cliente añadido por SEO
Las etiquetas sociales y los datos estructurados MUST NOT añadir scripts ejecutables: todo `<script>` añadido por este requisito SHALL ser de tipo `application/ld+json`.

#### Scenario: Solo scripts JSON-LD añadidos
- **WHEN** se comparan los scripts de `/empieza/que-es/` excluyendo los de tipo `application/ld+json` con los de una página equivalente antes del change
- **THEN** no hay ningún script ejecutable adicional
