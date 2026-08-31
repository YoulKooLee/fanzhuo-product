---
name: write-design-notes
description: |
  为原型页面编写/维护「设计说明」（Xbox 风格编号卡片 + 连线）。
  触发词（任一命中即用本 skill）：写设计说明、写原型说明、设计说明、原型说明、标注设计说明、给原型加说明、补充原型描述、PrototypeLayout、DESIGN NOTES、Xbox 风格设计说明。
  当用户要求给某个原型页面的右侧说明区填充/改写模块化说明时使用本 skill。
  本 skill 只约束技术接入与内容结构，不决定业务文案；文案以 PRD / 需求资料 / 页面实际内容为准。
---

# 设计说明编写（Xbox 风格）

## 概览

本 skill 指导如何用 `src/common/PrototypeLayout.tsx` 为原型页编写模块化「设计说明」，产出右侧 Xbox 风格编号卡片，并通过 SVG 连线与左侧界面模块对应。

## 前置认知

- 设计说明面板由 `PrototypeLayout` 组件统一渲染，**作者不要自绘说明区**。
- `PrototypeLayout` 已内置：Xbox 风格（直角/扁平/白底绿边框/黑字）、`## ` 自动拆卡、`data-proto-id` 自动编号、SVG 连线 + hover 高亮。
- 兼容旧 `description`（纯 Markdown）与新的 `modules`（结构化）两种写法。

## 执行步骤

1. **定位目标原型**：`src/prototypes/<prototype-id>/index.tsx`。
2. **读页面**：读取页面 JSX 结构，识别可独立说明的模块区域（KPI 区、图表区、表格区、表单区、操作区等）。
3. **确定接入方式**：
   - 页面未用 `PrototypeLayout` → 把内容包进 `<PrototypeLayout title breadcrumb description>{内容}</PrototypeLayout>`。
   - 已用 `PrototypeLayout` 且用 `description` → 按规范补/改 `## ` 模块。
   - 需要精准连线 → 用 `modules` + 左侧显式 `data-proto-id`。
4. **写 description**：遵循「每模块只做一件事」，含标题、正文、列表（功能/字段/交互/边界）。
5. **验证**：
   ```bash
   npm run typecheck
   node scripts/check-app-ready.mjs /prototypes/<prototype-name>
   ```

## 结构规范

`description` 是 Markdown 字符串，解析规则：

| 语法 | 渲染 |
| --- | --- |
| `# 标题` | 顶部一句话简介 |
| `## 模块` | 一张编号卡片 |
| `- 要点` | 卡片内绿色方块列表 |
| `### 子` | 卡片内分组标题 `【子】` |
| 普通文本 | 卡片正文段落 |

示例：

```markdown
# 园区运营总览，展示空间/设备/告警数据。

## 核心数据
项目空间数、总人数、应用数。
- 空间数据（楼栋/建筑面积）
- 设备数据环形图
- 告警数据双环形图

## 交互要点
- Tab 切换告警时间维度（今天/近7天/近30天）
- 环形图 hover 显示明细
```

## 验收清单

- [ ] 页面用 `PrototypeLayout`，无内联自绘说明区
- [ ] `description` 用 `## ` 拆成 2 张以上卡片
- [ ] 每卡有标题 + 正文或列表，无空卡
- [ ] 左侧模块与右侧卡片能连线对应
- [ ] `npm run typecheck` 通过
