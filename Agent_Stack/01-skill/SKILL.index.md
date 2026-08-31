# Skill 索引（01-skill）

> 程序性记忆：知道「怎么做」。AI 处理任务时，先按触发词匹配 skill。

| skill | 类目 | scope | 触发词 | 对应规则 | 对应知识 |
| --- | --- | --- | --- | --- | --- |
| `axhub-launch.md` | 启动/状态机 | workspace | 启动, 开发栈, Make, 必点两次, 已停止, 状态机 | startup.md (R-START-*) | Agent_Memory/001 |
| `axhub-layout.md` | 前端布局 | universal + project | 布局, 大屏, 塌陷, contents, 比例, fullWidth, Tailwind | layout.md (R-LAYOUT-*) | Agent_Memory/003 |
| `axhub-script.md` | 脚本/编码 | universal | 脚本, 路径, 编码, cmd, 中文, 架构, 乱码, spawn | script-encoding.md (R-SCRIPT-*) | Agent_Memory/002 |

> **scope 说明**：`workspace` 仅工作台任务加载；`universal` 所有任务加载；`project` 先读项目 `project-memory.md`（比例/风格以项目为准）。

## 使用方式

1. 接任务 → 看用户意图命中哪个 skill 的 trigger。
2. 加载对应 skill 文件 → 按「流程步骤」执行。
3. 同时加载对应规则（`03-rules/`）和知识（`Agent_Memory/`）。

## 新增 skill 规范

- 复杂任务完成后，若可复用 → 写成 SKILL.md（frontmatter + 触发场景 + 流程 + 踩坑清单）。
- 在本文档登记，并在 `04-router/router.json` 加对应路由。
