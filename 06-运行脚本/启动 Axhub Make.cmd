@echo off
chcp 65001 >nul
title Axhub Make 启动器
setlocal enabledelayedexpansion

echo ========================================
echo   Axhub Make - 一键启动
echo ========================================
echo.

:: ── 1. 检查服务是否已在运行 ──
netstat -ano | findstr ":53817" | findstr "LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    echo [检测] Make 服务已在运行中，直接打开面板...
    start "" "http://localhost:53817"
    exit /b 0
)

:: ── 2. 检查 Node.js 环境 ──
node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo [错误] 未检测到 Node.js，请先安装！
    pause
    exit /b 1
)
echo [环境] Node.js 已就绪

:: ── 3. 重置为空白首页 ──
set "PROJECTS_FILE=%USERPROFILE%\.axhub\make\projects.json"
if exist "%PROJECTS_FILE%" (
    powershell -NoProfile -Command ^
        "$json = Get-Content '%PROJECTS_FILE%' -Raw -Encoding UTF8 | ConvertFrom-Json; $json.activeProjectId = $null; $json | ConvertTo-Json -Depth 10 | Set-Content '%PROJECTS_FILE%' -Encoding UTF8" 2>nul
    echo [配置] 已重置为空白首页
)

:: ── 4. 启动 Make 服务（后台最小化窗口） ──
echo [启动] 正在拉起 Axhub Make 服务（首次需下载依赖，请耐心等待）...
start "Axhub Make Service" /min cmd /c "set NODE_OPTIONS= && npx -y @axhub/make@latest --no-open"
echo.

:: ── 5. 等待服务就绪（最多 90 秒） ──
echo [等待] 等待服务就绪...
set /a TRIED=0
:loop
timeout /t 2 /nobreak >nul
set /a TRIED+=1
powershell -NoProfile -Command ^
    "try { Invoke-WebRequest -Uri 'http://localhost:53817' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 (
    echo [就绪] 服务启动成功！
    start "" "http://localhost:53817"
    exit /b 0
)
if !TRIED! lss 45 goto loop

:: ── 6. 超时 ──
echo [超时] 等待超过 90 秒仍未响应，请检查网络或手动启动。
pause
exit /b 1
