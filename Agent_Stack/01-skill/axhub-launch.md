---
name: axhub-launch
type: skill
category: 启动状态机
description: 启动开发栈、项目状态机、Make 联动、处理"必点两次"类问题
scope: workspace
trigger: [启动, 开发栈, Make, 必点两次, 已停止, 状态机, starting]
updated: 2026-08-18
---

# Skill: axhub-launch — 启动 / 状态机 / Make 联动

> 作用：处理 Axhub 工作台项目启动、运行状态、Make 客户端联动的全套流程。
> 依赖规则：`03-rules/startup.md`（R-START-*），知识：`Agent_Memory/001-启动与状态机.md`。

## 触发场景

- 用户说"启动开发栈 / 启动项目 / Make 没启动 / 必点两次 / 项目显示已停止"
- 状态显示异常（启动中/已停止乱跳）
- Make 客户端未聚焦到刚启动的项目

## 流程步骤

### 步骤1：识别启动链路（先确认依赖）

启动开发栈 = `启动工作台.cmd` → server.mjs spawn `launch-project.ps1` → Vite(517xx) + Make(53817)。
**关键铁律（R-START-03）**：只有 Vite + Make **都健康**才算启动完成，单一服务就绪 ≠ 完成。

### 步骤2：用状态机诊断

1. 调 `GET /api/context/current` 看项目当前 status。
2. 判断状态：
   - `starting` → 启动中，**不要判死**（R-START-02），继续等。
   - `stopped` → 检查是主动停还是被动停，排查进程。
   - `editing/active` → 已就绪，检查 Make 是否聚焦（R-START-04）。

### 步骤3：处理"必点两次"问题

**根因自查**（R-START-01）：
1. launch-log 解析是否用了全文 `includes`？→ 必须用 `lastIndexOf('启动 X')` 按当前启动切片。
2. 是否缺 starting 过渡态？→ reconcile 不该把未就绪判死。
3. Make 是否单独部署超时？→ 升级前校验 Vite+Make 都 alive。

### 步骤4：Make 联动（R-START-04）

- 切换编辑项目时调 `PUT http://localhost:53817/api/projects/active {projectId}`。
- **必须等** PS1 输出 `AXHUB_LAUNCH_STATUS: done`（Make 已就绪）再同步调，不能 spawn 后立即调。
- Make 未跑时优雅降级（`ok:false` 不影响工作台状态）。

### 步骤5：验证

- 完整时序：T+0s 启动 → 应显示 starting → T+10s 左右转 editing/active。
- 手动验证 Make：`PUT /api/projects/active` 后浏览器刷新应看到 Make 客户端聚焦。
- 关键文件：`axhub-manager/server.mjs`、`06-运行脚本/launch-project.ps1`、`启动工作台.cmd`。

## 踩坑清单（复用）

| 坑 | 规则 | 要点 |
| --- | --- | --- |
| launch-log append 误判 | R-START-01 | 按时间切片，勿全文 includes |
| 无过渡态判死 | R-START-02 | 加 starting，reconcile 不判死 |
| 单服务就绪误报完成 | R-START-03 | 完成=Vite+Make 都就绪 |
| 联动时序太早 | R-START-04 | 等 done 标记再同步调 |
| 状态乱跳 | R-START-05 | 状态写入讲优先级，reconcile 双向校准 |
