$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$nodePath = "C:\Program Files\nodejs"
$npmGlobal = "$env:APPDATA\npm"
$system32 = "$env:WINDIR\System32"
$windowsDir = "$env:WINDIR"

$cmdPath = "$system32\cmd.exe"

if (-not (Test-Path "$nodePath\npm.cmd")) {
    throw "npm.cmd not found at $nodePath\npm.cmd"
}

if (-not (Test-Path "$cmdPath")) {
    throw "cmd.exe not found at $cmdPath"
}

$buildCommand = "set PATH=$system32;$windowsDir;$nodePath;$npmGlobal;%PATH%&& npm install && npm run build"

Write-Host "Building Hybrid extension..." -ForegroundColor Cyan
& $cmdPath /c $buildCommand

if ($LASTEXITCODE -ne 0) {
    throw "Build failed"
}

if (-not (Test-Path ".\dist")) {
    throw "Build finished, but dist folder was not created."
}

if (-not (Test-Path "$npmGlobal\tfx.cmd")) {
    Write-Host "tfx-cli not found. Installing..." -ForegroundColor Yellow
    & $cmdPath /c "set PATH=$system32;$windowsDir;$nodePath;$npmGlobal;%PATH%&& npm install -g tfx-cli"
    if ($LASTEXITCODE -ne 0) {
        throw "tfx-cli installation failed"
    }
}

if (Test-Path ".\out") {
    Remove-Item ".\out" -Recurse -Force
}
New-Item -ItemType Directory -Path ".\out" | Out-Null

Write-Host "Creating VSIX..." -ForegroundColor Cyan
& $cmdPath /c "set PATH=$system32;$windowsDir;$nodePath;$npmGlobal;%PATH%&& tfx extension create --manifest-globs vss-extension.json --output-path out"

if ($LASTEXITCODE -ne 0) {
    throw "VSIX creation failed"
}

Write-Host ""
Write-Host "Done. VSIX created in:" -ForegroundColor Green
Write-Host "$PSScriptRoot\out"
