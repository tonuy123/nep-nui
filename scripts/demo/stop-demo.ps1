# Stops the local demo started by start-demo.ps1 (PostgreSQL containers are kept running).
$ErrorActionPreference = "Continue"
$here = $PSScriptRoot
$pidFile = Join-Path $here ".pids.json"

if (-not (Test-Path $pidFile)) {
  Write-Host "[demo] No pid file found - nothing to stop."
  exit 0
}

$pids = Get-Content $pidFile | ConvertFrom-Json

foreach ($procId in @($pids.api, $pids.web)) {
  if ($procId) {
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }
}

foreach ($port in @($pids.webPort, $pids.apiPort)) {
  if ($port) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
      ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
  }
}

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
Write-Host "[demo] Stopped. PostgreSQL containers still running; use 'docker compose down' to stop them."
