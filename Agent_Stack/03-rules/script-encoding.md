# 规则库 — 脚本编码纪律（R-SCRIPT-*）

> 来源：Agent_Memory/002-脚本与编码纪律.md。level: must/never 见各条。
> 索引入口：`rules.index.json` → trigger「脚本/路径/编码/中文/架构」。
> **scope: universal**（所有项目通用）。

## R-SCRIPT-01 — 含空格路径 spawn 用 .NET Process
- **level**: must | **status**: valid
- **trigger**: 要 spawn Node/进程，且路径含空格（Program Files、Documents\AI work）
- **rule**: 用 `[System.Diagnostics.Process]::Start($psi)`，勿用 `Start-Process -ArgumentList` 数组
- **reason**: Start-Process 数组按空格拆参，导致 `Cannot find module 'C:\Users\游翔\Documents\AI'` 截断
- **verify**: 不再报 Cannot find module / 文件名语法不正确

## R-SCRIPT-02 — 中文路径不内联命令行
- **level**: must | **status**: valid
- **trigger**: 命令行要操作含中文的路径
- **rule**: 用 write_to_file 写 UTF-8 .mjs/.js，内部用字面量中文路径，node 执行；node 脚本本身在中文路径时，用 `$env:USERPROFILE` 拼接 + 相对路径执行
- **reason**: 命令行传中文会 GBK/UTF-8 混乱（"游翔"→"娓哥繑"）
- **verify**: 路径不出现乱码，模块能找到

## R-SCRIPT-03 — .cmd 必须 GBK/ANSI
- **level**: must | **status**: valid
- **trigger**: 新建/修改 .cmd/.bat 批处理
- **rule**: 用 GBK/ANSI 编码保存，不用 UTF-8；用子函数结构 `call :killport`，勿用 chcp 936 + if not errorlevel 1 嵌套
- **reason**: UTF-8 会让 cmd 中文乱码、goto 标签失败；平铺复杂嵌套会字节错位闪退
- **verify**: 改 .cmd 用 node + `[System.Text.Encoding]::GetEncoding('GBK')` 写；EXIT=0 且无乱码

## R-SCRIPT-04 — spawn 子进程剔除 IDE 环境变量
- **level**: must | **status**: valid
- **trigger**: spawn Make/Vite 等子进程
- **rule**: 剔除 `NODE_OPTIONS=--require=...node-language-shim.cjs` 和 `CODEBUDDY_SAFE_DELETE_ENABLED=1`
- **reason**: IDE 注入这两个变量会劫持子进程 fs 删除，触发 SAFE_DELETE_BULK_CONFIRM_REQUIRED
- **verify**: 子进程不触发 SAFE_DELETE 劫持

## R-SCRIPT-05 — 永不删锁文件解架构
- **level**: never | **status**: valid
- **trigger**: vite 起不来 / 报原生包架构不匹配
- **rule**: **永不删** package-lock.json / pnpm-lock.yaml；用 `npm install` 按当前平台重装
- **reason**: 锁文件是双架构的（win32-arm64 + win32-x64），不锁架构；删除会破坏依赖版本一致性、native 模块错乱
- **verify**: 原生包（esbuild/rollup）匹配当前 arm64 平台

## R-SCRIPT-06 — 路径计算不过滤非 ASCII
- **level**: must | **status**: valid
- **trigger**: 计算 Windows 文件系统路径（如 logBase）
- **rule**: 只替换 `/` 和 `\`：`safeName(relative).replace(/[\\/]+/g,'-')`，**保留中文**
- **reason**: 用 `[^a-zA-Z0-9]` 过滤会把中文项目名全替换，导致多个项目映射到同一文件
- **verify**: 学校卫生/健康档案/演示项目 映射到不同 log

## R-SCRIPT-07 — 路径比较统一正斜杠
- **level**: must | **status**: valid
- **trigger**: 比较两个路径是否相等（如 Make 联动 root 匹配）
- **rule**: 两端都 norm：`const norm = s => String(s).replace(/\\/g,'/').toLowerCase().replace(/\/+$/,'')`
- **reason**: path.join 返回反斜杠，与外部正斜杠永远不匹配
- **verify**: Make active 能切到目标项目
