---
name: vibepm-web-generator
description: 该技能用于快速创建 WEB 端页面原型，主要服务于企业官网与营销落地页场景。目标是统一页面结构、样式体系与交付规范，避免从零搭建导致的风格漂移与实现不一致。适用于企业网站、产品介绍页、投放落地页等场景。
user-invocable: true
---

## 目标

- 统一企业官网/落地页的页面结构与视觉风格。
- 保持 HTML、CSS、JS 分离，便于复用与维护。
- 支持多页面快速生成，降低沟通与实现成本。

## 典型使用场景

- 企业官网首页（品牌介绍、核心能力、客户案例）。
- 产品/服务介绍页（功能亮点、方案说明、对比模块）。
- 市场投放落地页（活动专题、表单收集、转化路径）。
- 招聘/关于我们页面（公司文化、岗位信息、联系方式）。

## 提示词示例

- `/vibepm-web-generator 使用这个技能，创建一个企业官网首页，包含 Hero 区、服务能力、客户案例、页脚。`
- `/vibepm-web-generator 使用这个技能，创建一个 SaaS 产品落地页，包含功能亮点、价格方案、FAQ、CTA 按钮。`


### 本地化组件提示词模板

- `/vibepm-web-generator 在预约页面中使用本地化 Element Plus 的 DatePicker 组件，通过 vendor 下的 Vue 3 和 Element Plus 资源直引实现，不使用 CDN，输出 html/css/js 分离文件。`
- `/vibepm-web-generator 在活动报名页面中使用本地化 Element Plus 的 Dialog 与 Form 组件，基于 HTML + JS 直引本地资源实现，组件标签必须使用完整闭合写法。`
- `/vibepm-web-generator 在数据看板页面中接入本地化 AntV G2Plot 图表组件，使用 vendor/g2plot 下的本地资源实现图表展示与交互，不使用 CDN。`

## 核心规则（必须遵循）

- 场景优先规则：默认按 WEB 端企业官网或落地页信息架构组织页面，不使用设备壳或移动端系统层级语义。
- 结构分层规则：页面需至少包含 `header`、`main`、`footer` 三层；业务区块按语义化 `section` 划分。
- 样式分离规则：页面样式必须写入独立 `css/xxx.css`，不得在 HTML 中写大段内联样式。
- 脚本分离规则：交互逻辑写入独立 `js/xxx.js`，避免在 HTML 中堆叠内联脚本。
- 可复用规则：公共变量、重置、通用组件样式统一沉淀到 `css/global.css`，页面特有样式保留在 `css/xxx.css`。
- 图标强制规则：页面必须使用 `Font Awesome` 字体图标，并且必须引用本地资源（以 `web/` 为根的相对路径）：`<link rel="stylesheet" href="./vendor/fontawesome/css/all.min.css" />`；页面中的导航/列表要点/CTA 等关键位置应合理使用图标增强信息层级，禁止使用 CDN。

## 推荐文件结构

在项目根目录下以 `web/` 作为页面交付目录，页面文件与依赖全部在该目录内闭环。

页面文件（每个页面一套）：

- `xxx.html`：页面骨架与内容结构（位于 `web/` 根目录）
- `css/xxx.css`：页面级样式（位于 `web/css/`）
- `js/xxx.js`：页面交互逻辑（位于 `web/js/`）
- 首次生成项目文件时，第一个页面文件必须命名为 `index.html`；对应页面级资源同步命名为 `css/index.css` 与 `js/index.js`，后续新增页面再按业务语义命名。
- 页面存在交互时，必须同步生成并引用对应的 `js/xxx.js`；若页面无需交互，可不创建空白脚本文件。

全局资源（复用资源）：

- `./assets/images/`：业务图片与品牌素材（复制到 `/web/images/`）
- `./assets/fonts/`：字体资源（复制到 `/web/fonts/`，包含 Inter 字体与 `inter.css` 等）
- `./assets/vendor/`：本地化前端组件库资源源目录（生成时复制到 `/web/vendor/`，如 `Vue`、`Element Plus`、`g2plot`、`fontawesome`）

## 默认技术栈

