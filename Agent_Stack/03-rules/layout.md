# 规则库 — 前端布局（R-LAYOUT-*）

> 来源：Agent_Memory/003-布局与前端实现.md。
> 索引入口：`rules.index.json` → trigger「布局/大屏/塌陷/contents」。
> **scope：默认 universal**（所有项目通用）；R-LAYOUT-04 为 project（仅限本项目）。

## R-LAYOUT-01 — 关键 CSS 用 inline style 兜底
- **level**: must | **status**: valid | **scope**: universal
- **trigger**: 依赖 `display: contents` 等冷门 Tailwind utility
- **rule**: 用 `style={{ display: 'contents' }}` 强制指定，绕过 Tailwind class
- **reason**: Tailwind 4 不自动生成所有 utility，只有显式 import 的 class 才进 CSS
- **verify**: grid 三栏不塌陷成单列

## R-LAYOUT-02 — fullWidth 模式自建比例容器
- **level**: must | **status**: valid | **scope**: universal
- **trigger**: PrototypeLayout fullWidth 模式下父容器无显式高度
- **rule**: 自建比例容器（aspect-ratio 或 viewport 单位），**具体比例以本项目 `project-memory.md` 规定为准**；勿用 h-screen/calc(100vh-X)/h-full
- **reason**: .plx-full{display:block} 不提供高度约束，依赖父容器高度的样式全部失效（h-full=0）
- **示例**（仅参考，非强制）：16:9 大屏 wrapper 可用 `width:min(100%,calc((100vh-80px)*16/9)); height:min(calc(100vh-80px),calc(100vw*9/16))`
- **verify**: 容器按本项目要求比例正常显示，地图等关键元素可见

## R-LAYOUT-03 — 提升变量到顶层
- **level**: must | **status**: valid | **scope**: universal
- **trigger**: 跨组件/JSX 顶层要访问某变量
- **rule**: 常量提升为模块级，勿放 useEffect 内
- **reason**: useEffect 内层变量，return 顶层 JSX 访问不到 → undefined 报错
- **verify**: 图例等顶层 JSX 不报 undefined

## R-LAYOUT-04 — 大屏比例/布局要求以项目记忆为准
- **level**: should | **status**: valid | **scope**: project
- **trigger**: 处理某个具体项目的大屏/页面布局
- **rule**: 先读该项目根目录 `project-memory.md` 的「项目画像·技术约束」；**不得把其他项目的尺寸/比例/风格套用过来**
- **reason**: 每个大屏项目的尺寸、风格要求不同（2026-08-18 用户确认）；16:9 仅代表大屏类项目的常见示例，不是通用规范
- **verify**: 布局符合本项目规定比例，未被跨项目经验误导
