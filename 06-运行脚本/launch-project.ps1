# Axhub Make 项目启动脚本
#
# 架构说明（重要）：
#   1. Axhub Make 管理端（admin）是【全局单例】，默认端口 53817，一个实例管理所有项目。
#      多个项目必须共用同一个 Make 服务，绝不能每个项目各起一个——那会互相抢端口并导致 500。
#   2. 每个项目只独占一个 Vite 端口（从 51720 起自动分配），用 --strictPort 锁死。
#   3. Make 管理端通过读取各项目的 .axhub/make/.dev-server-info.json 心跳文件
#      来发现该项目的 Vite 运行时，因此该文件必须准确、且不能有僵尸进程覆写。
#   4. 绝不能带 --dev 启动 Make：--dev 是给 Make 自身开发用的，npm 包内无前端源码入口，
#      会导致管理端页面 500；且 --dev 会强行抢占端口、杀掉其他项目的 Make 服务。
#   5. 模板自带的 autoStartMakeServerPlugin 生成的命令带位置参数（node cli.mjs <projectRoot> --dev），
#      新版 @axhub/make CLI 拒绝位置参数会直接报错，所以这里用
#      AXHUB_MAKE_SKIP_AUTO_START_SERVER=1 关掉插件自启，改由本脚本接管 Make 生命周期。
#
# 性能设计（2026-08-07 优化）：
#   A. 【复用优先】若本项目 Vite 心跳新鲜且进程存活，直接复用，跳过"清理 + 重启 + 等待"三段耗时。
#   B. 【并行启动】Make 冷启动与 Vite 启动同时发起，两者的等待窗口重叠，而不是串行相加。
#   C. 【端口粘滞】优先复用上次成功的 Vite 端口，浏览器地址稳定，也少一次端口探测。
#   D. 【CLI 定位修复】按 01-项目/02-模板 的实际目录结构查找 @axhub/make，
#      避免找不到就回退 npx 现场下载（这是冷启动最大的隐性耗时来源）。
#   E. 【耗时可视化】每步打印耗时，结束时汇总，方便一眼看出卡在哪一步。

param(
    [string]$RootDir,
    [string]$ProjectName,
    [int]$VitePort = 0,
    [int]$MakePort = 53817,
    [string]$NodePath = ''
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # 抑制 Invoke-WebRequest 进度条/响应流提示，避免污染日志

# 修复某些运行环境（如 WorkBuddy/CodeBuddy 会话）中 PATH 环境变量出现 Path/PATH/path
# 多个大小写键，导致 .NET 在创建子进程时合并环境变量抛 "已添加项" 的问题。
# 策略：先删除 Process 级别所有 PATH 相关键（不区分大小写），再用唯一值重建 PATH。
$processEnv = [Environment]::GetEnvironmentVariables('Process')
$pathKeys = @($processEnv.Keys | Where-Object { $_ -ieq 'PATH' })
if ($pathKeys.Count -gt 1 -or ($pathKeys.Count -eq 1 -and $pathKeys[0] -cne 'PATH')) {
    $segments = @()
    foreach ($k in $pathKeys) {
        if ($processEnv[$k]) { $segments += ($processEnv[$k] -split ';') }
    }
    $cleanPath = ($segments | Where-Object { $_ } | Select-Object -Unique) -join ';'
    foreach ($k in $pathKeys) {
        [Environment]::SetEnvironmentVariable($k, $null, 'Process')
    }
    [Environment]::SetEnvironmentVariable('PATH', $cleanPath, 'Process')
}

# ===== 计时与日志 =====
$script:Total = [System.Diagnostics.Stopwatch]::StartNew()
$script:StepWatch = $null
$script:Timings = New-Object System.Collections.ArrayList

function Write-Step($num, $text, $hint) {
    if ($script:StepWatch) { Stop-StepTimer }
    $suffix = if ($hint) { "  ($hint)" } else { '' }
    Write-Host ""
    Write-Host "[$num/8] $text$suffix" -ForegroundColor Cyan
    $script:StepName = "[$num] $text"
    $script:StepWatch = [System.Diagnostics.Stopwatch]::StartNew()
}

function Stop-StepTimer {
    if (-not $script:StepWatch) { return }
    $script:StepWatch.Stop()
    $sec = [math]::Round($script:StepWatch.Elapsed.TotalSeconds, 1)
    $color = if ($sec -ge 10) { 'Yellow' } else { 'DarkGray' }
    Write-Host ("      -> 耗时 {0}s" -f $sec) -ForegroundColor $color
    [void]$script:Timings.Add([pscustomobject]@{ Step = $script:StepName; Seconds = $sec })
    $script:StepWatch = $null
}

function Write-Info($text)  { Write-Host "      $text" }
function Write-Warn($text)  { Write-Host "      $text" -ForegroundColor Yellow }
function Write-Good($text)  { Write-Host "      $text" -ForegroundColor Green }

# ===== 通用工具 =====
function Test-PortFree($port) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
    return -not $conn
}

