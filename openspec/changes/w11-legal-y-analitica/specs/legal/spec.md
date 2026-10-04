# Spec Delta

## Purpose

Cumplimiento legal observable del sitio: crédito de autoría, información de privacidad accesible desde todas las páginas, analítica sin cookies y ausencia de cookies y de almacenamiento no exento en el navegador.

## ADDED Requirements

### Requirement: Crédito de autoría
El pie de toda página publicada SHALL incluir una única vez el texto "Diseño y desarrollo web:" seguido de un enlace con texto `webdespega.com` a `https://webdespega.com/`, con `target="_blank"` y `rel="noopener"`. El enlace MUST NOT llevar `nofollow` ni `sponsored`. El sitio MUST NOT publicar una página de aviso legal propia.

#### Scenario: Crédito en el pie
- **WHEN** se carga `/empieza/que-es/`
- **THEN** el `footer` contiene exactamente un enlace a `https://webdespega.com/` con texto `webdespega.com`, `target="_blank"` y `rel="noopener"`

#### Scenario: Crédito sin nofollow
- **WHEN** se inspecciona el enlace del crédito
- **THEN** su atributo `rel` no contiene `nofollow` ni `sponsored`

#### Scenario: Sin página de aviso legal
- **WHEN** se solicita `/legal/aviso-legal/`
- **THEN** la respuesta es 404

### Requirement: Página de política de privacidad
El sitio SHALL publicar `/legal/privacidad/` con secciones para el responsable del tratamiento, los datos tratados (logs del hosting y analítica agregada), la finalidad, la base jurídica, los destinatarios, el plazo de conservación, los derechos de las personas interesadas y las cookies.

#### Scenario: Privacidad publicada con sus secciones
- **WHEN** se solicita `/legal/privacidad/`
- **THEN** la respuesta es 200 y la página contiene un `h2` para cada una de las secciones: "Responsable", "Datos que tratamos", "Finalidad", "Base jurídica", "Destinatarios", "Conservación", "Derechos" y "Cookies"

#### Scenario: Privacidad identifica al responsable
- **WHEN** se inspecciona la sección "Responsable" de `/legal/privacidad/`
- **THEN** nombra a webdespega y enlaza a `https://webdespega.com/` como vía de contacto

### Requirement: Enlace a privacidad en el pie
Toda página publicada SHALL incluir en su pie (`footer`) un enlace a `/legal/privacidad/`. Las páginas legales MUST NOT aparecer en el sidebar.

#### Scenario: Pie con enlace a privacidad en una guía
- **WHEN** se carga `/empieza/que-es/`
- **THEN** el `footer` contiene un enlace a `/legal/privacidad/`

#### Scenario: Pie con enlace a privacidad en la landing
- **WHEN** se carga `/`
- **THEN** el `footer` contiene un enlace a `/legal/privacidad/`

#### Scenario: Pie con enlace a privacidad en la página 404
- **WHEN** se solicita una ruta inexistente
- **THEN** la página de error contiene en el pie un enlace a `/legal/privacidad/`

#### Scenario: Páginas legales fuera del sidebar
- **WHEN** se inspecciona el sidebar de `/empieza/que-es/`
- **THEN** no contiene enlaces a `/legal/`

### Requirement: Analítica sin cookies del mismo origen
Toda página publicada SHALL cargar el script de Vercel Web Analytics desde `/_vercel/insights/script.js`, con `defer`. El sitio MUST NOT cargar scripts de analítica desde otros orígenes.

#### Scenario: Script de analítica en una página
- **WHEN** se inspecciona el HTML de `/empieza/que-es/`
- **THEN** contiene exactamente un `<script>` con `src="/_vercel/insights/script.js"` y el atributo `defer`

#### Scenario: Sin scripts externos
- **WHEN** se inspeccionan los `<script src>` de cualquier página del mapa del sitio, de la landing y de la página de privacidad
- **THEN** ninguno apunta a un origen distinto del propio sitio

### Requirement: Sin cookies ni almacenamiento no exento
Ninguna página publicada SHALL establecer cookies, ni por cabecera `Set-Cookie` ni desde JavaScript. El sitio MAY escribir solo almacenamiento técnico de Starlight: la preferencia de tema en `localStorage` (`starlight-theme`) y el estado del sidebar en `sessionStorage` (`sl-sidebar-state`). MUST NOT escribir ninguna otra clave en ninguno de los dos, ni nada en IndexedDB. Por eso el sitio MUST NOT mostrar un banner de consentimiento.

#### Scenario: Ninguna página establece cookies
- **WHEN** se visitan la landing, todas las páginas del mapa del sitio y la página de privacidad en un contexto de navegador limpio
- **THEN** el contexto no tiene ninguna cookie y ninguna respuesta incluye la cabecera `Set-Cookie`

#### Scenario: Cookies tras interactuar con búsqueda y tema
- **WHEN** en un contexto limpio se abre la búsqueda, se busca un término existente y se cambia el tema
- **THEN** el contexto sigue sin ninguna cookie

#### Scenario: Solo almacenamiento exento
- **WHEN** se visitan las mismas páginas y se cambia el tema
- **THEN** `localStorage` no contiene más claves que `starlight-theme` y `sessionStorage` no contiene más claves que `sl-sidebar-state`

#### Scenario: Sin banner de cookies
- **WHEN** se carga `/` en un contexto limpio
- **THEN** no hay ningún elemento con rol `dialog` ni ningún texto que pida aceptar cookies
