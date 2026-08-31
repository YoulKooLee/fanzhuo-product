---
name: axhub-layout
type: skill
category: 前端布局
description: 大屏布局、样式塌陷、比例容器、PrototypeLayout、Tailwind 冷门 utility
scope: [universal, project]
trigger: [布局, 大屏, 塌陷, contents, 比例, fullWidth, 样式, Tailwind, grid]
updated: 2026-08-18
---

# Skill: axhub-layout — 前端布局 / 大屏

> 作用：处理 Axhub 项目前端布局问题：grid 三栏塌陷、Tailwind 冷门 utility、fullWidth 高度失效。
> 依赖规则：`03-rules/layout.md`（R-LAYOUT-*），知识：`Agent_Memory/003-布局与前端实现.md`。
> 注意：**具体大屏比例/风格以本项目 `project-memory.md` 为准**（R-LAYOUT-04），本 skill 只提供通用手法。

## 触发场景

- 用户说"布局乱了 / 大屏塌陷 / 三栏变单列 / 样式不对"
- 用 Tailwind 但 class 不生效
- PrototypeLayout fullWidth 模式下高度失效

## 流程步骤

### 步骤1：判断是否 fullWidth 模式

PrototypeLayout fullWidth 下 `.plx-full{display:block}`，**父容器无显式高度**（R-LAYOUT-02）。
→ 子元素不能用 `h-screen` / `calc(100vh-X)` / `h-full`（都会失效或=0）。

### 步骤2：比例容器（比例以项目记忆为准）

先读项目根目录 `project-memory.md` 的「技术约束」确认本项目要求比例（如 16:9），再用 viewport 单位自建比例容器，不受父容器高度限制：
```css
/* 示例 16:9，实际比例按项目要求替换 */
width: min(100%, calc((100vh - 80px) * 16 / 9));
height: min(calc(100vh - 80px), calc(100vw * 9 / 16));
```

### 步骤3：grid 三栏塌陷排查

- 若 Tab 子组件用 `className="contents"` 想让子元素提升到外层 grid → **R-LAYOUT-01**：Tailwind 4 不生成 `.contents`，必须用 inline style `style={{ display: 'contents' }}`。
- 检查 main 是否 `grid-template-columns: 260px 1fr 260px`。
- 确保子元素有 `min-h-0` + `flex-1` 链路完整。

### 步骤4：运行时错误排查

大屏组件常见连续运行时错误（每次一个）：
- 缺右括号 `symptomType()` → 补回
- `React is not defined` → 补 import React
- `useMemo is not defined` → 补进 hooks 导入
- `typeColor is not defined` → 常量提升模块级（R-LAYOUT-03），勿放 useEffect 内

### 步骤5：技术约束

- ECharts 用 CDN 动态加载。
- pnpm workspace 项目只能用 npm + CDN。
- 中文路径需 UTF-8 脚本绕过。

## 踩坑清单（复用）

| 坑 | 规则 | scope | 要点 |
| --- | --- | --- | --- |
| contents utility 不生成 | R-LAYOUT-01 | universal | 关键 CSS 用 inline style 兜底 |
| fullWidth 高度失效 | R-LAYOUT-02 | universal | 自建比例容器，比例按项目记忆定 |
| 顶层变量 undefined | R-LAYOUT-03 | universal | 常量提升模块级 |
| 大屏比例/风格 | R-LAYOUT-04 | project | 以项目记忆为准，勿跨项目套用 |
