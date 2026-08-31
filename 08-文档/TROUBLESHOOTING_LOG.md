# Axhub Make 启动与运行复盘日志
> 记录于 `C:\Users\游翔\Documents\AI work\Axhub\`

## 如何记录
每次出现问题时：
1. 追加一条记录到**下方**（按日期降序）
2. 描述症状 → 根因 → 修复方法 → 预防建议

---

## 记录

### 2026-07-27 · 分组管理页面 iot-group 渲染为空
- **症状**：分组管理页面内容为空，Make UI 侧边栏折叠
- **根因**：`React.createElement('td', { style: styles.tableCell, color: Theme.primary })` 中 `color` 属性位于 `style` 同级，不符合 React createElement 规范
- **修复**：改为 `{ style: Object.assign({}, styles.tableCell, { color: Theme.primary }) }`
- **预防**：始终将样式属性放在 `style` 对象内，不要混用在属性层级

### 2026-07-27 · 告警列表页面变异失败
- **症状**：告警列表 `Unexpected token, expected ","` 错误
- **根因**：`statusFilter.map()` 返回多个 `<span>` 元素后，接着的 `<select>` 元素包含 `onChange` 回调中有复杂数组操作导致解析二义性
- **修复**：简化代码，移除动态状态过滤 chips，替换为静态标签
- **预防**：React.createElement 的子元素中避免复杂的内联表达式（map + filter 组合）

### 2026-07-27 · 多个页面 JSX 解析失败（原型编译失败）
- **症状**：iot-product、iot-debug、alarm-event 等页面提示 `Unexpected token` 或 `The character ">" is not valid` 错误
- **根因**：批量生成脚本中字符串拼接错误，border 值使用三引号 `'''1px solid '''+C.border+'''`
- **修复**：脚本修复引号格式，将 `'''` 替换为正确 JSX 字符串
- **预防**：生成脚本中注意 JSX 语法规范，在 React.createElement 中注意字符串引号格式

### 2026-07-27 · Make 服务崩溃（Failed to fetch）
- **症状**：浏览器页面报 `Failed to fetch`，Make 服务端口 53817 无响应
- **根因**：Make 服务进程意外终止，但 Vite（51720）仍在运行
- **修复**：单独重启 Make 服务 `node node_modules/@axhub/make/bin/cli.mjs . --no-open`
- **预防**：`启动 Axhub Make.bat` 中已包含独立检测和重启逻辑

### 2026-07-27 · Vite 能正常启动后又被 `--no-optional` 破坏
- **症状**：Vite 再次提示缺少 `@esbuild/win32-arm64`
- **根因**：误操作 `npm install @axhub/make --no-optional` 删除了 esbuild ARM64 模块
- **修复**：npm 缓存自动恢复
- **预防**：记录到复盘日志，避免下次再犯

### 2026-07-24 · 端口 51720 被残留 Vite 进程占用
- **症状**：MAKE_CLIENT_DEV_TIMEOUT，Make 客户端启动超时
- **根因**：上次 Vite 开发服务器没有正常关闭，进程卡在后台，新请求无法绑定端口
- **修复**：`taskkill /F /PID {PID}` 杀掉残留进程
- **预防**：启动脚本中加入 `netstat + taskkill` 自动清理

### 2026-08-10 · ACP 本地服务（32124）连接失败 / fetch failed
- **症状**：Axhub Make AI 设置报 `ACP UI 未就绪：ACP UI 页面探测失败: fetch failed`；`curl http://localhost:32124/api/chat` 无响应；Make UI（53817）正常但工作栈连不上 ACP。
- **根因**：**CodeBuddy CN 桌面应用给所有 node 子进程注入了 `NODE_OPTIONS=--require="C:/Users/游翔/AppData/Local/Programs/CodeBuddy CN/resources/app/extensions/genie/out/vendor/shim/node-language-shim.cjs"`**。该路径含**中文（游翔）+ 空格（CodeBuddy CN）**，Make 的启动命令 `npx -y @axhub/acp@latest ...` 在 CodeBuddy 环境里执行时，node 加载该 shim 失败 → ACP（Next.js）进程启动即崩 → 32124 端口无服务 → fetch failed。与"版本更新导致无法识别 CLI"同源（同一 NODE_OPTIONS 注入）。
  - 验证：`[System.Environment]::GetEnvironmentVariable('NODE_OPTIONS','Process')` 可见该 `--require` 值；端口 32124 用 `netstat` 查无 LISTEN。
