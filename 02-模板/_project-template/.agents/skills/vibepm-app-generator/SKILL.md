---
name: vibepm-app-generator
description: 该技能用于快速创建带手机设备外框的 APP 原型（含状态栏、灵动岛、圆角与 Home Indicator），并统一组件与样式规范，避免从零搭建造成风格漂移；可根据页面形态直接选择下方模板进行创建。
user-invocable: true
---

## 目标

- 保持所有原型页面的设备外框与结构一致。
- 页面内容仅在框架内部替换，降低样式漂移。
- HTML、CSS、JS 分离，便于后续多页面复用。

## 模板选型速览

- iOS 纯内容页（无标题栏、无底部标签栏）：`./assets/ios_frame.html`
- iOS 仅标题栏（无底部标签栏）：`./assets/ios_frame_header.html`
- iOS 仅底部标签栏（无标题栏）：`./assets/ios_frame_tabs.html`
- iOS 标题栏 + 底部标签栏：`./assets/ios_frame_nav.html`
- 微信小程序纯内容页（保留胶囊、隐藏标题栏）：`./assets/wechat-frame.html`
- 微信小程序仅标题栏（保留胶囊、无底部标签栏）：`./assets/wechat-frame_header.html`
- 微信小程序仅底部标签栏（保留胶囊、无标题栏）：`./assets/wechat-frame-tabs.html`
- 微信小程序标题栏 + 底部标签栏（保留胶囊）：`./assets/wechat-frame-nav.html`
- 选型建议：常规 H5 页面优先使用 iOS 系列模板，且未明确导航形态时优先使用 `ios_frame_tabs.html`（无标题栏、含底部标签栏）作为中性基座；小程序视觉还原场景优先使用 wechat 系列模板。

## 提示词示例

- `/vibepm-app-generator 使用这个技能，基于 ios_frame_nav.html 创建一个“日程管理”原型首页，保留页面中的标题栏和标签栏。`
- `/vibepm-app-generator 使用这个技能，基于 wechat-frame_header.html 创建一个“待办详情页”页面，保留微信小程序胶囊与标题栏。`

### 本地化组件提示词模板

- `/vibepm-app-generator 在预约页面中使用本地化 Vant 4 的 DatePicker 组件，资源从 assets/vendor/vant 本地直引实现，不使用 CDN，输出 html/css/js 分离文件。`
- `/vibepm-app-generator 在活动报名页面中使用本地化 Vant 4 的 Popup、Form 与 Field 组件，基于 HTML + JS 直引本地资源实现，不使用构建工具。`
- `/vibepm-app-generator 在统计页面中接入本地化 AntV F2 图表库，使用 assets/vendor/f2 下的本地资源实现图表展示与交互，不使用 CDN。`

## 核心规则（必须遵循）

- 默认模板规则：未明确页面形态时，不得自行假设模板，必须先询问用户需要使用哪种模板；仅当用户明确需要底部一级导航时，才使用 `./assets/ios_frame_tabs.html`。
- 延续一致性规则：若项目目录中已存在 APP 原型项目文件，生成新页面时必须延续已有的文件结构与样式风格，不得另起一套目录组织或视觉体系。
- 结构完整性规则：复用任一模板页面时，必须完整保留模板结构，不得删除或绕过任何外框与系统层级节点；
- 资源落盘规则：在 `/app` 创建页面时，必须将模板依赖的运行时资源（如 `css/js/images/fonts/vendor`）复制到 `/app` 对应目录，并将页面引用路径改为 `/app` 内相对路径；禁止继续依赖 `./assets` 作为运行时资源路径。
- 内容落位规则：除 `title-bar` 内的页面标题与左右操作按钮外，所有页面主体业务内容必须写在 `main.screen-content > section.app-shell` 中。
- 头部承载规则：`.top-header-shell` 仅用于承载系统外框与标题区节点（如 `.status-bar`、`.dynamic-island`、`.title-bar`），不得承载页面主体业务模块。
- 图标规范（强制）：页面图标必须使用 FontAwesome 字体图标（`<i class="fa-..."></i>`），并且必须引用本地化资源（复制到 `/app/vendor/fontawesome/`，页面使用 `/app` 内相对路径引入）；禁止使用 CDN 或外网依赖。
- 以上各条为核心规则，优先级高于普通说明；如与其他描述冲突，以本规则为准。


## 核心规则补充说明

