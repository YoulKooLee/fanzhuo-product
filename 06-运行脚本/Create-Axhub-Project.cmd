@echo off
chcp 65001 >nul
title Create Axhub Make Project
setlocal enabledelayedexpansion

:: ====================================
::  配置区域（可按需修改）
:: ====================================
set "AXHUB_DIR=%USERPROFILE%\Documents\AI work\Axhub"
set "TEMPLATE_DIR=%AXHUB_DIR%\_project-template"
set "MAKE_SERVER_PORT=53817"
set "MAX_WAIT_SECONDS=30"

:: ====================================
::  检查模板
:: ====================================
echo.
echo ========================================
echo   创建新的 Axhub Make 项目
echo ========================================
echo.

if not exist "%TEMPLATE_DIR%" (
    echo [错误] 项目模板不存在: %TEMPLATE_DIR%
    echo 请检查 %AXHUB_DIR% 目录下是否有 _project-template 文件夹。
    pause
    exit /b 1
)

if not exist "%TEMPLATE_DIR%\.axhub\make\client.json" (
    echo [错误] 模板缺少客户端标识文件 .axhub\make\client.json
    echo 请重新初始化模板。
    pause
    exit /b 1
)

:: ====================================
::  获取项目名称
:: ====================================
set /p PROJECT_NAME="请输入新项目名称 (如 my-project): "

:: 去空格
set "PROJECT_NAME=%PROJECT_NAME: =%"

if "%PROJECT_NAME%"=="" (
    echo [错误] 项目名称不能为空
    pause
    exit /b 1
)

:: 检查非法字符（使用延迟扩展避免变量值中的特殊字符破坏管道）
echo !PROJECT_NAME!| findstr /r "[*?^<^>|:\\/]" >nul
if !errorlevel! equ 0 (
    echo [错误] 项目名称包含非法字符（* ? ^< ^> | : \ / ）
    echo 请使用字母、数字、连字符或下划线。
    pause
    exit /b 1
)

set "NEW_PROJECT_DIR=%AXHUB_DIR%\%PROJECT_NAME%"

if exist "%NEW_PROJECT_DIR%" (
    echo [错误] 目录已存在: %NEW_PROJECT_DIR%
    echo 请使用其他名称，或先删除已有目录。
    pause
    exit /b 1
)

:: ====================================
::  复制模板
:: ====================================
echo.
echo ┌─ 正在创建项目 ──────────────────────────┐
echo   项目名称: %PROJECT_NAME%
echo   目标路径: %NEW_PROJECT_DIR%
echo └──────────────────────────────────────────┘
echo.

robocopy "%TEMPLATE_DIR%" "%NEW_PROJECT_DIR%" /E /NFL /NDL /NJH /NJS

if !errorlevel! gtr 7 (
    echo [错误] 复制模板失败（robocopy 错误码: !errorlevel!）
    pause
    exit /b 1
)

:: ====================================
::  生成唯一项目身份文件 (client.json)
:: ====================================
echo.
echo [1/4] 生成项目身份标识...

set "CLIENT_FILE=%NEW_PROJECT_DIR%\.axhub\make\client.json"
(
echo {
echo   "schemaVersion": 1,
echo   "kind": "axhub-make-client",
echo   "repository": "https://gitee.com/axhub/Axhub-Make/tree/main/client",
echo   "templateUrl": "https://gitee.com/axhub/Axhub-Make/releases/download/make-client-template-v0.1.11/axhub-make-client-template.zip",
echo   "templateVersion": "0.1.11",
echo   "project": {
echo     "id": "%PROJECT_NAME%",
echo     "name": "%PROJECT_NAME%"
echo   }
echo }
) > "%CLIENT_FILE%"

echo   项目 ID: %PROJECT_NAME%
echo   项目名称: %PROJECT_NAME%

:: ====================================
::  安装依赖
:: ====================================
echo.
echo [2/4] 安装项目依赖 (npm install)...
echo   这可能需要 1~3 分钟，请耐心等待...
echo.

cd /d "%NEW_PROJECT_DIR%"
call npm install

if !errorlevel! neq 0 (
    echo.
    echo [警告] npm install 遇到错误。
    echo 稍后可手动在项目目录中运行: npm install
    echo 这可能是因为网络问题或平台不兼容。
    echo 如果是 Windows ARM64 设备，这是正常现象，重试即可。
)

:: ====================================
::  检查 / 启动 Make 服务
:: ====================================
echo.
echo [3/4] 检查 Axhub Make 服务...

netstat -ano | findstr /C:":%MAKE_SERVER_PORT%" | findstr "LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    echo   Make 服务已在运行 (localhost:%MAKE_SERVER_PORT%)。
) else (
    echo   Make 服务未运行，正在启动...
    start /b "" cmd /c "npx -y @axhub/make@latest --no-open >nul 2>&1"
    echo   等待服务就绪...

    set /a LOOP_COUNT=0
    :check_loop
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr /C:":%MAKE_SERVER_PORT%" | findstr "LISTENING" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   Make 服务已就绪。
    ) else (
        set /a LOOP_COUNT+=1
        if !LOOP_COUNT! lss 15 goto check_loop
        echo   [提示] 等待超时，服务可能仍在启动中。
        echo   稍后可直接在浏览器打开 http://localhost:%MAKE_SERVER_PORT%
    )
)

:: ====================================
::  打开面板
:: ====================================
echo.
echo [4/4] 打开 Make 管理面板...
start "" "http://localhost:%MAKE_SERVER_PORT%"

:: ====================================
::  完成
:: ====================================
echo.
echo ========================================
echo  项目创建成功!
echo ========================================
echo.
echo   项目路径: %NEW_PROJECT_DIR%
echo.
echo ┌─ 下一步 ───────────────────────────────────┐
echo ^|                                             ^|
echo ^|  1. 在 CodeBuddy 中打开此项目目录            ^|
echo ^|      File ^> Open Folder                     ^|
echo ^|      (%NEW_PROJECT_DIR%)       ^|
echo ^|                                             ^|
echo ^|  2. 启动开发服务器:                          ^|
echo ^|     cd /d "%NEW_PROJECT_DIR%"            ^|
echo ^|     npm run dev                             ^|
echo ^|                                             ^|
echo ^|  3. 在 Make 面板中注册本项目:                ^|
echo ^|     点击「+」→ 选择项目目录                  ^|
echo ^|     或重启面板后自动检测                     ^|
echo ^|                                             ^|
echo └─────────────────────────────────────────────┘
echo.
echo   系统要求: Node.js ^>= 18, npm ^>= 9
echo   平台支持: x64 / ARM64 (骁龙 / Surface)
echo.
echo   遇到问题?
echo     - npm install 失败: 检查网络，重试即可
echo     - Make 面板不显示项目: 在面板中点击「+」手动注册
echo     - 启动报错 iconv-lite: 运行 npm install 补全依赖
echo.

pause
exit /b 0
