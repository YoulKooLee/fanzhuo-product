@echo off
setlocal enabledelayedexpansion
title Axhub 工作台停止器
cd /d "%~dp0"

echo ============================================
echo   Axhub 产品设计工作台 - 停止脚本
echo ============================================
echo.

call :killport 7788 "工作台管理面板 - Axhub Manager"
call :killport 53817 "Axhub Make 单例"
call :killport 32124 "Axhub ACP 协作服务"
call :killvite
call :killport 8899 "原型预览服务器"

call :cleanstate

echo.
echo ============================================
echo   操作完成。下面是被处理的服务汇总：
echo   ·工作台管理面板 (7788) · Make 单例 (53817) · ACP 协作 (32124)
echo   · Vite 开发栈 (517xx) · 原型预览服务器 (8899)
echo   如某项显示 [--] 表示它本来就没在运行。
echo ============================================
echo 按任意键关闭本窗口...
pause
exit /b

:killport
set "PORT=%~1"
set "NAME=%~2"
set "PID="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTEN"') do set "PID=%%a"
if not defined PID (
  echo [--] %NAME%  [端口 %PORT%]：未运行
  goto :eof
)
taskkill /PID !PID! /T /F >nul 2>&1
set "STILL="
for /f "tokens=5" %%b in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTEN"') do set "STILL=1"
if defined STILL (
  echo [X] %NAME%  [端口 %PORT%] PID !PID!：结束失败，请手动在任务管理器结束该进程
) else (
  echo [OK] %NAME%  [端口 %PORT%] PID !PID!：已停止
)
goto :eof

:killvite
set "FOUND=0"
for /f "tokens=2,5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr /r ":517[0-9][0-9] "') do (
  taskkill /PID %%b /T /F >nul 2>&1
  echo [OK] Vite 开发服务器 [端口 %%a] PID %%b：已停止
  set "FOUND=1"
)
if "!FOUND!"=="0" echo [--] 未发现运行中的 Vite 开发服务器 (51700-51799)
goto :eof

:cleanstate
set "WF=%~dp0.workbuddy\workspace.json"
if exist "%WF%" (
  del /f /q "%WF%" >nul 2>&1
  echo     [OK] workspace.json cleaned
) else (
  echo     [--] workspace.json not found
)
set "PI=%~dp0.workbuddy\projects-info.json"
if exist "%PI%" del /f /q "%PI%" >nul 2>&1
for /d %%p in ("%~dp001-*\*") do (
  if exist "%%p\.workbuddy\current.json" del /f /q "%%p\.workbuddy\current.json" >nul 2>&1
)
echo     [OK] project current.json cleaned
goto :eof
