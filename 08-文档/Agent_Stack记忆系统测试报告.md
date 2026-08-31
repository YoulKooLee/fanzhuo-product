# Agent_Stack 记忆系统测试报告

> 测试日期：2026-08-18
> 测试对象：Agent_Stack 三层作用域记忆系统（workspace / universal / project）
> 测试性质：静态一致性 + 路由逻辑模拟 + 跨工作区路径 + 结项流程 dry-run

## 一、测试范围

本次测试验证 2026-08-18 落地的三层作用域记忆系统是否按设计工作，覆盖 5 大维度：

| 维度 | 内容 | 断言数 |
| --- | --- | --- |
| 静态一致性 | JSON 语法、scope 合法性、规则 id 交叉引用、frontmatter 一致性 | 37 |
| 路由 scope 过滤 | 模拟项目/工作台两种工作区 × 7 个典型请求 | 16 |
| 跨工作区路径 | 模板 6 个相对引用可达性、遗留验证点 | 17 |
| 结项归档流程 | 反思协议第五节流程 dry-run | （并入上项） |
| 模板完整性 | AGENTS.md / project-memory.md 关键章节 | （并入上项） |

**合计：70 断言 = 68 PASS + 0 FAIL + 3 WARN（2 项为预期，1 项为文档歧义）**

## 二、静态一致性（37 PASS + 1 WARN）

全部通过项（摘要）：
- `rules.index.json` / `router.json` JSON 语法有效
- 索引所有条目 scope 合法；索引引用的规则 id 均存在于对应规则文件；规则文件声明的规则 id 均被索引覆盖（无遗漏）
- 索引 scope 与规则文件声明一致（R-SCRIPT→universal、R-START→workspace、R-LAYOUT→universal、R-FILE→universal）
- `router.json`：base 路径存在、所有路由 scope 合法、skills/rules/knowledge 文件引用全部存在、fallback 存在
- 技能 frontmatter scope 一致：axhub-launch=workspace、axhub-layout=[universal,project]、axhub-script=universal
- Agent_Memory frontmatter scope 一致：000=universal、001=workspace、002=universal、003=[universal,project]
- 模板 AGENTS.md：含「工作台记忆引用」章节、相对路径引用、project-memory.md 引用、加载优先级声明
- 模板 project-memory.md：三区完整（项目画像/项目经验/结项状态）、含技术约束占位、声明优先级最高
- 反思协议含结项归档流程；05-archive/README.md 含结项目录
- 跨工作区解析：`../../Agent_Stack` 从项目根/模板目录均可达且解析正确

⚠️ WARN（1 项）：`router.json` 的 `base` 字段指向 `Agent_Stack`，但 `knowledge` 引用 `Agent_Memory/xxx.md` 实际相对 `Axhub/` 根解析。`router.md` 第 53 行已说明此约定（"knowledge 相对 Axhub/ 根"），**功能上无误**，但 `base` 字段语义未覆盖 knowledge，机器解析时容易误判。建议后续在 `router.json` 的 `note` 或 `base` 旁补一行注释，或把 `base` 改名为 `rules_base` 消除歧义（非阻塞）。

## 三、路由 scope 过滤（16 PASS + 0 FAIL）

7 个典型场景模拟结果：

| 场景 | 工作区 | 输入 | 结果 |
| --- | --- | --- | --- |
| S1 | 项目 | "大屏比例调一下，改成21:9" | ✅ 命中 RTE-LAYOUT-03 |
| S2 | 项目 | "启动开发栈" | ✅ RTE-START-01 被 scope 过滤，项目内不加载 workspace 路由 |
| S3 | 项目 | "写个脚本处理路径乱码" | ✅ 命中 RTE-SCRIPT-02 |
| S4 | 项目 | "新建文件放哪" | ✅ 命中 RTE-FILE-04 |
| S5 | 工作台 | "启动开发栈 Make 没启动" | ✅ 命中 RTE-START-01 |
| S6 | 工作台 | "大屏布局乱了三栏塌陷" | ✅ 命中 RTE-LAYOUT-03（仅加载 universal 规则，R-LAYOUT-04 被过滤）|
| S7 | 项目 | "帮我写一份 PRD" | ✅ 命中 RTE-PRODUCT-05 |