# ===== 后台启动 Node 进程（处理路径含空格问题）=====
# 问题背景：PowerShell 5.1 的 Start-Process -ArgumentList 会按空格拆分参数，
#          即使每个元素用双引号包起来。当 NodePath = "C:\Program Files\nodejs\node.exe"
#          或 makeCli 含 "Documents\AI work" 等空格路径时，会出现：
#          - "Cannot find module 'C:\Users\游翔\Documents\AI'" 截断错误
#          - "文件名、目录名或卷标语法不正确" 错误
# 解决方案：用 .NET System.Diagnostics.Process 直接调 CreateProcess，
#          它能正确处理含空格路径，绕开 PowerShell 引号解析。
function Start-NodeBackground {
    param(
        [Parameter(Mandatory)][string]$NodePath,
        [Parameter(Mandatory)][string]$ScriptPath,
        [Parameter(Mandatory)][string]$WorkingDir,
        [string[]]$ExtraArgs = @(),
        [hashtable]$ExtraEnv = @{}
    )
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $NodePath
    # ScriptPath 加双引号；额外参数逐个拼接。注意：不要在赋值表达式里用 `if` 子表达式，
    # PowerShell 5.1 会把它当作 cmdlet 名解析报错。
    $argLine = '"' + $ScriptPath + '"'
    if ($ExtraArgs -and $ExtraArgs.Count -gt 0) {
        $argLine += ' ' + ($ExtraArgs -join ' ')
    }
    $psi.Arguments = $argLine
    $psi.WorkingDirectory = $WorkingDir
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    # 透传当前进程的 NODE_OPTIONS/CODEBUDDY_* 给子进程环境
    foreach ($k in @('NODE_OPTIONS') + @((Get-ChildItem Env: | Where-Object { $_.Name -like 'CODEBUDDY*' } | Select-Object -ExpandProperty Name))) {
        $val = [Environment]::GetEnvironmentVariable($k, 'Process')
        if ($val) { $psi.EnvironmentVariables[$k] = $val } else { $psi.EnvironmentVariables.Remove($k) | Out-Null }
    }
    foreach ($k in $ExtraEnv.Keys) {
        $psi.EnvironmentVariables[$k] = [string]$ExtraEnv[$k]
    }
    return [System.Diagnostics.Process]::Start($psi)
}

function Find-FreePort($startPort, [int]$maxOffset = 100) {
    for ($offset = 0; $offset -le $maxOffset; $offset++) {
        $candidate = $startPort + $offset
        if ($candidate -gt 65535) { break }
        if (Test-PortFree $candidate) { return $candidate }
    }
    throw "未能在 $startPort ~ $($startPort + $maxOffset) 范围内找到空闲端口"
}

function Get-MakeHealth($port, $timeoutSec = 3) {
    # 本机 Invoke-WebRequest 对 Make /api/health 偶发读不到响应体（bytes read: 0），
    # 导致冷启动时 60 秒误判超时。改用 node fetch 更稳定。
    $js = @"
const ac = new AbortController();
const t = setTimeout(() => ac.abort(), $timeoutSec * 1000);
fetch('http://localhost:$port/api/health', { signal: ac.signal })
  .then(r => r.text())
  .then(txt => {
    clearTimeout(t);
    try { const j = JSON.parse(txt); console.log(JSON.stringify(j)); }
    catch(e) { console.error('JSON parse error: ' + e.message); process.exit(1); }
  })
  .catch(e => { clearTimeout(t); console.error(e.message); process.exit(1); });
"@
    try {
        $json = (& node -e $js) 2>&1
        if ($json -and "$json" -match '^\s*\{') {
            return ("$json" | ConvertFrom-Json)
        }
        return $null
    } catch {
        return $null
    }
}

