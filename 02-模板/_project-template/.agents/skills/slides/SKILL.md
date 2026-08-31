---
name: ckm:slides
description: 创建战略性 HTML 演示文稿，支持 Chart.js 数据可视化、设计令牌、响应式布局、文案公式和情境化幻灯片策略。
argument-hint: "[主题] [幻灯片数量]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# HTML 演示文稿

战略性 HTML 演示文稿设计，支持数据可视化。

<args>$ARGUMENTS</args>

## 适用场景

- 营销演示与路演幻灯片
- 基于 Chart.js 的数据驱动幻灯片
- 采用布局模式的战略性幻灯片设计
- 文案优化后的演示内容

## 子命令

| 子命令 | 说明 | 参考文档 |
|--------|------|----------|
| `create` | 创建战略性演示幻灯片 | `references/create.md` |

## 参考文档（知识库）

| 主题 | 文件 |
|------|------|
| 布局模式 | `references/layout-patterns.md` |
| HTML 模板 | `references/html-template.md` |
| 文案公式 | `references/copywriting-formulas.md` |
| 幻灯片策略 | `references/slide-strategies.md` |

## 路由

1. 从 `$ARGUMENTS` 解析子命令（第一个词）
2. 加载对应的 `references/{subcommand}.md`
3. 使用剩余参数执行
