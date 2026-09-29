# Local production demo for webdulich.
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1
#   powershell -ExecutionPolicy Bypass -File scripts/demo/start-demo.ps1 -SkipBuild -DistDir .next-p7
param(
  [int]$WebPort = 8080,
  [int]$ApiPort = 3201,
  [string]$DistDir = ".next-demo",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$root = (Resolve-Path (Join-Path $here "..\..")).Path
$pidFile = Join-Path $here ".pids.json"

function Wait-Http([string]$Url, [int]$Tries) {
  for ($i = 0; $i -lt $Tries; $i++) {
    Start-Sleep -Seconds 1
    try {
      $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
      if ($r.StatusCode -eq 200) { return $true }
    } catch {}
  }
  return $false
}

if (Test-Path $pidFile) {
  Write-Host "[demo] Found existing pid file. Run stop-demo.ps1 first if a demo is already running."
}

Write-Host "[demo] 1/4 PostgreSQL (docker compose)..."
docker compose up -d | Out-Host

Write-Host "[demo] 2/4 Migrate dev DB..."
$env:DATABASE_URL = "postgresql://webdulich:webdulich_local@127.0.0.1:55432/webdulich_dev?schema=public"
Push-Location (Join-Path $root "apps\api")
npx prisma migrate deploy | Out-Host
Pop-Location

if ($SkipBuild) {
  Write-Host "[demo] 3/4 Build skipped (-SkipBuild). Using existing dist/ and $DistDir"
} else {
  Write-Host "[demo] 3/4 Build production (contracts, api, web -> $DistDir)..."
  Push-Location $root
  npm run build --workspace @webdulich/contracts | Out-Host
  npm run build --workspace @webdulich/api | Out-Host
  $env:NEXT_DIST_DIR = $DistDir
  npm run build --workspace @webdulich/web | Out-Host
  Pop-Location
}

Write-Host "[demo] 4/4 Start API :$ApiPort + Web :$WebPort (production)..."
$env:NODE_ENV = "production"
$env:PORT = "$ApiPort"
$apiProc = Start-Process -FilePath "node.exe" -ArgumentList "dist/main.js" -WorkingDirectory (Join-Path $root "apps\api") -WindowStyle Hidden -PassThru
if (-not (Wait-Http "http://127.0.0.1:$ApiPort/api/v1/health" 30)) { throw "API failed to start on port $ApiPort" }

$env:NEXT_DIST_DIR = $DistDir
$env:API_INTERNAL_URL = "http://127.0.0.1:$ApiPort"
$webProc = Start-Process -FilePath "npx.cmd" -ArgumentList @("next", "start", "-p", "$WebPort", "-H", "127.0.0.1") -WorkingDirectory (Join-Path $root "apps\web") -WindowStyle Hidden -PassThru
if (-not (Wait-Http "http://127.0.0.1:$WebPort/" 45)) { throw "Web failed to start on port $WebPort" }

@{
  api     = $apiProc.Id
  web     = $webProc.Id
  webPort = $WebPort
  apiPort = $ApiPort
} | ConvertTo-Json | Set-Content -Path $pidFile -Encoding UTF8

Write-Host ""
Write-Host "[demo] READY"
Write-Host "  Web:  http://127.0.0.1:$WebPort"
Write-Host "  API:  http://127.0.0.1:$ApiPort/api/v1/health"
Write-Host "  Stop: powershell -ExecutionPolicy Bypass -File scripts/demo/stop-demo.ps1"
Write-Host ""
Write-Host "[demo] Admin demo user (optional): set ADMIN_EMAIL / ADMIN_PASSWORD env, then run"
Write-Host "        npm run admin:create --workspace @webdulich/api"