function Invoke-JsonApi($url, $method, $payload) {
    try {
        if ($null -ne $payload) {
            $json = $payload | ConvertTo-Json -Compress -Depth 6
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $r = Invoke-WebRequest -Uri $url -Method $method -Body $bytes `
                -ContentType 'application/json; charset=utf-8' -UseBasicParsing -TimeoutSec 25
        } else {
            $r = Invoke-WebRequest -Uri $url -Method $method -UseBasicParsing -TimeoutSec 25
        }
        return @{ status = [int]$r.StatusCode; body = $r.Content }
    } catch {
        if ($_.Exception.Response) { return @{ status = [int]$_.Exception.Response.StatusCode; body = '' } }
        return @{ status = 0; body = $_.Exception.Message }
    }
}

function Read-JsonFile($path) {
    try { return Get-Content $path -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json }
    catch { return $null }
}

function Get-JsonPort($path) {
    $j = Read-JsonFile $path
    if ($j) { return [int]$j.port }
    return 0
}

# 判断本项目的 Vite 是否已经在健康运行：心跳新鲜 + 进程存活 + 端口在监听
function Test-ViteAlive($devInfoPath) {
    if (-not (Test-Path $devInfoPath)) { return $null }
    $age = (Get-Date) - (Get-Item $devInfoPath).LastWriteTime
    if ($age.TotalSeconds -gt 20) { return $null }   # 心跳每 5 秒续写，超过 20 秒视为僵尸
    $info = Read-JsonFile $devInfoPath
    if (-not $info) { return $null }
    $vpid = [int]$info.pid
    $vport = [int]$info.port
    if ($vpid -le 0 -or $vport -le 0) { return $null }
    $proc = Get-Process -Id $vpid -ErrorAction SilentlyContinue
    if (-not $proc -or $proc.ProcessName -ne 'node') { return $null }
    if (Test-PortFree $vport) { return $null }       # 端口没在监听说明已经死了
    return $vport
}

# 只结束【本项目】的残留 Vite 进程，不影响其他项目
function Stop-ProjectVite($projDir) {
    $killed = 0
    $procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue
    foreach ($proc in $procs) {
        $cmd = $proc.CommandLine
        if ($cmd -and $cmd.Contains($projDir) -and $cmd -match 'vite') {
            try {
                Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
                $killed++
            } catch { }
        }
    }
    # 兜底：命令行用相对路径启动的 Vite 匹配不到项目目录，
    # 改从心跳文件里取 pid 精确清理（该文件由 writeDevServerInfoPlugin 每 5 秒续写）
    $devInfo = Join-Path $projDir '.axhub\make\.dev-server-info.json'
    if (Test-Path $devInfo) {
        $info = Read-JsonFile $devInfo
        if ($info) {
            try {
                $stalePid = [int]$info.pid
                if ($stalePid -gt 0) {
                    $stale = Get-Process -Id $stalePid -ErrorAction SilentlyContinue
                    if ($stale -and $stale.ProcessName -eq 'node') {
                        Stop-Process -Id $stalePid -Force -ErrorAction SilentlyContinue
                        $killed++
                    }
                }
            } catch { }
        }
    }
    return $killed
}

# Make 管理端是全局单例，@axhub/make 不必每个项目都装。
# 查找顺序：本项目 -> 02-模板/_project-template -> 01-项目/*（含二级嵌套）-> 全局 npm root -> $null(回退 npx)
# 注意：找不到就会回退 npx 现场下载，冷启动会慢几十秒，所以这里要尽量找到本地包。
function Resolve-MakeCli($projDir, $rootDir) {
    $suffix = 'node_modules\@axhub\make\bin\cli.mjs'

    $probe = Join-Path $projDir $suffix
    if (Test-Path $probe) { return $probe }

    $probe = Join-Path $rootDir "02-模板\_project-template\$suffix"
    if (Test-Path $probe) { return $probe }

    # 01-项目 下的所有项目（支持 01-项目/<分组>/<项目> 两级）
    $projectsRoot = Join-Path $rootDir '01-项目'
    foreach ($depth in 1, 2) {
        $pattern = Join-Path $projectsRoot ((@('*') * $depth) -join '\')
        $dirs = Get-ChildItem -Path $pattern -Directory -ErrorAction SilentlyContinue
        foreach ($d in $dirs) {
            $probe = Join-Path $d.FullName $suffix
            if (Test-Path $probe) { return $probe }
        }
    }

    # 兼容旧结构：根目录一级子目录
    $dirs = Get-ChildItem -Path $rootDir -Directory -ErrorAction SilentlyContinue
    foreach ($d in $dirs) {
        $probe = Join-Path $d.FullName $suffix
        if (Test-Path $probe) { return $probe }
    }

    # 全局安装
    try {
        $globalRoot = (& npm root -g 2>$null | Select-Object -First 1)
        if ($globalRoot) {
            $probe = Join-Path $globalRoot '@axhub\make\bin\cli.mjs'
            if (Test-Path $probe) { return $probe }
        }
    } catch { }

    return $null
}

try {
    $parts = $ProjectName.Split([char[]]@('\', '/')) | Where-Object { $_ -ne '' }
    $projDir = Join-Path $RootDir ($parts -join '\')

    # 统一使用受控的 Node（与工作台管理端同一份），避免 Vite 误用 PATH 上其它架构的 node，
    # 导致原生模块（rollup/esbuild）架构不匹配而崩溃（典型报错：Cannot find module @rollup/rollup-win32-*）。
    # 做法：把该 node 所在目录前置到 PATH，后续所有 node / npx / npm 调用都解析到它。
    if (-not $NodePath) {
        $wb = Join-Path $env:USERPROFILE '.workbuddy\binaries\node\versions'
        $guess = Get-ChildItem -Path $wb -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($guess) { $NodePath = Join-Path $guess.FullName 'node.exe' }
        else { $NodePath = 'node' }
    }
    $nodeDir = Split-Path $NodePath
    if (Test-Path $nodeDir) {
        # 使用 .NET Environment API 避免 PowerShell $env:PATH/$env:Path 大小写冲突
        $currentPath = [Environment]::GetEnvironmentVariable('PATH', 'Process')
        if ($currentPath -notlike "*$nodeDir*") {
            [Environment]::SetEnvironmentVariable('PATH', "$nodeDir;$currentPath", 'Process')
        }
    }
    Write-Host "  使用 Node: $NodePath (arch=$(& node -e 'console.log(process.arch)'))" -ForegroundColor DarkGray

    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  启动项目: $ProjectName" -ForegroundColor Green
    Write-Host "  路径: $projDir" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green

    if (-not (Test-Path $projDir)) { throw "项目目录不存在: $projDir" }
    Set-Location $projDir

    $devInfoPath   = Join-Path $projDir '.axhub\make\.dev-server-info.json'
    $statusPath    = Join-Path $projDir '.axhub\make\.launch-status.json'
    $nodeModules   = Join-Path $projDir 'node_modules'
    $adminOrigin   = "http://localhost:$MakePort"

    # ---------- 1/8 读取项目身份 ----------
    Write-Step 1 '读取项目身份' '每次执行，很快'
    $projectId = 'make-project'
    $projectDisplayName = $ProjectName
    $clientJson = Join-Path $projDir '.axhub\make\client.json'
    if (Test-Path $clientJson) {
        $c = $null
        try { $c = Get-Content $clientJson -Raw -Encoding UTF8 | ConvertFrom-Json } catch { }
        if ($c) {
            if ($c.project.id)   { $projectId = $c.project.id }
            if ($c.project.name) { $projectDisplayName = $c.project.name }
        }
    }
    Write-Info "projectId : $projectId"
    Write-Info "name      : $projectDisplayName"

    # ---------- 2/8 检查现有 Vite（复用优先） ----------
    Write-Step 2 '检查本项目 Vite 运行状态' '每次执行，很快'
    $reuseVitePort = Test-ViteAlive $devInfoPath
    $reuseVite = $false
    if ($reuseVitePort -and ($VitePort -le 0 -or $VitePort -eq $reuseVitePort)) {
        $reuseVite = $true
        $actualVitePort = $reuseVitePort
        Write-Good "检测到本项目 Vite 已在运行 (端口 $reuseVitePort)，直接复用，跳过重启"
    } else {
        Write-Info '未检测到可复用的 Vite，稍后将重新启动'
    }

    # ---------- 3/8 预启动 Make 单例（异步，与 Vite 并行） ----------
    # 关键优化：先把 Make 拉起来但【不等它就绪】，接着去启动 Vite，
    # 两段等待窗口重叠，冷启动能省下几十秒。
    Write-Step 3 '预启动 Axhub Make 单例' "共享服务，端口 $MakePort；已在运行则秒过"
    $makeNeedWait = $false
    $health = Get-MakeHealth $MakePort
    if ($health -and $health.ok -and $health.role -eq 'admin' -and $health.devMode -ne $true) {
        Write-Good "复用已运行的 Make 服务 (pid $($health.server.pid))"
    } else {
        if ($health -and $health.ok -and $health.devMode -eq $true) {
            Write-Warn '检测到 --dev 模式实例（管理端页面不可用），正在替换…'
            if ($health.server -and $health.server.pid) {
                Stop-Process -Id ([int]$health.server.pid) -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
            }
        }
        if (-not (Test-PortFree $MakePort)) {
            throw "端口 $MakePort 已被非 Axhub Make 的进程占用，请先释放该端口（可运行根目录的 停止工作台.cmd）"
        }

        # CodeBuddy IDE 通过两种机制劫持 node 的 fs 删除操作，必须全部剔除，
        # 否则 Make 写 projects.json 报 MAKE_STATE_DIR_NOT_WRITABLE：
        #   1) NODE_OPTIONS=--require="...node-language-shim.cjs"（元凶，会强制所有子 node 加载 shim）
        #   2) CODEBUDDY_SAFE_DELETE_ENABLED=1 等环境变量
        #   3) PATH 中混入 CodeBuddy CN 目录（其下可能有劫持版 node）
        [Environment]::SetEnvironmentVariable('NODE_OPTIONS', $null, 'Process')
        foreach ($k in @(Get-ChildItem Env: | Where-Object { $_.Name -like 'CODEBUDDY*' } | Select-Object -ExpandProperty Name)) {
            [Environment]::SetEnvironmentVariable($k, $null, 'Process')
        }
        $curPath = [Environment]::GetEnvironmentVariable('PATH', 'Process')
        if ($curPath -and ($curPath -like '*CodeBuddy CN*' -or $curPath -like '*codebuddy*')) {
            $cleaned = ($curPath -split ';' | Where-Object { $_ -and ($_ -notlike '*CodeBuddy CN*') -and ($_ -notlike '*codebuddy*') }) -join ';'
            [Environment]::SetEnvironmentVariable('PATH', $cleaned, 'Process')
            Write-Info '已移除 PATH 中 CodeBuddy 劫持节点，避免 Make fs 拦截'
        }

        # 注意：不加 --dev，也不加 --runtime-origin（运行时由各项目心跳文件上报）
        $makeCli = Resolve-MakeCli $projDir $RootDir
        # 用传入的绝对 node 路径（$NodePath）而非 PATH 里的 node，彻底绕开劫持
        if (-not $NodePath) { $NodePath = (Get-Command node).Source }
        if ($makeCli) {
            Write-Info "使用本地 CLI: $makeCli"
            # 用 .NET Process 启动，正确处理含空格的 node 路径和 makeCli 路径
            [void](Start-NodeBackground -NodePath $NodePath -ScriptPath $makeCli -WorkingDir $projDir -ExtraArgs @('--no-open', '--port', $MakePort))
        } else {
            Write-Warn '本地未找到 @axhub/make，回退 npx 现场下载（这一步会明显变慢）'
            Write-Warn '建议：在任一项目下执行 pnpm add -D @axhub/make，之后所有项目都会走本地包'
            # npx 走 cmd.exe（不需要 .NET Process 包装，因为 npx 是 cmd 内置）
            Start-Process -NoNewWindow -FilePath 'cmd.exe' `
                -ArgumentList '/c', "npx -y @axhub/make@latest --no-open --port $MakePort" -WorkingDirectory $projDir
        }
        $makeNeedWait = $true
        Write-Info '已发起启动，稍后与 Vite 并行等待就绪'
    }

    # ---------- 4/8 检查依赖 ----------
    #    重要：声明 packageManager=pnpm 或存在 pnpm-lock.yaml 的项目，绝不能执行 npm install，
    #    npm 会把 pnpm 装的包判定为「多余包」批量删除（实测一次删掉 67 个）。
    Write-Step 4 '检查依赖 node_modules' '仅首次安装，之后跳过'
    if (-not (Test-Path $nodeModules)) {
        $usePnpm = (Test-Path (Join-Path $projDir 'pnpm-lock.yaml'))
        if (-not $usePnpm) {
            $pkg = Read-JsonFile (Join-Path $projDir 'package.json')
            if ($pkg -and $pkg.packageManager -and $pkg.packageManager -like 'pnpm*') { $usePnpm = $true }
        }
        if ($usePnpm) {
            Write-Warn '首次运行，使用 pnpm 安装依赖，可能需要数分钟，请耐心等待…'
            Start-Process -NoNewWindow -Wait -FilePath 'cmd.exe' -ArgumentList '/c', 'npx -y pnpm@10 install' -WorkingDirectory $projDir
        } else {
            Write-Warn '首次运行，使用 npm 安装依赖，可能需要数分钟，请耐心等待…'
            Start-Process -NoNewWindow -Wait -FilePath 'cmd.exe' -ArgumentList '/c', 'npm install' -WorkingDirectory $projDir
        }
    } else {
        Write-Info 'node_modules 已存在，跳过安装'
    }
    $viteJs = Join-Path $nodeModules 'vite\bin\vite.js'
    if (-not (Test-Path $viteJs)) { throw "未找到 Vite ($viteJs)，请先在项目目录手动安装依赖" }

    # ---------- 5/8 校验原生模块 ----------
    Write-Step 5 '校验平台原生模块' '仅首次/缺失时自动补齐，之后跳过'
    if ($reuseVite) {
        Write-Info '已复用运行中的 Vite，跳过校验'
    } else {
        $nodeArch = (& node -e 'console.log(process.arch)') -replace '[^a-z0-9]'
        if (-not $nodeArch) { $nodeArch = 'x64' }
        # 原生模块可能位于 node_modules 顶层（npm 风格）或 node_modules/.pnpm 下（pnpm 风格），
        # 两种布局都要命中，避免误判“缺失”而触发无谓的重装。
        function Test-NativePresent($nm, $pkg) {
            if (Test-Path (Join-Path $nm ($pkg -replace '/', '\'))) { return $true }
            $leaf = $pkg.Split('/')[-1]
            $pnpmDir = Join-Path $nm '.pnpm'
            if (Test-Path $pnpmDir) {
                foreach ($d in Get-ChildItem -Path $pnpmDir -Directory -Recurse -ErrorAction SilentlyContinue) {
                    if ($d.Name -like "*$leaf*") { return $true }
                }
            }
            return $false
        }
        function Get-MissingNatives($nm, $arch) {
            $missing = @()
            foreach ($n in @("@rollup/rollup-win32-$arch-msvc", "@esbuild/win32-$arch")) {
                if (-not (Test-NativePresent $nm $n)) { $missing += $n }
            }
            return $missing
        }
        $needNative = Get-MissingNatives $nodeModules $nodeArch
        if ($needNative.Count -gt 0) {
            Write-Warn "缺少原生模块 $($needNative -join ', ')，正在自动补齐（pnpm 安装，可能需数十秒）…"
            Start-Process -NoNewWindow -Wait -FilePath 'cmd.exe' `
                -ArgumentList '/c', 'npx -y pnpm@10 install' -WorkingDirectory $projDir
            $needNative = Get-MissingNatives $nodeModules $nodeArch
            if ($needNative.Count -gt 0) {
                Write-Warn "常规安装未补齐，正在强制重装（pnpm install --force）…"
                Start-Process -NoNewWindow -Wait -FilePath 'cmd.exe' `
                    -ArgumentList '/c', 'npx -y pnpm@10 install --force' -WorkingDirectory $projDir
                $needNative = Get-MissingNatives $nodeModules $nodeArch
                if ($needNative.Count -gt 0) {
                    Write-Warn "强制重装后仍缺少 $($needNative -join ', ')，Vite 可能启动失败，请检查网络或手动执行 pnpm install"
                } else {
                    Write-Good "原生模块已补齐 (arch=$nodeArch)"
                }
            } else {
                Write-Good "原生模块已补齐 (arch=$nodeArch)"
            }
        } else {
            Write-Info "原生模块完整 (arch=$nodeArch)，跳过补齐"
        }
    }

    # ---------- 6/8 启动 Vite ----------
    if ($reuseVite) {
        Write-Step 6 "复用 Vite 开发服务器 (端口 $actualVitePort)" '已在运行，零耗时'
        Write-Good "http://localhost:$actualVitePort/"
    } else {
        # 端口粘滞：优先沿用上次成功的端口，浏览器地址稳定
        if ($VitePort -le 0) {
            $lastStatus = Read-JsonFile $statusPath
            if ($lastStatus -and [int]$lastStatus.vitePort -gt 0 -and (Test-PortFree ([int]$lastStatus.vitePort))) {
                $VitePort = [int]$lastStatus.vitePort
            } else {
                $VitePort = Find-FreePort 51720
            }
        }
        Write-Step 6 "启动 Vite 开发服务器 (端口 $VitePort)" '首次预构建依赖较慢，之后有缓存'

        $killed = Stop-ProjectVite $projDir
        if ($killed -gt 0) {
            Write-Info "清理本项目残留 Vite 进程: $killed"
            Start-Sleep -Seconds 2
        }

        $env:AXHUB_MAKE_SKIP_AUTO_START_SERVER = '1'
        # 同样清掉 NODE_OPTIONS / CODEBUDDY_*，避免 Vite 进程被 CodeBuddy shim 劫持 fs 操作
        if (-not $NodePath) { $NodePath = (Get-Command node).Source }
        [Environment]::SetEnvironmentVariable('NODE_OPTIONS', $null, 'Process')
        foreach ($k in @(Get-ChildItem Env: | Where-Object { $_.Name -like 'CODEBUDDY*' } | Select-Object -ExpandProperty Name)) {
            [Environment]::SetEnvironmentVariable($k, $null, 'Process')
        }
        $actualVitePort = 0
        for ($attempt = 1; $attempt -le 2; $attempt++) {
            if (Test-Path $devInfoPath) { Remove-Item $devInfoPath -Force -ErrorAction SilentlyContinue }
            # 用 .NET Process 启动 Vite，正确处理 node 路径和 viteJs 路径的空格
            [void](Start-NodeBackground -NodePath $NodePath -ScriptPath $viteJs -WorkingDir $projDir -ExtraArgs @('--port', $VitePort, '--strictPort'))
            Write-Info "等待 Vite 就绪…（第 $attempt 次，最长 60 秒）"
            $deadline = (Get-Date).AddSeconds(60)
            while ((Get-Date) -lt $deadline) {
                if (Test-Path $devInfoPath) {
                    $reported = Get-JsonPort $devInfoPath
                    if ($reported -eq $VitePort) { $actualVitePort = $reported; break }
                }
                Start-Sleep -Milliseconds 400
            }
            if ($actualVitePort -gt 0) { break }
            if ($attempt -eq 1) {
                # 常见原因：node_modules\.vite 依赖预构建缓存损坏或无法被 Vite 自行清理
                Write-Warn '启动未成功，清理 Vite 预构建缓存后重试…'
                [void](Stop-ProjectVite $projDir)
                $viteCache = Join-Path $nodeModules '.vite'
                if (Test-Path $viteCache) { Remove-Item $viteCache -Recurse -Force -ErrorAction SilentlyContinue }
                Start-Sleep -Seconds 2
            }
        }
        if ($actualVitePort -le 0) { throw "Vite 未就绪（端口 $VitePort），请查看 07-日志 下对应的 launch-*.log" }
        Write-Good "Vite 已就绪: http://localhost:$actualVitePort/"
    }

    # ---------- 7/8 等待 Make 就绪并注册项目 ----------
    Write-Step 7 '等待 Make 就绪并注册项目' '与 Vite 启动并行，通常已就绪'
    if ($makeNeedWait) {
        # 7a. 等 health 接口返回 admin 角色
        $ready = $false
        $deadline = (Get-Date).AddSeconds(60)
        $attempt = 0
        while ((Get-Date) -lt $deadline) {
            $attempt++
            $h = Get-MakeHealth $MakePort 2
            if ($h -and $h.ok -and $h.role -eq 'admin' -and $h.devMode -ne $true) {
                Write-Good "Make 服务已就绪 (pid $($h.server.pid))"
                $ready = $true; break
            }
            if ($attempt % 10 -eq 0) {
                $reason = if (-not $h) { '无响应' } else { "ok=$($h.ok) role=$($h.role) devMode=$($h.devMode)" }
                Write-Info "仍等待 Make 就绪… [$reason]"
            }
            Start-Sleep -Milliseconds 500
        }
        if (-not $ready) { throw "Make 服务未在 60 秒内就绪（端口 $MakePort）" }

        # 7b. Make health 就绪后，registry 还需要几秒到几十秒初始化项目列表；
        #     若此时打开浏览器，页面拿不到 activeProject/entries，会显示空白。
        #     继续轮询 /api/projects，直到能拿到非空项目列表且 activeProjectId 已设置。
        Write-Info 'Make health 已就绪，继续等待项目注册表加载…'
        $registryReady = $false
        $regDeadline = (Get-Date).AddSeconds(45)
        while ((Get-Date) -lt $regDeadline) {
            $regResp = Invoke-JsonApi "$adminOrigin/api/projects" 'Get' $null
            if ($regResp.status -eq 200 -and $regResp.body) {
                try {
                    $regData = $regResp.body | ConvertFrom-Json
                    if ($regData.activeProjectId -and $regData.projects -and $regData.projects.Count -gt 0) {
                        Write-Good "Make 项目注册表已加载 (activeProjectId=$($regData.activeProjectId), projects=$($regData.projects.Count))"
                        $registryReady = $true
                        break
                    }
                } catch { }
            }
            Start-Sleep -Milliseconds 500
        }
        if (-not $registryReady) { Write-Warn 'Make 项目注册表未在 45 秒内加载完成，页面可能暂时空白，刷新即可' }
    } else {
        Write-Info 'Make 服务此前已在运行'
    }

    # 7c. 若本次新启动了 Vite，等 Make 通过心跳文件识别到 runtime 后再开浏览器，
    #     避免 iframe 因为 runtimeOrigin 未就绪而加载空白。
    if (-not $reuseVite) {
        Write-Info '等待 Make 识别本项目 Vite 运行时…'
        $runtimeReady = $false
        $rtDeadline = (Get-Date).AddSeconds(30)
        while ((Get-Date) -lt $rtDeadline) {
            $regResp = Invoke-JsonApi "$adminOrigin/api/projects" 'Get' $null
            if ($regResp.status -eq 200 -and $regResp.body) {
                try {
                    $regData = $regResp.body | ConvertFrom-Json
                    $mine = $regData.projects | Where-Object { $_.id -eq $projectId }
                    if ($mine -and $mine.runtimeStatus -and $mine.runtimeStatus.running) {
                        Write-Good "Make 已识别本项目 Vite (origin=$($mine.runtimeStatus.runtime.origin))"
                        $runtimeReady = $true
                        break
                    }
                } catch { }
            }
            Start-Sleep -Milliseconds 500
        }
        if (-not $runtimeReady) { Write-Warn 'Make 未在 30 秒内识别到 Vite，页面预览可能需手动刷新' }
    }

    $metadataPath = Join-Path $projDir '.axhub\make\project.json'
    $projDirNorm = $projDir.TrimEnd('\').ToLowerInvariant()
    $existingId = $null
    $listResp = Invoke-JsonApi "$adminOrigin/api/projects" 'Get' $null
    if ($listResp.status -eq 200) {
        try {
            $reg = $listResp.body | ConvertFrom-Json
            foreach ($item in $reg.projects) {
                if ($item.id -eq $projectId) { $existingId = $item.id; break }
                if ($item.root -and $item.root.TrimEnd('\').ToLowerInvariant() -eq $projDirNorm) { $existingId = $item.id; break }
            }
        } catch { }
    }
    if ($existingId) {
        $patchUrl = "$adminOrigin/api/projects/$([uri]::EscapeDataString($existingId))"
        $resp = Invoke-JsonApi $patchUrl 'Patch' @{ name = $projectDisplayName; root = $projDir; metadataPath = $metadataPath }
        Write-Info "更新已有注册 [$existingId] -> HTTP $($resp.status)"
        $projectId = $existingId
    } else {
        $resp = Invoke-JsonApi "$adminOrigin/api/projects/make/register-existing" 'Post' @{ root = $projDir }
        Write-Info "新增注册 -> HTTP $($resp.status)"
        if ($resp.status -eq 200 -or $resp.status -eq 201) {
            try {
                $created = $resp.body | ConvertFrom-Json
                if ($created.project.id) { $projectId = $created.project.id }
            } catch { }
        } elseif ($resp.status -ne 409) {
            Write-Warn '注册未成功，管理端可能看不到该项目'
        }
    }

    # ---------- 8/8 打开浏览器并保存状态 ----------
    # 注：不再在 PS1 中 Start-Process。spawn 出来的非交互 PowerShell 没有桌面会话，
    #     Start-Process 会静默失败，浏览器弹不出来。改为：把要打开的 URL 通过标记写到 stdout，
    #     server.mjs 端检测到「AXHUB_LAUNCH_STATUS: done」后由 node 进程用 explorer.exe 打开。
    Write-Step 8 '保存启动状态' '每次执行，很快'
    $openUrl = "$adminOrigin/?projectId=$([uri]::EscapeDataString($projectId))"
    Write-Info $openUrl
    # 显式 ASCII 标记，供工作台提取「要打开的 URL」，避免依赖正则匹配 Write-Info 的着色输出
    Write-Host "AXHUB_OPEN_URL: $openUrl"

    $status = @{
        projectName = $projectDisplayName
        projectId   = $projectId
        vitePort    = $actualVitePort
        makePort    = $MakePort
        viteUrl     = "http://localhost:$actualVitePort/"
        adminUrl    = $openUrl
        reusedVite  = $reuseVite
        startedAt   = (Get-Date).ToUniversalTime().ToString('o')
    } | ConvertTo-Json -Depth 3
    $status | Set-Content -Path $statusPath -Encoding UTF8
    Write-Info $statusPath

    Stop-StepTimer
    $script:Total.Stop()

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ("  启动完成！总耗时 {0}s" -f [math]::Round($script:Total.Elapsed.TotalSeconds, 1)) -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Axhub Make: $openUrl"
    Write-Host "  Vite:       http://localhost:$actualVitePort/"
    Write-Host ""
    Write-Host "  各步骤耗时（>10s 会标黄，是优化重点）：" -ForegroundColor DarkGray
    foreach ($t in $script:Timings) {
        $c = if ($t.Seconds -ge 10) { 'Yellow' } else { 'DarkGray' }
        Write-Host ("    {0,-34} {1,6}s" -f $t.Step, $t.Seconds) -ForegroundColor $c
    }
    Write-Host ""
    # ASCII 标记：避免中文编码问题导致前端轮询识别不到状态
    Write-Host "AXHUB_LAUNCH_STATUS: done"

} catch {
    Stop-StepTimer
    Write-Host ""
    Write-Host "启动失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "排查提示：" -ForegroundColor Red
    Write-Host "  - Make 管理端是全局单例($MakePort)，多项目共用，不要为每个项目单独起一个" -ForegroundColor Red
    Write-Host "  - 每个项目独占一个 Vite 端口(51720起)，可用 -VitePort 手动指定" -ForegroundColor Red
    Write-Host "  - 端口被占死时，先运行 Axhub 根目录的 停止工作台.cmd 再重试" -ForegroundColor Red
    Write-Host "  - 完整日志在 07-日志\launch-<项目>.log" -ForegroundColor Red
    # ASCII 标记：避免中文编码问题导致前端轮询识别不到状态
    Write-Host "AXHUB_LAUNCH_STATUS: failed"
}
