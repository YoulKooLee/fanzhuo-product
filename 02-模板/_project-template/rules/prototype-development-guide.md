# 原型开发与验收指南

用于 `src/prototypes/<name>/` 下的原型实现、局部修改、多页面组织和预览验收。主题创建、派生和主题页验收优先看 `rules/theme-guide.md`。

开发流程：

```text
读取已确认需求和设计决策 -> 修改原型目录内代码 -> 运行验收脚本 -> 按错误信息修复 -> 重新验收
```

## 实现边界

- 一个原型目录就是主要隔离边界，页面组件、样式和素材优先留在对应原型目录内。
- 不为单个原型随意修改 `src/common/`、全局主题或共享工具。
- 多步骤或高风险修改先拆成短任务，逐项处理并维护当前状态。
- 一次只处理一个明确问题；遇到构建、运行或验收失败，先定位原因再继续。
- 完成后必须通过预览验收；纯视觉、文案、布局和素材调整不要求测试驱动。

## 文件结构与命名

```text
src/prototypes/<name>/
├── index.tsx      # 必需
├── style.css      # 可选
├── components/    # 可选：原型内部共享组件
├── pages/         # 可选：多页面原型页面组件
├── docs/          # 可选：目录 Markdown 文档
└── assets/        # 可选：原型专属素材
```

- 原型入口文件必须是 `index.tsx`。
- 原型目录名使用小写字母、数字、连字符，如 `order-review`。
- 当目录名为 `untitled`、`untitled-*` 或显示名为「未命名」时，开始生成实际内容前应更新为有意义的目录名和 `@name`。
- 本项目当前不产出独立 `components` 资源；原型内部组件放在对应原型目录下的 `components/`。
- 原型目录文档放在当前原型的 `docs/` 下，例如 `src/prototypes/order-review/docs/prd-03-status.md`。
- `annotation-source.json` 的目录文档节点优先使用相对当前原型目录的 `markdownPath`，例如 `"markdownPath": "docs/prd-03-status.md"`；不要写绝对路径、`..` 或跨原型引用。
- 普通预览和 `@axhub/annotation` 阅读页不显示目录文档编辑入口；编辑 URL 由 Make 批注宿主回调生成，不写进 annotation 包或目录节点数据。
- 只有 Make 批注/编辑工具启用、且当前选中的是带安全本地 `markdownPath` 的目录 Markdown 正文子节点时，批注气泡卡片才显示“文档编辑”按钮。
- 导出/发布时会构建期内联 `markdownPath` 正文，不依赖运行时请求 `.md` 文件。

每个原型的 `index.tsx` 顶部建议包含面向用户的中文 `@name`，用于预览列表展示名：

```typescript
/**
 * @name 评审工作台
 */
```

## Make 客户端目录与原型内功能目录同步

多模块原型必须满足「两侧目录一致」的强制要求：

1. **Make 客户端目录来源**：Make 客户端左侧页面目录由 `scanProjectEntries` 扫描 `src/prototypes/<name>/index.tsx` 的**一级目录**生成（不递归扫描多级子目录）。因此每个独立功能模块应作为 `src/prototypes/` 下的**一级目录**，目录内 `index.tsx` 用 `@name` 注释声明中文显示名（如 `@name 数据看板`）。嵌套在 `src/prototypes/<parent>/<sub>/` 下的二级目录 Make 客户端扫描不到，会导致页面丢失。
2. **原型内功能目录**：原型页面左侧应渲染与 Make 客户端一致的功能菜单。多个原型共用同一套菜单时，菜单定义应抽到**共享壳组件**（如 `src/common/StructureMonitorShell.tsx`），各原型 `index.tsx` 引用该壳，避免重复维护导致两侧不一致。
3. **目录同步机制**：共享壳的左侧菜单点击应通过路由跳转到对应原型（`window.location.href = '/prototypes/<name>/'`），使「在 Make 客户端点目录项」与「在原型内点左侧菜单」行为一致、指向相同的模块集合。

> 反例：把多个模块塞进单个 `index.tsx` 并用顶部 Tab 切换 —— 既让 Make 客户端只显示 1 项，又把功能目录放到了顶部而非左侧，违反本条要求。

## 右侧设计说明

每个原型页面右侧必须生成「设计说明」，标注页面字段名、数据接口出处、待厂商补充项等，便于评审与交付：

1. **使用框架组件**：通过 `src/common/PrototypeLayout` 渲染。传 `modules={[{ id, title, text, list }]}` 结构化说明，左侧页面区域用 `data-proto-id="<id>"` 标记对应元素，框架自动绘制 SVG 连线并支持 hover 高亮联动。
2. **说明内容**：每个模块卡片至少包含「字段/区域说明」与「数据来源/接口出处」，待确认项用「待厂商补充」显式标注，不要用占位文字带过。
3. **不省略原则**：未写设计说明应显式注释原因；不应默认省略右侧说明区。

参考实现：结构监测项目将原型拆分为 `dashboard/`、`alarm/`、`devices/`、`video/`、`diagnosis/`、`report/` 六个一级原型，共用 `src/common/StructureMonitorShell.tsx` 渲染左侧目录、`PrototypeLayout` 渲染右侧设计说明。

## 多页面原型

单个原型可以包含多个页面，通过 URL hash 参数 `#page=<pageId>` 定位：

```text
/prototypes/express-app/#page=home
/prototypes/express-app/#page=detail
```

多页面仍属于同一个原型目录；页面组件放在原型内部的 `pages/`，跨页面共享组件放在原型内部的 `components/`。

使用公共 hook `src/common/useHashPage.ts`：

```typescript
import { useHashPage } from '../../common/useHashPage';

export default function MyApp() {
    const { page, setPage } = useHashPage('home');
    // page === 'home' | 'detail' | ...
}
```

- `pageId` 命名使用小写字母、数字、连字符。
- 不带 `#page=` 时自动使用 `defaultPage`。
- 此路由完全在原型内部，不影响构建。

参考实现：`src/prototypes/ref-app-home/index.tsx`。

## 依赖与样式

- React 与 Hooks 直接从 `react` 导入。
- 第三方库按需导入，新增依赖必须同步更新 `package.json`。
- 使用 Tailwind CSS V4 时，入口样式文件需包含：

```css
@import "tailwindcss";
```

- 使用主题 CSS Variables 时，按所选 `DESIGN.md` 和主题规则引入，不复制另一套 token。

## 验收流程

运行原型验收脚本：

```bash
node scripts/check-app-ready.mjs /prototypes/[原型目录]
```

关键返回字段：

- `status`: `READY` / `ERROR` / `TIMEOUT`。
- `targetUrl`: 本次验收目标地址。
- `errors`: 构建、运行时或页面加载错误列表。

错误处理：

- `ERROR`：按 `errors` 修复后重新执行验收脚本，直到通过。
- `TIMEOUT`：优先排查 dev server 启动、端口、长任务和运行时阻塞。
- 修复时先处理构建、启动和运行时报错，再处理交互与视觉问题；一次只修一个明确问题，修完重新验收。

## 最小清单

- [ ] `index.tsx` 完整存在。
- [ ] `index.tsx` 顶部有清晰的 `@name`。
- [ ] 占位原型已更新为有意义的目录名和显示名。
- [ ] 多模块原型按一级目录拆分，Make 客户端目录与原型内左侧功能目录一致（共享壳渲染）。
- [ ] 原型页面右侧已生成「设计说明」（字段名 / 接口出处 / 待补充项）。
- [ ] 新增依赖已写入 `package.json`。
- [ ] `check-app-ready.mjs` 原型验收通过。