- **修复（临时/已验证）**：在**清空 NODE_OPTIONS 的独立环境**中启动 ACP：
  ```cmd
  cmd /c "set NODE_OPTIONS= && npx -y @axhub/acp@latest --port 32124 --cors-origin http://localhost:53817,http://127.0.0.1:53817,http://172.16.41.48:53817"
  ```
  验证：`Invoke-WebRequest http://localhost:32124/api/chat` 返回 **HTTP 200**，ACP 正常起来（Next.js 16.x）。
- **根治（方案 B，推荐固化）**：把 Make AI 设置里的"启动命令"改为上面带 `cmd /c "set NODE_OPTIONS= && ..."` 包裹的版本，使每次点启动都先清掉注入变量，不再依赖手动跑命令。注意 `启动 Axhub Make.cmd` 第 38 行 `npx -y @axhub/make@latest` 同理也会被污染，建议同样加 `set NODE_OPTIONS=` 前缀。
- **易错点**：
  - 在 PowerShell inline 里写 `set NODE_OPTIONS=` 或 `$env:NODE_OPTIONS=''` **无效**——父进程注入的 NODE_OPTIONS 在 node 启动前已生效，顺序反了；必须用 `cmd /c "set NODE_OPTIONS= && ..."` 让赋值先于子进程启动。
  - `npx` 在 `Start-Process -FilePath "npx"`（无 shell）时报"不是有效 Win32 应用"，需 `shell:true` 或用 `cmd /c` 包裹。
  - PowerShell 读 `.ps1`/中文路径易因 GBK 编码乱码；排查类脚本用 **Node（原生 UTF-8）** 写更稳，例如 `node xxx.cjs`。

## 端口与服务地图（速查）

| 端口 | 服务 | 启动方式 | 备注 |
|---|---|---|---|
| 7788 | Axhub 工作台管理面板 (axhub-manager) | `启动工作台.cmd` | 后端 server.mjs，日志 server-console.log |
| 53817 | Axhub Make 单例 | `启动 Axhub Make.cmd` / `npx @axhub/make@latest` | Make UI，对应 Make URL |
| 32124 | ACP 本地 AI 服务 | Make AI 设置"启动命令"（npx @axhub/acp） | **必须清空 NODE_OPTIONS 才能起** |
| 517xx | Vite 开发栈（Digital Twin 项目） | `node_modules/.bin/vite` | 项目路径见下 |

## 命令速查

```cmd
:: 检查端口占用
netstat -ano | findstr {PORT}

:: 杀掉进程
taskkill /F /PID {PID}

:: 启动 Vite
cd /d "C:\Users\游翔\Documents\AI work\Axhub\Digital Twin\数字孪生"
node_modules\.bin\vite.cmd

:: 启动 Make 服务
node node_modules\@axhub\make\bin\cli.mjs . --no-open

:: 安装 ARM64 模块
npm install @esbuild/win32-arm64
npm install @rollup/rollup-win32-arm64-msvc

::: 启动 ACP（必须清空 NODE_OPTIONS，否则 CodeBuddy 注入的 shim 会导致启动崩溃）
cmd /c "set NODE_OPTIONS= && npx -y @axhub/acp@latest --port 32124 --cors-origin http://localhost:53817,http://127.0.0.1:53817,http://172.16.41.48:53817"

::: 验证 ACP /api/chat 可达（应返回 HTTP 200）
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'http://localhost:32124/api/chat' -UseBasicParsing -TimeoutSec 5 | Select-Object StatusCode"

::: 查看当前 NODE_OPTIONS（排查注入问题）
[System.Environment]::GetEnvironmentVariable('NODE_OPTIONS','Process')

::: 查看端口占用
netstat -ano | findstr :32124
netstat -ano | findstr :53817
```

> **关键环境变量坑**：CodeBuddy CN 会向所有子进程注入 `NODE_OPTIONS=--require="…\CodeBuddy CN\…\node-language-shim.cjs"`（路径含中文+空格）。任何 `npx`/node 启动的本地服务（Make、ACP 等）都必须先 `set NODE_OPTIONS=` 再启动，否则进程启动即崩。PowerShell inline 的 `$env:NODE_OPTIONS=''` 因赋值晚于进程启动而无效，务必用 `cmd /c "set NODE_OPTIONS= && ..."`。
