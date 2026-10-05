## ADDED Requirements

### Requirement: Manual PDF al día en CI
La CI SHALL recalcular la huella del contenido de `/manual/` en el sitio construido y SHALL fallar si no coincide con la huella versionada junto a `public/manual-openspec.pdf`, indicando el comando que regenera el PDF.

#### Scenario: PDF al día
- **WHEN** la huella del contenido de `/manual/` coincide con la versionada
- **THEN** la comprobación termina con éxito

#### Scenario: PDF desfasado
- **WHEN** se modifica el texto de una página de contenido sin regenerar el PDF
- **THEN** la comprobación falla y su salida menciona `npm run manual:pdf`

#### Scenario: Huella ausente
- **WHEN** no existe la huella versionada
- **THEN** la comprobación falla con un mensaje que indica regenerar el PDF