- 除 `title-bar` 内的页面标题与左右操作按钮外，所有页面主体业务内容（如欢迎语、卡片、列表、表单、图表等）必须写在 `main.screen-content > section.app-shell` 中。
- `.top-header-shell` 仅用于承载系统外框与标题区节点（如 `.status-bar`、`.dynamic-island`、`.title-bar`），不得承载页面主体业务模块。
- 本节用于展开说明前文核心规则中的“内容落位规则”与“头部承载规则”；如与其他描述冲突，以前文“核心规则（必须遵循）”为准。

## 推荐文件结构

在项目根目录下以 `/app` 作为页面交付目录。首次生成项目或新增页面时，页面文件与运行时依赖必须一并落盘到 `/app`，保证页面在 `/app` 内可独立预览（不跨目录引用 `./assets` 运行时资源）。若 `/app` 及其所需子目录不存在，必须自动创建。

页面文件（每个页面一套）：

- `xxx.html`：页面骨架 + 内容容器（位于 `/app` 根目录）
- `css/xxx.css`：页面级样式（位于 `/app/css/`）
- `js/xxx.js`：页面交互逻辑（位于 `/app/js/`）
- 首次生成项目文件时，第一个页面文件必须命名为 `index.html`；对应页面级资源同步命名为 `css/index.css` 与 `js/index.js`，后续新增页面再按业务语义命名。
- 页面存在交互时，必须同步生成并引用对应的 `js/xxx.js`；若页面无需交互，可不创建空白脚本文件。

全局资源（生成复用）：

- `./assets/css/global.css`：全局基础样式与框架公共样式源文件；首次生成项目时复制并落为 `/app/css/global.css`，用于承载跨页面复用的通用样式与框架样式。后续新增页面默认复用该文件，仅在缺失时补建，不主动覆盖已有内容。
- `./assets/images/`：图片资源目录（按页面实际依赖复制到 `/app/images/`，包含状态栏图片与业务图片）
- `./assets/fonts/`：字体资源目录（按页面实际依赖复制到 `/app/fonts/`，包含 Inter 字体与 `inter.css` 等）
- `./assets/vendor/`：第三方库目录（按页面实际依赖复制到 `/app/vendor/`，如 `vant`、`f2`、`fontawesome`）

CSS 合并策略（重要）：

- 模板配套 CSS（如 `./assets/css/ios-frame-*.css`、`./assets/css/wechat-frame-*.css`）不复制到 `/app`。
- 创建页面时必须保留 `css/global.css`：模板中的页面专属“内容样式”写入对应的 `css/xxx.css`，可跨页面复用的公共样式再抽离并沉淀到 `css/global.css`。
- 生成后的页面不得继续引用模板侧 CSS（如 `ios-frame-*.css`、`wechat-frame-*.css`）；相关样式必须已拆分并归并到 `css/xxx.css` 或 `css/global.css`。

路径约束（强制）：

- 生成页面中的所有运行时引用（`link` / `script` / `img` / `font` / `vendor`）必须使用相对于当前 `html/css/js` 文件的本地相对路径，且目标资源必须位于 `/app` 目录内。
- 生成结果中禁止保留任何指向 `./assets/...` 或其他 `/app` 外目录的运行时引用，确保交付目录内资源闭环并可独立预览。

## 默认技术栈

- 基础栈：`HTML5` + `CSS3` + `JavaScript (ES6+)`，采用多页面静态原型结构（`html/css/js` 分离）。
- 样式体系：基于 `css/global.css` 提供全局变量、重置与通用组件样式，页面特有样式放在 `css/xxx.css`。
- 交互与组件：优先使用 `Vant 4` 组件能力实现移动端交互，数据可视化（统计、趋势等）使用 `AntV F2`（移动端 Canvas 图表，UMD 全局 `F2`）。
- 资源策略：第三方库优先本地化到 `vendor/` 目录，减少网络依赖并保证原型可离线预览。

## 可选技术栈

- `Vue3`：适用于需要组件化拆分与更复杂状态管理的原型；建议保持 `app-shell` 结构与 `global.css` 变量体系不变。
- `React`：适用于需要组件复用与工程化能力的原型；建议使用 `CSS Modules`（或同等方案）控制样式作用域并复用 `global.css` 设计变量。

### 转化为 Vue3/React 的注意事项