- 基础栈：`HTML5` + `CSS3` + `JavaScript (ES6+)`
- 页面形态：多页面静态结构（`html/css/js` 分离）
- 样式体系：`css/global.css` + `css/xxx.css`
- 组件策略：优先使用可维护、可替换的通用 UI 方案
- 资源策略：第三方依赖优先本地化，保证离线可预览

### 可选技术栈

- `Vue3`：适用于需要组件化拆分与更复杂状态管理的原型；建议保持页面信息架构与 `global.css` 变量体系不变。
- `React`：适用于需要组件复用与工程化能力的原型；建议使用 `CSS Modules`（或同等方案）控制样式作用域并复用 `global.css` 设计变量。
- 若使用 `Element Plus`，必须同时本地化 `Vue 3`，并统一放在 `web/vendor/` 下管理（页面引用路径使用 `./vendor/...`）。

### 转化为 Vue3/React 的注意事项

- 结构映射：先保持页面信息架构不变，再拆分为组件（如 `Hero`、`FeatureList`、`Pricing`、`FAQ`）。
- 样式迁移：优先复用 `global.css` 变量体系；避免无边界全局污染。
- 交互改造：将原生 DOM 操作迁移为框架状态驱动（Vue `ref/reactive`，React `useState/useReducer`）。
- 生命周期处理：初始化放入 `onMounted` / `useEffect`，销毁时清理监听与定时器。
- 资源与路径：图片、字体与第三方资源迁移到框架约定目录并修正路径。

## 默认组件与资源建议

- 默认图标库：`Font Awesome v7`（资源已本地化）
- 默认图表库：`AntV G2Plot`（仅在有数据可视化需求时使用，资源已本地化）
- 默认组件库：`Element Plus`（仅在使用特殊组件需求时使用，资源已本地化，依赖 `./vendor/vue/`，最终随页面一起放在 `web/vendor/`）
- 图片资源：优先使用真实业务图片（如品牌图、产品图、场景图），避免通用占位图
- 视觉装饰策略：允许使用与品牌和业务语义一致的图标、线稿、几何背景、弱纹理等装饰元素，但应保持克制，服务信息层级与转化路径，不做无意义堆砌


### Element Plus 样式自定义约定

- 优先使用 `Element Plus` 官方 CSS 变量进行主题定制（如主色、圆角、字号、边框、间距），避免直接修改组件源码或大面积覆盖内置样式。
- 组件样式中的颜色优先复用 `css/global.css` 中定义的全局品牌变量（如 `--brand`），再映射到 `--el-color-primary` 等主题变量，避免在组件样式中直接写死十六进制颜色值。
- `Element Plus` 组件的字体、字号、圆角与控件尺度需与全局规则保持一致，统一在 `css/global.css` 中通过变量控制（如 `--el-font-family`、`--el-font-size-base`、`--el-border-radius-base`）。
- 页面级样式覆盖统一放在 `css/xxx.css`，全局通用覆盖沉淀到 `css/global.css`，避免把业务样式散落到组件初始化脚本中。
- 覆盖选择器尽量以 WEB 页面容器作用域开头（如 `.page-wrap .el-button`、`.page-wrap .el-date-editor`），避免影响其他页面中的同类组件。
- 若需深度定制，优先通过语义化业务类名叠加样式，避免直接依赖脆弱的内部 DOM 层级或运行时生成类名。
- 自定义样式需同时兼顾 `hover`、`focus`、`active`、`disabled` 等状态，保证交互一致性、可读性与可访问性。


### 本地化组件库引用约定

- `Vue 3` 默认目录：`./vendor/vue/vue.global.prod.js`
- `Element Plus` 默认目录：
  - `./vendor/element-plus/index.css`
  - `./vendor/element-plus/index.full.min.js`
- `Element Plus` 中文语言包（必须引入，避免组件内置文案默认英文）：
  - `./vendor/element-plus/locale/zh-cn.js`
