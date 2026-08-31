# 规则库 — 文件与操作规范（R-FILE-*）

> 来源：Agent_Memory/000-文件与操作规范.md。level: must/never。
> 索引入口：`rules.index.json` → trigger「新建文件/存放/备份/删除」。
> **scope: universal**（用户铁律，所有项目通用）。

## R-FILE-01 — 新建文件先询问存放地点
- **level**: must | **status**: valid
- **trigger**: 要在用户电脑新建文件夹/文件
- **rule**: 先询问存放地点，不得擅自创建在 C:\temp、C:\tmp、C:\c 或任意临时路径
- **分类**：工作台相关 → `Axhub\` 按规范分类（脚本→06-运行脚本，记忆→Agent_Memory，备份→03-备份，复盘→08-文档）；无关 → `Documents_AI\`
- **verify**: 每步新建前已获用户确认位置

## R-FILE-02 — 破坏性操作前先备份
- **level**: must | **status**: valid
- **trigger**: 对项目做破坏性/删除性操作
- **rule**: 先备份原文件到同目录 `.bak-时间戳`，或确认备份目录有可恢复副本
- **reason**: 防误删无法恢复
- **verify**: 操作前已有可恢复备份

## R-FILE-03 — 一次性调试脚本用完即删
- **level**: must | **status**: valid
- **trigger**: 为完成任务创建一次性调试脚本
- **rule**: 任务结束立即删除，不留残留
- **verify**: 任务完成后无遗留临时脚本

## R-FILE-04 — 工具/IDE 目录禁止干预
- **level**: never | **status**: valid
- **trigger**: 看到用户主目录隐藏目录（.axhub/.codebuddy/.workbuddy/.cursor 等）
- **rule**: 均为工具/IDE 自行生成，**禁止 AI 干预**
- **verify**: 不修改这些目录内容