- 结构映射：保持 `app-shell` 语义结构不变，将页面模块拆分为组件（如 `Header/Card/List/Tabbar`），避免一次性重写导致视觉偏差。
- 样式迁移：优先复用现有 `global.css` 变量体系；Vue 使用 `scoped` 或 BEM 约束作用域，React 推荐 `CSS Modules` 或同等方案，避免全局样式污染。
- 交互改造：将原生事件（`onclick`/DOM 查询）改为框架事件与状态驱动（Vue `ref/reactive`，React `useState/useReducer`），禁止继续依赖直接 DOM 操作。
- 生命周期处理：初始化逻辑放入 Vue `onMounted` / React `useEffect`，销毁时同步清理定时器、监听器与图表实例，避免内存泄漏。
- 组件替换策略：如继续使用 Vant，Vue3 直接使用 `Vant`，React 端优先选择同风格移动端组件库（如 `Ant Design Mobile`）并对齐设计变量。
- 资源与路径：图片、字体、第三方资源统一迁移到框架约定目录（如 `src/assets` 或 `public`），修正相对路径，确保构建后可正确访问。

## 默认组件库

- 默认图标库：`Fontawesome v7`
- 默认图表组件库：`AntV F2`（仅在有数据可视化需求时使用；`./assets/vendor/f2/f2.min.js` 已本地化，生成页面时须复制到 `/app/vendor/f2/`）
- 默认前端组件库：`Vant 4`（仅在使用特殊组件需求时使用，支持自定义组件样式，本地化文件统一存放于 `assets/vendor/`）
- 图片资源：优先使用真实图片（`Wikimedia`/`Unsplash`），不要通用占位图

### AntV F2 引入与使用约定

- 脚本：引入 `./assets/vendor/f2/f2.min.js`（UMD，浏览器全局 `F2`）；生成页面时必须复制到 `/app/vendor/f2/f2.min.js`，并以 `/app` 内相对路径引用（如 `<script src="./vendor/f2/f2.min.js"></script>`，随 `html` 与资源目录相对位置调整）。
- 图表容器：在 `main.screen-content > section.app-shell` 内放置图表挂载节点（通常为 `<canvas id="..."></canvas>`，具体以 F2 文档与所选图表类型为准），在对应 `js/xxx.js` 中使用 `F2` 初始化；路由切换或页面卸载时销毁图表实例并解除事件绑定，与上文「生命周期处理」中的图表清理要求一致。
- 禁止通过 CDN 引入 F2；F2 与 Vant 样式无固定先后顺序，脚本建议在页面业务脚本之前加载一次即可。

### Vant 4 样式自定义约定

- 优先使用 Vant 官方 CSS 变量进行主题定制（如颜色、圆角、字号、间距），避免直接修改组件源码。
- 组件样式中的颜色优先使用全局主色调（定义于 `css/global.css`，如 `--brand: #4B68FD`），避免在组件内直接写死十六进制颜色值。
- Vant 组件的字体与元件尺寸需与全局规则保持一致：统一在 `css/global.css` 中通过变量映射（如 `--van-font-family`、`--van-font-size-md`、`--van-button-default-height`）进行控制。
- 页面级样式覆盖统一放在 `css/xxx.css`，全局通用覆盖沉淀到 `css/global.css`。
- 覆盖选择器尽量以页面容器作用域开头（如 `.app-shell .van-button`），避免影响其他页面组件。
- 若需深度定制，优先通过新增语义化业务类名叠加样式，不直接依赖脆弱的内部 DOM 层级。
- 自定义样式需同时兼顾 `hover/active/disabled` 等状态，保证交互一致性与可读性。

### Vant 4 推荐引入示例

- HTML `<head>` 示例（先 Vant 官方样式，再全局与页面样式；`Inter` 已由 `css/global.css` 内部引入）：
  - `<link rel="stylesheet" href="./assets/vendor/vant/index.css" />`
  - `<link rel="stylesheet" href="./css/global.css" />`
  - `<link rel="stylesheet" href="./css/xxx.css" />`

- `css/global.css` 变量覆盖示例（全局主题）：
  - `:root { --brand: #4B68FD; --font-family-base: "Inter", "PingFang SC", "Microsoft YaHei", "Noto Serif SC", "Helvetica Neue", Arial, sans-serif; --font-size-base: 14px; --control-height-base: 44px; --van-primary-color: var(--brand); --van-button-primary-background: var(--brand); --van-font-family: var(--font-family-base); --van-font-size-md: var(--font-size-base); --van-button-default-height: var(--control-height-base); }`

- `css/xxx.css` 页面级覆盖示例（局部定制）：
  - `.app-shell .van-button--primary { box-shadow: 0 8px 20px rgba(37, 99, 235, 0.24); }`