- 页面直接通过 `<script>` 引入时，顺序必须为：先 `Vue`，再 `Element Plus`，最后 `zh-cn` 语言包
- 页面直接通过 `<link>` 引入时，`Element Plus` 样式应放在页面级样式之前，避免基础组件样式缺失
- HTML `<head>` 推荐引入顺序（先组件库样式，再全局样式，最后页面样式；`Inter` 已由 `css/global.css` 内部引入）：
  - `<link rel="stylesheet" href="./vendor/element-plus/index.css" />`
  - `<link rel="stylesheet" href="./css/global.css" />`
  - `<link rel="stylesheet" href="./css/xxx.css" />`

- `css/global.css` 全局主题变量示例（优先用于统一 `Element Plus` 主题）：
  - `:root { --brand: #4B68FD; --font-family-base: "Inter", "PingFang SC", "Microsoft YaHei", "Noto Serif SC", "Helvetica Neue", Arial, sans-serif; --font-size-base: 14px; --control-height-base: 44px; --el-color-primary: var(--brand); --el-font-family: var(--font-family-base); --el-font-size-base: var(--font-size-base); --el-border-radius-base: 12px; }`
- 若页面使用 `Element Plus`，应优先通过 `css/global.css` 中的全局变量统一品牌色、字体、字号与圆角，再在 `css/xxx.css` 中做局部视觉微调，避免在单个组件节点上分散覆写。

- `css/xxx.css` 页面级覆盖示例（局部定制）：
  - `.el-button--primary { box-shadow: 0 8px 20px rgba(37, 99, 235, 0.24); }`
  - `.el-date-editor.el-input { width: 100%; max-width: 320px; }`

- JS 引入建议：
  - `Element Plus` JS 必须优先本地引入：`./vendor/element-plus/index.full.min.js`
  - 若页面使用 `Element Plus`，必须注入中文语言包，避免组件内置文案（如 DatePicker / Pagination / Empty / Upload）出现英文：
    - `app.use(ElementPlus, { locale: ElementPlusLocaleZhCn })`
  - 页面脚本中统一通过 `app.use(...)` 完成注册，避免重复初始化或在多个脚本片段中重复挂载
  - 非特殊场景不使用 CDN 引入 `Vue` 或 `Element Plus`
  - 在原生 `.html` 模板中，`Element Plus` 组件标签必须使用完整闭合写法，例如 `<el-date-picker></el-date-picker>`

### HTML + JS 直引使用说明

- 以下示例仅用于说明 `HTML + JS` 直引模式下的最小可运行写法，不替代本技能默认的 `html/css/js` 分离交付规范
- 可在单文件 `HTML + JavaScript` 页面中直接使用 `Element Plus`，但本质上仍依赖 `Vue 3`
- 若页面不使用构建工具，则必须通过本地 `<link>` 和 `<script>` 显式引入 `Vue` 与 `Element Plus`
- 组件标签闭合规则同上；若在原生 `.html` 的 DOM 模板中误用自闭合写法，浏览器可能错误解析后续内容，导致日历、日期面板、表格等组件渲染异常

- 推荐引用示例：
```html
<link rel="stylesheet" href="./vendor/element-plus/index.css" />

<div id="app">
  <el-button type="primary">按钮</el-button>
</div>

<script src="./vendor/vue/vue.global.prod.js"></script>
<script src="./vendor/element-plus/index.full.min.js"></script>
<script src="./vendor/element-plus/locale/zh-cn.js"></script>
<script>
  const { createApp } = Vue

  const app = createApp({})
  app.use(ElementPlus, { locale: ElementPlusLocaleZhCn })
  app.mount('#app')
</script>
```


## 默认字体
- 优先级规则（强制）：
  - 若参考视觉规则文件（如 `style.md`）中的全局字体与本节规则冲突，必须以本节定义的默认字体为准。
- 默认字体规则（必须写入 `:root`）：
  - 在 `css/global.css` 的 `:root` 中声明：
    - `--font-family-base: "Inter", "PingFang SC", "Microsoft YaHei", "Noto Serif SC", "Helvetica Neue", Arial, sans-serif;`
  - 全局文字统一使用：
    - `font-family: var(--font-family-base);`
- `Inter` 本地字体资源（CSS）：
  - 由 `css/global.css` 内部统一引入（`@import url("../fonts/inter.css");`），页面 HTML 无需重复引入。
