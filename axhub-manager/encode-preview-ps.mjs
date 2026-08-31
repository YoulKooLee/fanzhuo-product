// 计算 PowerShell 脚本的 UTF-16LE Base64 编码
const text = String.raw`
$ErrorActionPreference = 'SilentlyContinue'

$nodeExe = (Get-Command node).Source
$scriptPath = "C:\Users\游翔\Documents\AI work\Axhub\Agent_Memory\preview-architecture.cjs"

# 用 .NET System.Diagnostics.Process 直接调 CreateProcess，处理含空格 + 中文路径
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $nodeExe
$psi.Arguments = '"' + $scriptPath + '"'
$psi.WorkingDirectory = "C:\Users\游翔\Documents\AI work\Axhub\Agent_Memory"
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
[void][System.Diagnostics.Process]::Start($psi)

Start-Sleep -Seconds 2

try {
  $res = Invoke-WebRequest -Uri 'http://127.0.0.1:18080/architecture-overview.html' -UseBasicParsing -TimeoutSec 5
  Write-Host ("PREVIEW_OK  status={0}  bytes={1}" -f $res.StatusCode, $res.RawContentLength)
} catch {
  Write-Host ("PREVIEW_FAIL  err={0}" -f $_.Exception.Message)
}
`
const b64 = Buffer.from(text, 'utf16le').toString('base64')
console.log(b64)
