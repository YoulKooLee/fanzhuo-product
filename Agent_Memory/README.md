# Agent_Memory — 工作台记忆库

> 本目录为 **Axhub 工作台外部记忆层**（2026-08-14 建立），与 AI 内部记忆（`.codebuddy/memery/`）**双写配合**。
> 作用：把踩过的坑、复盘结论以文件形式沉淀，**你可见、可备份、可 grep**；AI 开工前主动读相关类目，降低重复犯错率。
>
> **2026-08-18 升级（任务4 C 档）**：
> - 各文件已补 YAML frontmatter（category/tags/updated/status/priority），供机读检索。
> - 反思为**手动触发**，见 `Agent_Stack/06-reflection/反思协议.md`。
> - 本目录现为 `Agent_Stack/02-knowledge/` 的知识源（引用映射，不重复存储）。

## 工作流程

```
① 踩坑/复盘 → 写：AI 修复 bug 后，按「日期/场景/根因/修复/验证」四要素
                追加到对应类目文件（不在则新建，编号递增）
② 开工前   → 读：AI 处理工作台任务前，先扫相关类目文件，命中类似场景先对照
③ 定期     → 维护：架构变更后核对旧记忆是否过时，过时则更新或标注失效
```

## 记忆索引

| 文件 | 类目 | 覆盖问题 |
| --- | --- | --- |
| `000-文件与操作规范.md` | 用户铁律 | 文件创建规范、备份铁律、锁文件铁律 |
| `001-启动与状态机.md` | 启动/状态机/Make 联动 | 必点两次、starting 状态、Vite+Make 双依赖、launch-log append、touchProjectCtx/reconcile、单项目单状态模型 |
| `002-脚本与编码纪律.md` | 脚本/路径/编码 | PowerShell 5.1 坑、中文路径纪律、.cmd 防闪退、logBase 计算、架构匹配、Make 联动路径正斜杠 |
| `003-布局与前端实现.md` | 前端布局 | Tailwind 4 contents、PrototypeLayout fullWidth、16:9 大屏比例 |
| `004-工作台架构与联动坑.md` | 工作台架构/Make 联动 | make-server 全局单例与 active 错位、启动必点两次、syncMakeActiveProject 时序 |

## 记录状态

| 日期 | 动作 |
| --- | --- |
| 2026-08-14 | 首批导入：AI 内部记忆中的 14 条 Axhub 坑经验 + 1 条文件规范，按类目整理入档 |
| 2026-08-18 | 任务4 C档：各文件补 frontmatter；新增手动反思协议；建立 Agent_Stack 分层（skill/rules/router/archive） |
| 2026-08-28 | 新增 004：从结构监测任务的 AI 内部记忆迁出 5 条工作台专属记忆（架构/53817 active/启动两次/Make 联动时序），集中到工作台记忆库，结构监测侧仅留索引 |