关键结论：
- **项目工作区内 workspace 路由/规则全部被过滤**（S2：RTE-START-01 + R-START-01~04 均被过滤）✅
- **工作台任务正常加载 workspace 内容**（S5）✅
- 项目工作区命中 project 路由时，`project-memory.md` 优先级最高（router.note + 模板 AGENTS.md 均声明）✅
- 加载优先级「项目记忆 > universal > workspace」在模板中按行内顺序验证通过 ✅

## 四、跨工作区相对路径（遗留验证点，已通过）

模板 AGENTS.md 前置声明「相对本工程根目录 `../../Agent_Stack/`」，表格内 6 个相对引用全部可解析：

- `01-skill/axhub-launch.md` ✅
- `03-rules/startup.md` ✅
- `01-skill/axhub-script.md` ✅
- `03-rules/script-encoding.md` ✅
- `03-rules/file-ops.md` ✅
- `03-rules/layout.md` ✅

从模拟项目根（`01-项目/健康档案`）解析 `../../Agent_Stack/` 结果与真实 `Agent_Stack` 路径完全一致。

⚠️ 说明：以上为**文件系统可达性**验证。CodeBuddy 在项目工作区打开时是否自动读取工作区外的 `../../Agent_Stack/` 相对路径，取决于 IDE 的 AGENTS.md 引用解析机制，需在真实项目工作区打开时人工确认一次（方案文档已记录此风险）。

## 五、结项归档流程 dry-run（通过）

反思协议第五节「结项归档流程」4 个步骤完整且可执行：

1. **扫描项目记忆**：读取项目根 `project-memory.md` 的项目画像/项目经验 ✅
2. **提炼（跨项目复用 → 工作台层）**：写 `03-rules/` 补 scope: universal/workspace ✅
3. **归档（项目专属 → 05-archive）**：归档到 `05-archive/结项/项目名-日期/` ✅
4. **清理**：遵守 R-FILE-02 先备份 ✅

归档路径命名规范验证：`健康档案-20260818` 格式正确 ✅
`05-archive/结项/` 目录按需创建（当前未建，符合"结项时才建"）✅

⚠️ WARN（预期）：存量 7 个项目均无 `project-memory.md`（符合"存量按需补"决策）。健康档案无记忆时 project 层为空、回落 universal——符合设计。**结项前应先补记忆再归档**，否则无内容可提炼。

## 六、结论

| 结论 | 状态 |
| --- | --- |
| 三层作用域模型（scope 标注/过滤/优先级）按设计工作 | ✅ 通过 |
| 规则 id、文件引用、frontmatter 全链路一致 | ✅ 通过 |
| 模板 AGENTS.md + project-memory.md 完整可用 | ✅ 通过 |
| 跨工作区相对路径文件系统层可达 | ✅ 通过 |
| 结项归档流程定义完整可执行 | ✅ 通过 |
| router.json base 字段语义对 knowledge 有歧义 | ⚠️ 建议后续消歧（非阻塞） |
| 存量项目无 project-memory.md | ⚠️ 符合决策，按需补 |

**测试结论：系统就绪，可进入实际使用。** 唯一需人工确认的点是 CodeBuddy 在真实项目工作区能否通过 `../../Agent_Stack/` 读取工作区外文件（见第四节说明）。

## 七、测试方法备注

- 测试脚本：`agent-stack-test.mjs`（静态一致性）、`agent-stack-router-test.mjs`（路由模拟）、`agent-stack-workspace-test.mjs`（跨工作区+结项）
- 脚本为一次性调试用途，已在使用完毕后清理
- 涉及中文路径，均通过 UTF-8 脚本 + `$env:USERPROFILE` 拼接执行，规避 PowerShell 编码问题