- JS 引入建议：
  - Vant JS 必须优先使用本地化资源；源文件为 `./assets/vendor/vant/vant.min.js`，生成页面时必须同步复制到 `/app/vendor/vant/` 并改写为 `/app` 内相对路径引用（如 `./vendor/vant/vant.min.js`），确保交付目录可离线预览。
  - 页面脚本中仅保留一处 Vant 初始化与挂载入口，避免重复注册、重复挂载或在多个脚本块中分散初始化。
  - 非明确说明的特殊场景下，禁止使用 CDN 引入 Vant JS。

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

## 字体落位细则

- 引入顺序：页面 `<head>` 必须先引入 `./css/global.css`，再引入 `./css/xxx.css`，确保页面样式在全局规则之上做增量覆盖。
  - `<link rel="stylesheet" href="./css/global.css" />`
  - `<link rel="stylesheet" href="./css/xxx.css" />`
- 覆盖边界：禁止在单个页面直接写死与全局变量冲突的字体栈；如需特殊字体，仅在局部语义化类名上按需覆盖。


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

1. 当前内置资源：

- `./assets/xxx.html`（页面基座模板，定义统一外框结构与内容插槽）
- `./assets/css/global.css`（全局样式与设计变量入口，含 `--font-family-base` 等通用令牌）
- `./assets/css/xxx.css`（与模板配套的页面级样式文件，用于布局示例与局部视觉规则）
- `./assets/fonts/`（字体资源目录，存放 `Inter` 及其样式文件；页面字体统一由 `css/global.css` 引用）
- `./assets/images/`（图片资源目录，存放状态栏图与业务图片；命名统一小写短横线风格）
- `./assets/vendor/`（第三方库目录，存放本地化依赖如 `vant`、`f2`，避免运行时依赖外网 CDN）

2. 保留框架结构  
   不修改以下外框节点：
   - `.ios-frame-wrapper`
   - `.ios-screen`
   - `.status-bar`（默认状态栏图在 `css/global.css` 的 `:root { --status-bar-image }` 中配置；需白底图时在页面 CSS 覆盖为 `url("../images/status-bar-white.svg")`）
   - `.dynamic-island`
   - `.home-indicator`

3. 内容落位规则  
   除 `title-bar` 内的页面标题与左右操作按钮外，所有页面主体业务内容（如欢迎语、卡片、列表、表单、图表等）必须写在 `main.screen-content > section.app-shell` 中。  
   `.top-header-shell` 仅用于承载系统外框与标题区节点（如 `.status-bar`、`.dynamic-island`、`.title-bar`），不得承载页面主体业务模块。

4. 样式与脚本分离  
  - 在 HTML 的 `<head>` 区域通过 `<link>` 引入独立 CSS
  - `Inter` 字体已在 `css/global.css` 内部引入，HTML 的 `<head>` 无需单独引入字体 CSS
  - 未使用 Vant 时，CSS 引入顺序为：先 `css/global.css`，再 `css/xxx.css`
  - 使用 Vant 4 时，CSS 引入顺序为：先 `./assets/vendor/vant/index.css`，再 `css/global.css`，最后 `css/xxx.css`（确保全局样式优先级高于 Vant 官方样式）
  - 在 HTML 的 `<head>` 区域通过 `<script>` 引入独立 JS
   - 不在 HTML 内写大段内联样式和脚本

5. 滚动规范  
   页面滚动区域保持“可滚动但隐藏滚动条”的体验，不要恢复默认滚动条显示。

6. 页面编码与落盘规范（强制）  
   - 所有 `html/css/js/svg/json/md` 文本文件统一使用 `UTF-8`（建议无 BOM）。  
   - HTML 文件必须包含 `<meta charset="UTF-8">`，且与文件实际编码一致。  
   - 禁止使用会默认写成 ANSI 或 UTF-16 的保存方式；若使用脚本写文件，必须显式指定 `UTF-8` 编码。  
   - 发现乱码时，先修正“文件实际编码”，再处理文案本身，避免只改字符不改编码导致反复复发。

## 命名规范

- 文件名统一小写，如有多个单词，中间用连字符：`home.html`、`user-profile.html`

## 快速检查清单

