/**
 * @description 示例原型：展示「左侧设计稿 + 右侧设计说明」标准布局
 */
import React from 'react';
import { PrototypeLayout } from '../../common/PrototypeLayout';

const C = {
  bg: '#f3f4f7', card: '#fff', border: '#e5e7eb',
  text: '#0f172a', text2: '#64748b', primary: '#0052D9',
};

export default function SamplePagePrototype() {
  return (
    <PrototypeLayout
      title="示例页面"
      breadcrumb="示例 / 示例页面"
      description={`# 示例页面
这是一个示例原型，展示标准布局模板。

## 页面结构
- **左侧**：设计稿（UI 内容）
- **右侧**：设计说明（Markdown 描述）

## 设计说明编写规范
遵循以下分级结构编写设计说明：

### 一级标题（#）
页面名称和一句话说明

### 二级标题（##）
模块/功能区的标题

### 列表（-）
- 功能点
- 字段说明
- 交互要点

### 强调（\`code\`）
代码和变量名用反引号包裹

## 输出规范
- 所有原型使用 \`PrototypeLayout\` 组件
- 字段描述引用 PRD 对应章节
- 数据使用测试样例`}
    >
      <div style={{ background: C.card, borderRadius: '8px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px', color: C.text }}>设计稿区域</h2>
        <p style={{ fontSize: '14px', color: C.text2, margin: 0 }}>
          在此编写页面的实际 UI 内容。<br />
          左侧展示设计稿，右侧自动显示设计说明。
        </p>
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <div style={{ background: C.primary, color: '#fff', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer' }}>主要按钮</div>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '8px 24px', borderRadius: '6px', cursor: 'pointer' }}>次要按钮</div>
        </div>
      </div>
    </PrototypeLayout>
  );
}
