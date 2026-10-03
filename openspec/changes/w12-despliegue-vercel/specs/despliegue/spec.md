# Spec Delta

## Purpose
Define el comportamiento observable del sitio desplegado en Vercel: cabeceras HTTP de seguridad, política de caché, redirecciones y entornos de producción y de preview por PR.

## ADDED Requirements

### Requirement: Cabeceras de seguridad
Toda respuesta del sitio desplegado SHALL incluir las cabeceras `Content-Security-Policy`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff` y `X-Frame-Options: DENY`.

#### Scenario: Cabeceras de seguridad en una página
- **WHEN** se solicita la portada `/`
- **THEN** la respuesta incluye las cinco cabeceras de seguridad con los valores definidos

#### Scenario: Cabeceras de seguridad en una ruta inexistente
- **WHEN** se solicita una ruta que no existe
- **THEN** la respuesta es 404 y también incluye las cinco cabeceras de seguridad

#### Scenario: Cabeceras de seguridad en un recurso estático
- **WHEN** se solicita un recurso bajo `/_astro/`
- **THEN** la respuesta incluye las cinco cabeceras de seguridad

### Requirement: Política de seguridad de contenido
La `Content-Security-Policy` SHALL limitar todos los orígenes a `'self'`, MUST incluir `frame-ancestors 'none'`, `object-src 'none'` y `base-uri 'self'`, y MUST permitir lo que necesitan Starlight y Pagefind (scripts en línea y `'wasm-unsafe-eval'`) sin admitir ningún origen de terceros.

#### Scenario: CSP sin orígenes de terceros
- **WHEN** se inspecciona la cabecera `Content-Security-Policy`
- **THEN** ninguna directiva contiene orígenes distintos de `'self'`, de `data:` (solo en `img-src` y `font-src`), de `blob:` (solo en `worker-src`) o de palabras clave CSP

#### Scenario: CSP impide el embebido
- **WHEN** se inspecciona la cabecera `Content-Security-Policy`
- **THEN** contiene `frame-ancestors 'none'`, `object-src 'none'` y `base-uri 'self'`

#### Scenario: La búsqueda funciona con la CSP activa
- **WHEN** en el sitio desplegado se abre la búsqueda y se escribe un término existente
- **THEN** aparecen resultados y la consola no registra violaciones de CSP

### Requirement: HSTS sin preload
`Strict-Transport-Security` SHALL tener un `max-age` de al menos 31536000 segundos e incluir `includeSubDomains`, y MUST NOT incluir `preload` mientras el sitio se sirva en `*.vercel.app`.

#### Scenario: HSTS con max-age suficiente
- **WHEN** se inspecciona la cabecera `Strict-Transport-Security`
- **THEN** `max-age` es mayor o igual que 31536000 e incluye `includeSubDomains`

#### Scenario: HSTS sin preload
- **WHEN** se inspecciona la cabecera `Strict-Transport-Security`
- **THEN** no contiene la directiva `preload`

### Requirement: Caché de recursos con hash
Las respuestas bajo `/_astro/` SHALL incluir `Cache-Control: public, max-age=31536000, immutable`, y las páginas HTML MUST NOT declararse `immutable`.

#### Scenario: Recursos con hash inmutables
- **WHEN** se solicita un recurso bajo `/_astro/`
- **THEN** `Cache-Control` es `public, max-age=31536000, immutable`

#### Scenario: HTML no inmutable
- **WHEN** se solicita la portada `/`
- **THEN** `Cache-Control` no contiene `immutable`

### Requirement: Redirecciones permanentes y válidas
Toda redirección declarada en la configuración de despliegue SHALL ser permanente (308) y MUST apuntar a una ruta que exista en el resultado del build.

#### Scenario: Redirecciones permanentes
- **WHEN** se inspeccionan las redirecciones declaradas
- **THEN** todas son permanentes

#### Scenario: Redirección con destino inexistente
- **WHEN** una redirección apunta a una ruta que no existe en `dist/`
- **THEN** la validación falla e identifica la redirección inválida

#### Scenario: Sin redirecciones declaradas
- **WHEN** la configuración no declara redirecciones
- **THEN** la validación pasa

### Requirement: Despliegue estático y previews por PR
El sitio SHALL desplegarse como salida estática sin adapter, construida con `npm run build` desde `dist/`, y cada PR MUST obtener un despliegue de preview propio.

#### Scenario: Configuración de build estática
- **WHEN** se inspecciona la configuración de despliegue
- **THEN** el comando de build es `npm run build`, el directorio de salida es `dist` y no hay funciones de servidor

#### Scenario: Preview por PR
- **WHEN** se abre una PR contra `main`
- **THEN** Vercel publica un despliegue de preview con URL propia enlazado en la PR