- 是否选择了正确的外框模板（iOS / wechat），且未破坏圆角、层级与关键系统节点
- 是否严格遵循“核心规则”：仅 `title-bar` 可放标题与左右按钮；主体业务内容均在 `main.screen-content > section.app-shell`；`.top-header-shell` 不承载业务模块
- 页面是否以 `/app` 为交付目录，且页面在 `/app` 内可独立预览（运行时资源闭环）
- 是否不存在任何跨目录运行时引用（尤其是 `./assets/...`）；所有 `link/script/img/font/vendor` 引用均为 `/app` 内相对路径
- 模板配套 CSS（`./assets/css/ios-frame-*.css`、`./assets/css/wechat-frame-*.css`）是否未被复制到 `/app`，且其必要样式已合并进生成的 `css/xxx.css`（通用部分上收至 `css/global.css`）
- 状态栏图片是否使用小写文件名（`images/status-bar-*.svg`）
- 默认是否在 `css/global.css` 中通过 `--status-bar-image` 引用 `images/` 下资源（路径相对 `css/` 目录，如 `../images/status-bar-black.svg`）
- 字体资源是否落在 `/app/fonts/`，且 `css/global.css` 内部是否正确 `@import url("../fonts/inter.css")`
- `inter.css` 引用的字体文件（如 `inter-variable.woff2`）是否已随 `/app/fonts/` 一并落盘，避免字体声明存在但实际文件缺失
- 第三方库是否已本地化到 `/app/vendor/`（如 `vant`、`f2`），避免运行时依赖外网 CDN
- 常用组件（按钮、卡片、输入框、弹窗、标签）是否遵循 `./component.md`
- 内容是否仅放在 `.screen-content` 中
- 页面超出区域是否仍隐藏滚动条
- CSS/JS 是否独立文件
- HTML 与 CSS 文件是否完整且引用正确（`xxx.html`、`css/global.css`、`css/xxx.css`；如需交互则 `js/xxx.js`），不存在缺失文件或错误路径导致样式未加载
- 页面样式是否正常且无明显错误（布局未崩坏/字号颜色符合预期；控制台无 `css/js/images/fonts/vendor` 的 404；无因 CSS 语法错误导致的整段样式失效）
- 是否按规则引入 CSS（未使用 Vant：`global.css -> xxx.css`；使用 Vant：`vant.css -> global.css -> xxx.css`）
- 是否在 `css/global.css` 的 `:root` 中声明 `--font-family-base`
- 全局文字是否使用 `font-family: var(--font-family-base)`
- 文件实际编码是否与页面声明编码一致（如 `<meta charset="UTF-8">` 对应 UTF-8）


## 中文乱码排查与修复（编码一致性规范）

- 根因链路（按概率排序）：
  - 文件以 ANSI/GBK/UTF-16 保存，但页面声明为 UTF-8；
  - 复制或脚本生成时发生二次转码（例如先 ANSI 写入再被当 UTF-8 读取）；
  - 编辑器自动识别编码错误，导致“看起来正常、刷新后乱码”。
  - Windows 终端代码页为 `936`（GBK）时，若未显式指定写入编码，含中文的 `html` 可能被落盘为 GBK/ANSI。
- 实战结论（app-demo 已复现）：
  - 现象：`css/js` 正常、仅 `html` 乱码，且 `meta charset="UTF-8"` 已声明；
  - 原因：声明是“读取规则”，不能修正“文件实际字节编码”；当 `html` 实际不是 UTF-8 时仍会乱码；
  - 判定：用脚本校验文件是否可被 UTF-8 解码（不能仅看编辑器显示）。
- 创建/修改页面的硬性要求：
  - 新建文件后第一步先确认编码为 UTF-8，再开始写内容；
  - 保存前再次确认编码仍为 UTF-8（无 BOM）；
  - 不使用“另存为默认编码”或来源不明的批量转码工具。
  - Windows 下通过脚本写文件时必须显式指定 UTF-8（如 PowerShell `Set-Content -Encoding utf8`）。
- 验收动作（每次创建页面后执行）：
  - 浏览器查看页面中文、控制台输出、JS 字符串是否都正常；
  - 随机打开 `html/css/js` 各 1 个文件，确认编码显示为 UTF-8；
  - 若存在构建流程，确认构建前后文件编码未变化。
  - 对含中文的 `html` 增加一次“字节级校验”：`python -c "import pathlib; pathlib.Path('app/xxx.html').read_bytes().decode('utf-8'); print('utf8_ok')"`。
- 修复顺序（出现乱码时）：
  - 先将问题文件统一转为 UTF-8（无 BOM）并保存；
  - 再检查 `<meta charset="UTF-8">` 是否存在且仅声明一次；
  - 最后清理缓存后刷新，避免旧缓存干扰判断。
  - 若仍异常，检查访问链路（本地服务/网关）响应头 `Content-Type` 是否错误携带了非 UTF-8 charset。
- HTML 与 JS 文案默认直接写中文，不使用实体转义作为常态方案。


## 备注

如需新增页面，优先选择最接近的基座模板进行创建，避免从零搭建框架。
