# List all node.exe processes with command line & parent (pure ASCII)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'"
if (-not $procs) { Write-Host 'NO node.exe processes.'; exit 0 }
foreach ($p in $procs) {
  $cl = $p.CommandLine
  if (-not $cl) { $cl = '(no cmdline)' }
  Write-Host ('PID=' + $p.ProcessId + '  PPID=' + $p.ParentProcessId)
  Write-Host ('    ' + $cl)
  Write-Host ''
}
Write-Host '=== Ports (7788/53817/517xx/32124) ==='
$ports = netstat -ano | Select-String 'LISTENING' | Select-String ':(7788|53817|517[0-9][0-9]|32124)\s'
if ($ports) { $ports | ForEach-Object { Write-Host ('    ' + $_.Line.Trim()) } } else { Write-Host '    none listening' }
