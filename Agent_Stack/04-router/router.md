# 04-router — 触发路由说明

> 作用：AI 处理任务前，按「用户意图」自动加载对应的 skill、规则、知识库。
> 配置：`router.json`（机读）。核心原则：**不做硬编码 if-else，做「语义意图 + 关键词兜底 + fallback」**。

## scope 加载过滤（2026-08-18 起）

路由带 `scope` 字段，按当前工作区过滤：

| scope | 含义 | 何时加载 |
| --- | --- | --- |
| `workspace` | 工作台层（启动/状态机/Make） | 仅以 Axhub 根 / axhub-manager 为工作区的工作台任务 |
| `universal` | 通用层 | 所有任务 |
| `project` | 项目层（比例/风格等以项目为准） | 命中时先读项目根 `project-memory.md` |

加载优先级：**project（项目记忆）> universal > workspace**。项目工作区（`01-项目/XXX`）内不加载 workspace 路由。

## 匹配流程（AI 遵循）

```
用户请求
  ↓
① 判断工作区：项目 or 工作台？（项目内先读 project-memory.md，若存在）
  ↓
② 意图分类（LLM 语义理解）→ 候选 intent
  ↓
③ 按 router.json routes 数组顺序（priority）匹配：
   - 先看 semantic 提示是否吻合
   - 再看 keywords 是否命中
   - 命中第一个 → 停止
  ↓
④ scope 过滤：命中 route 的 scope 不适用于当前工作区 → 跳过，继续匹配
  ↓
⑤ 命中 route：按 load 加载 skills / rules / knowledge，开工
  ↓
⑥ 全不命中：走 fallback（general），用通用能力，不中断
```

## 路由表

| id | 意图 | scope | 触发关键词 | 加载 skill | 加载 rules | 加载 knowledge |
| --- | --- | --- | --- | --- | --- | --- |
| RTE-START-01 | 启动/状态机 | workspace | 启动/Make/必点两次 | axhub-launch | startup.md | Agent_Memory/001 |
| RTE-SCRIPT-02 | 脚本/编码 | universal | 脚本/中文/架构 | axhub-script | script-encoding.md | Agent_Memory/002 |
| RTE-LAYOUT-03 | 前端布局 | universal+project | 布局/大屏/塌陷 | axhub-layout | layout.md | Agent_Memory/003 |
| RTE-FILE-04 | 文件/操作 | universal | 新建文件/备份 | — | file-ops.md | Agent_Memory/000 |
| RTE-PRODUCT-05 | 产品设计 | universal | PRD/原型/创意 | prd-writer 等 | — | — |
| fallback | 兜底 | — | 都不命中 | general | — | — |

## 维护

- **新增路由**：在 router.json 加 route，按 id 递增（RTE-XXX-NN），**必须补 scope**。
- **路径说明**：load 里的 skills/rules 相对 `base`（Agent_Stack）路径，knowledge 相对 `Axhub/` 根。
- **优先级**：数组顺序 + priority（数字大优先），命中即止。
- **新增规则/技能**：同步补 `rules.index.json` / `SKILL.index.md` 的 scope，避免漏加载。
