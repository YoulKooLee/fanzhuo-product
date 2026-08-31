# 02-knowledge — 语义记忆（知识库）

> 本层**不重复存储**内容，只做**引用映射**到 Axhub 现有记忆库 `Agent_Memory/`。
> 避免双份拷贝失同步。知识源以 `Axhub/Agent_Memory/` 为准。

## 知识映射表

| 本层引用 | 实际文件 | 类目 |
| --- | --- | --- |
| `000-文件与操作规范.md` | `Axhub/Agent_Memory/000-文件与操作规范.md` | 用户铁律 |
| `001-启动与状态机.md` | `Axhub/Agent_Memory/001-启动与状态机.md` | 启动/Make |
| `002-脚本与编码纪律.md` | `Axhub/Agent_Memory/002-脚本与编码纪律.md` | 脚本/编码 |
| `003-布局与前端实现.md` | `Axhub/Agent_Memory/003-布局与前端实现.md` | 前端布局 |

## 加载规则

- AI 开工前，按任务匹配，读对应 `Agent_Memory/` 文件（如启动任务读 001）。
- 本层是「背景知识」（知道什么），执行约束看 `03-rules/`，流程看 `01-skill/`。

## 如何扩展

- 新增知识 → 直接追加到对应 `Agent_Memory/` 文件，本层无需改动（引用自动生效）。
- 新增类目 → 在 `Agent_Memory/` 建新文件，并在本 README 映射表登记。