- 相关补充：
  - 页面 CSS 引入顺序与覆盖边界，见下文 `字体落位细则（补充）`。

## 组件规范文档

- 前端设计规范：`./frontend-design.md`
- 组件规范文档：`./component.md`
- 页面开发时，建议按以下顺序执行，避免风格漂移与规范冲突：
  1. 先依据本文件确定页面场景、信息架构、区块顺序与交付边界。
  2. 再依据 `component.md` 确定组件结构、对齐方式、响应式规则、CTA 层级与可用性约束。
  3. 最后依据 `frontend-design.md` 补充视觉风格、装饰细节、氛围营造与差异化表达。
- 优先级约定：`component.md` 用于约束信息架构、组件结构、转化路径、对齐与响应式等硬性规范；`frontend-design.md` 用于指导视觉风格、氛围营造与设计表现等软性表达。
- 冲突处理：若两份文档在字体选择、装饰密度、布局自由度、动效强度等方面存在冲突，优先保证 `component.md` 的可读性、稳定性、一致性与转化目标，再在其边界内吸收 `frontend-design.md` 的设计语言。

## 页面结构说明

1. 页面基础结构：

- `header`：品牌标识、导航、首屏入口
- `main`：业务核心内容（按模块拆分多个 `section`）
- `footer`：版权、备案、联系方式、补充链接

2. 内容组织建议：

- 首页优先级：品牌价值 > 核心能力 > 客户信任 > 行动召唤（CTA）
- 落地页优先级：痛点 > 方案 > 证明 > 转化入口
- 每个区块只承载一类核心信息，避免信息密度失控

3. 样式与脚本分离：

- 在 `<head>` 通过 `<link>` 引入 `css/global.css` 与 `css/xxx.css`
- 在页面尾部引入 `js/xxx.js`，减少首屏阻塞
- 禁止在 HTML 中写大段内联样式与脚本

4. 页面编码与落盘规范（强制）：

- 所有 `html/css/js/svg/json/md` 文本文件统一使用 `UTF-8`（建议无 BOM）
- HTML 文件必须包含 `<meta charset="UTF-8">`
- 脚本写文件时必须显式指定 UTF-8 编码

## 字体落位细则

- 引入顺序：页面 `<head>` 先引入 `./css/global.css`，再引入 `./css/xxx.css`
- 变量约定：在 `:root` 中统一声明基础字体变量并全局复用
- 覆盖边界：特殊字体仅在局部语义类名上按需覆盖

## 命名规范

- 文件名统一小写，多单词使用连字符：`home.html`、`pricing-plan.html`
- CSS 类名使用语义化命名，避免与业务无关的视觉命名
- JS 函数名使用动词短语，表达行为意图

## 快速检查清单

- 页面是否符合企业官网/落地页信息架构
- 是否使用语义化结构（`header/main/footer/section`）
- HTML、CSS、JS 是否独立文件
- 公共样式是否沉淀到 `css/global.css`
- 页面特有样式是否放在 `css/xxx.css`
- 引用路径是否全部在 `web/` 目录内闭环
- 字体与图片资源路径是否有效
- 文件编码是否统一为 UTF-8

## 中文乱码排查与修复（编码一致性规范）

- 根因链路（按概率排序）：
  - 文件以 ANSI/GBK/UTF-16 保存，但页面声明为 UTF-8
  - 复制或脚本生成时发生二次转码
  - 编辑器自动识别编码错误，导致刷新后乱码
- 创建/修改页面的硬性要求：
  - 新建文件后先确认编码为 UTF-8，再写内容
  - 保存前再次确认编码仍为 UTF-8（无 BOM）
  - Windows 下脚本写文件需显式指定 UTF-8（如 PowerShell `Set-Content -Encoding utf8`）
- 验收动作：
  - 浏览器中检查中文文案显示与控制台输出
  - 抽样检查 `html/css/js` 文件编码是否为 UTF-8

## 备注

如需新增页面，优先复用已有 WEB 页面结构与样式体系，不从零重新定义规范。
