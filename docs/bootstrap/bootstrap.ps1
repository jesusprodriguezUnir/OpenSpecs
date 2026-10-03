#requires -Version 5.1
<#
.SYNOPSIS
  Bootstrap del proyecto "OpenSpec desde cero": scaffolding Astro + Starlight,
  OpenSpec init para Claude Code y copia de la configuración del proyecto.

.DESCRIPTION
  Ejecutar UNA vez desde la raíz del proyecto (D:\Personal\OpenSpecs), con solo
  la carpeta docs\ presente:

    Set-ExecutionPolicy -Scope Process Bypass
    .\docs\bootstrap\bootstrap.ps1

  Es idempotente en lo razonable: si detecta package.json u openspec\ ya
  existentes, se salta ese paso.
#>
[CmdletBinding()]
param(
  [string]$OpenSpecVersion = '1.14.0',
  [switch]$SkipGit
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$bootstrap = $PSScriptRoot
Set-Location $root
$env:OPENSPEC_TELEMETRY = '0'
$env:ASTRO_TELEMETRY_DISABLED = '1'

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

# 1. Requisitos ---------------------------------------------------------------
Step 'Comprobando requisitos'
$nodeVersion = [version]((node -v).TrimStart('v'))
if ($nodeVersion -lt [version]'22.12.0') {
  throw "Astro 7 requiere Node >= 22.12.0 (tienes $nodeVersion). Instala Node 22 LTS."
}
if (-not $SkipGit) { git --version | Out-Null }
Write-Host "Node $nodeVersion OK"

# 2. Scaffolding Astro + Starlight -------------------------------------------
if (Test-Path (Join-Path $root 'package.json')) {
  Step 'package.json ya existe: se omite el scaffolding'
} else {
  Step 'Creando proyecto Astro con la plantilla Starlight'
  # create-astro admite la carpeta docs\ en un directorio "vacío" (lista blanca).
  npm create astro@latest . -- --template starlight --install --no-git --skip-houston --yes
  if ($LASTEXITCODE -ne 0) { throw 'create-astro ha fallado' }

  Step 'Fijando versiones exactas de astro y @astrojs/starlight'
  # Con node para no alterar formato ni añadir BOM (ConvertTo-Json/Set-Content de PS 5.1 lo hacen).
  $pin = @'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const dep of ['astro', '@astrojs/starlight']) {
  const v = JSON.parse(fs.readFileSync(`node_modules/${dep}/package.json`, 'utf8')).version;
  pkg.dependencies[dep] = v;
  console.log(`  ${dep} -> ${v}`);
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
'@
  node -e $pin
  if ($LASTEXITCODE -ne 0) { throw 'No se pudieron fijar las versiones' }

  Step 'Instalando herramientas de comprobación (astro check)'
  npm install --save-dev --save-exact @astrojs/check typescript
  if ($LASTEXITCODE -ne 0) { throw 'npm install ha fallado' }
}

# 3. OpenSpec ------------------------------------------------------------------
Step "Instalando OpenSpec $OpenSpecVersion (global)"
npm install -g "@fission-ai/openspec@$OpenSpecVersion"
if ($LASTEXITCODE -ne 0) { throw 'No se pudo instalar OpenSpec' }
openspec config set telemetry.enabled false | Out-Null

# config.yaml propio ANTES de init: init lo respeta y no lo sobrescribe.
New-Item -ItemType Directory -Force -Path (Join-Path $root 'openspec') | Out-Null
$configTarget = Join-Path $root 'openspec\config.yaml'
if (-not (Test-Path $configTarget)) {
  Copy-Item (Join-Path $bootstrap 'openspec\config.yaml') $configTarget
}

Step 'openspec init --tools claude'
openspec init --tools claude --no-animation
if ($LASTEXITCODE -ne 0) { throw 'openspec init ha fallado' }

# 4. Ficheros del proyecto ----------------------------------------------------
Step 'Copiando CLAUDE.md, README.md, .claude y .github'
Copy-Item (Join-Path $bootstrap 'CLAUDE.md') $root -Force
Copy-Item (Join-Path $bootstrap 'README.md') $root -Force   # sustituye el README de la plantilla
# En docs\bootstrap se guardan sin punto (claude\, github\) y aquí se renombran.
foreach ($dir in 'claude', 'github') {
  $target = Join-Path $root ".$dir"
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  Copy-Item (Join-Path $bootstrap "$dir\*") $target -Recurse -Force
}

$gitignore = Join-Path $root '.gitignore'
$extra = @('', '# Claude Code (preferencias personales)', '.claude/settings.local.json', '', '# Playwright', 'test-results/', 'playwright-report/')
if (-not (Select-String -Path $gitignore -Pattern 'settings.local.json' -Quiet)) {
  Add-Content $gitignore $extra
}

# 5. Comprobación ------------------------------------------------------------
Step 'Validando'
openspec validate --all --strict --no-interactive
if ($LASTEXITCODE -ne 0) { throw 'openspec validate ha fallado (revisa openspec\config.yaml)' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'El build inicial ha fallado' }

# 6. Git ---------------------------------------------------------------------
if (-not $SkipGit) {
  if (-not (Test-Path (Join-Path $root '.git'))) {
    Step 'Inicializando git'
    git init -b main | Out-Null
  }
  git add -A
  git commit -m 'chore: bootstrap Astro + Starlight + OpenSpec 1.14' | Out-Null
  Write-Host 'Commit inicial creado en main.'
}

Write-Host "`nListo. Siguiente paso: abre Claude Code en $root y ejecuta /roadmap-propose 01" -ForegroundColor Green
