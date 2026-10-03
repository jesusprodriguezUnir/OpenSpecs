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
