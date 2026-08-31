# Agent_Stack — Axhub 自建 Agent 层

> 在 CodeBuddy 基础上，为 Axhub 工作台搭建的自建 Agent 层（skill + 知识库 + 规则库 + 触发路由 + 反思）。
> 2026-08-18 由 AI 落地，方法论参考《AI Agent 记忆系统四层架构与八套方案》。

## 目录地图

| 目录 | 文章对应 | 作用 | 关键文件 |
| --- | --- | --- | --- |
| `01-skill/` | 程序性记忆 | 知道怎么做（可复用流程） | axhub-launch / axhub-layout / axhub-script |
| `02-knowledge/` | 语义记忆 | 知道什么（背景知识） | README（映射 Agent_Memory） |
| `03-rules/` | 热记忆 | 守规矩（触发命中） | rules.index.json + 4 个分类 |
| `04-router/` | 检索/路由 | 找对路（意图→资产） | router.json + router.md |
| `05-archive/` | 冷回溯 | 历史复盘归档 | README |
| `06-reflection/` | 反思 | 手动触发记忆整理 | 反思协议.md |

## 作用域模型（scope）

2026-08-18 起，所有记忆/规则/技能/路由按三层作用域标注，与用户日常工作方式匹配：

| scope | 含义 | 存放 | 谁加载 |
| --- | --- | --- | --- |
| `workspace` 工作台层 | 只跟工作台本身有关（启动/状态机/Make） | Agent_Stack | 工作台任务（以 Axhub 根为工作区） |
| `universal` 通用层 | 所有项目通用方法论/铁律 | Agent_Stack | 所有任务 |
| `project` 项目层 | 只对特定项目有意义（需求/风格/比例等） | 项目根目录 `project-memory.md` | 仅该项目任务 |

**加载优先级：project（项目记忆）> universal > workspace。**
同主题冲突时，项目记忆覆盖通用规则。项目工作区内只加载 universal 与 project 记忆；workspace 层仅在处理工作台本身问题时加载。

## 与现有资产的关系

```
Agent_Stack/                    ← 本层（新）
├── 01-skill/                   ← 新增 Axhub 专属 skill
├── 02-knowledge/ → 引用 →  Agent_Memory/   ← 现有记忆库（已补 frontmatter）
├── 03-rules/     ← 提炼自 ←  Agent_Memory/
├── 04-router/                  ← 路由映射到 skill/rules/knowledge
├── 05-archive/                 ← 归档复盘
└── 06-reflection/              ← 反思协议（手动）
```

## 使用方式（AI 开工前）

1. **判断工作区**：当前工作区是项目（`01-项目/XXX/`）还是工作台（Axhub 根 / axhub-manager）？项目内先读该项目 `project-memory.md`（若存在）。
2. **匹配路由**：读 `04-router/router.json`，按用户意图命中对应 route；**按 scope 过滤**——项目工作区只加载 `universal`，工作台任务才加载 `workspace`。
3. **加载三件套**：
   - skill：`01-skill/<匹配>.md`（按流程做）
   - rules：`03-rules/<匹配>.md`（守规矩）
   - knowledge：`Agent_Memory/<匹配>.md`（懂背景）
4. **执行**：按 skill 流程 + 遵守 rules；与项目记忆冲突时以项目记忆为准。
5. **记录**：踩新坑 → 先记项目 `project-memory.md`；判定可跨项目复用 → 提炼规则到 `03-rules/`（补 scope）。
6. **反思**：仅当用户说「反思/复盘记忆/结项」时，执行 `06-reflection/反思协议.md`。

## 日常维护

| 动作 | 时机 | 位置 |
| --- | --- | --- |
| 记原始坑 | 踩坑修复后 | Agent_Memory/对应类目 |
| 提炼规则 | 坑可复用 | 03-rules/对应类目 + rules.index.json |
| 沉淀 skill | 流程可复用 | 01-skill/ + SKILL.index.md |
| 加路由 | 新场景 | 04-router/router.json |
| 归档复盘 | 每次大排查 | 05-archive/YYYY/MM/ |
| 反思整理 | 用户要求时 | 06-reflection/反思协议.md → 落 archive |

## 备份

- 2026-08-18 落地前已备份现有 Agent_Memory 到 `03-备份/Agent_Memory-20260818/`。
