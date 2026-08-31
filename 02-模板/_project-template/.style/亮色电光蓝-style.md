## Style Snapshot
- Overall style: 现代企业营销/SaaS 着陆页风格：浅灰底（`#fafafa`）+ 纯白卡片，**电光蓝（#0052ff）** 作为唯一强品牌色；大面积留白、柔和投影与轻微磨砂顶栏；首屏产品图使用 3D 透视与渐变文字强化「科技感」但不花哨。
- Tone keywords: 可信、清晰、偏 B2B、略偏冷静的技术感、偏「增长/自动化」叙事。
- Suitable product types: 营销自动化、CRM 周边、企业增长工具、数据分析控制台、B2B SaaS 着陆页与账号中心。

## Design Tokens
### Colors（语义化命名 ↔ 项目 CSS 变量/值）
| Token | 值 / 来源 | 说明 |
|-------|-----------|------|
| `color.brand.primary` | `#0052ff` / `--accent` | 主品牌蓝 |
| `color.brand.secondary` | `#4d7cff` / `--accent-secondary` | 渐变第二端、辅助强调 |
| `color.text.primary` | `#0f172a` / `--foreground` | 正文与标题主色（slate 系） |
| `color.text.muted` | `#64748b` / `--muted-foreground` | 次级说明、导航次文案 |
| `color.surface.page` | `#fafafa` / `--background` | 页面底 |
| `color.surface.muted` | `#f1f5f9` / `--muted` | 分区浅底、hover 混合 |
| `color.surface.card` | `#ffffff` / `--card` | 卡片/控件面 |
| `color.border.default` | `#e2e8f0` / `--border` | 分割线、描边 |
| `color.focus.ring` | `#0052ff` / `--ring` | 焦点环 |
| `color.onAccent` | `#ffffff` / `--accent-foreground` | 主按钮文字 |
| `color.semantic.error.bg` | `rgba(239, 68, 68, 0.09)` | 表单错误态背景（浅） |
| `color.semantic.error.border` | `rgba(239, 68, 68, 0.72)` | 表单错误态边框 |

**深色主题（`[data-theme="dark"]`）**
| Token | 值 |
|-------|-----|
| `color.surface.page.dark` | `#121214` |
| `color.text.primary.dark` | `#ececee` |
| `color.surface.card.dark` | `#1B1B1D` |
| `color.border.dark` | `#262628` |
| `color.text.muted.dark` | `#9ca3af` |

**氛围色（非 token 变量，固定装饰）**
- 页面巨型柔光斑：`body::before` ≈ `rgba(0, 82, 255, 0.09)`，`body::after` ≈ `rgba(77, 124, 255, 0.08)`，模糊 `blur(140px)`。

### Typography
| Token | 值 |
|-------|-----|
| `font.family.sans` | `"Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif` |
| `font.family.mono` | `"JetBrains Mono", monospace`（用于徽标/装饰性 tech 标签等） |
| `font.family.display` | `Calistoga`（HTML 已引入，**当前 CSS 未作为默认标题族**，可选用作展示标题） |
| `font.body.lineHeight` | `1.65`（全局 `body`） |
| `font.hero.title.size` | `clamp(2.75rem, 5vw, 4rem)`，`line-height: 1.05`，`letter-spacing: -0.02em` |
| `font.hero.lead.size` | `clamp(1rem, 2.2vw, 1.15rem)`，`line-height: 1.75` |
| `font.button.default` | `0.9rem`，`font-weight: 600` |
| `font.button.sm` | `0.82rem` |
| `font.button.lg` | `0.95rem` |
| `font.auth.title` | `1.5rem`，`line-height: 1.2` |
| `font.auth.subtitle` | `1rem`，`line-height: 1.35` |
| `font.auth.input` | `0.875rem` |

### Backgrounds
| Token | 模式 |
|-------|------|
| `background.page` | 纯色 `--background` + 低对比 **noise**（径向渐变透明度约 0.02–0.03）+ **grid**（64px 网格线，透明度约 0.05） |
| `background.hero.marketing` | 区块伪元素径向渐变：`rgba(0,82,255,0.08)` / `rgba(77,124,255,0.1)` 等弱光晕 |
| `background.accent.text` | 标题强调：`linear-gradient(90deg, accent, accent-secondary)` + `background-clip: text` |
| `background.auth.glow` | 登录卡片背后：`radial-gradient`，`blur(100px)`，蓝色光斑 |

### Shadows
| Token | 值 |
|-------|-----|
| `shadow.sm` | `0 1px 3px rgba(0,0,0,0.06)` / `--shadow-sm` |
| `shadow.md` | `0 4px 6px rgba(0,0,0,0.07)` / `--shadow-md` |
| `shadow.lg` | `0 10px 15px rgba(0,0,0,0.08)` / `--shadow-lg` |
| `shadow.xl` | `0 20px 25px rgba(0,0,0,0.1)` / `--shadow-xl` |
| `shadow.accent` | `0 4px 14px rgba(0,82,255,0.25)` / `--shadow-accent` |
| `shadow.accentLg` | `0 8px 24px rgba(0,82,255,0.35)` / `--shadow-accent-lg` |

### Borders
| Token | 规则 |
|-------|------|
| `border.width.default` | `1px`（卡片、按钮 ghost/outline、顶栏） |
| `border.color.default` | `var(--border)` |
| `border.focus.halo` | `box-shadow: 0 0 0 2px var(--ring), 0 0 0 5px color-mix(...)`（按钮等） |
| `border.input.focus` | 双层环：`1px` 蓝色 + `4px` 浅蓝外晕（`.auth-input-wrap:focus-within`） |

### Radii
| Token | 值 |
|-------|-----|
| `radius.sm` | `10px` / `--radius-sm` |
| `radius.md` | `14px` / `--radius-md` |
| `radius.lg` | `18px` / `--radius-lg` |
| `radius.logoMark` | `11px`（34×34 徽标圆角） |
| `radius.pill` | `999px`（胶囊标签、横条轨道） |
| `radius.auth.input` | `6px` |

### Buttons
| 变体 | 视觉规则 |
|------|----------|
| `button.primary` | 品牌蓝对角渐变 `135deg`（`accent` → `accent-secondary`），浅色投影，`hover`：`translateY(-2px)` + `brightness(1.08)` + `shadow-accent-lg` |
| `button.ghost` / `outline` | 白/卡面底 + `border: var(--border)`，`hover`：`translateY(-1px)`，边框混蓝，浅阴影 |
| `button.sizes` | 默认 `min-height: 44px`；`sm`：`36px`；`lg`：`42px` + 左右 `40px` padding |
| `button.active` | `transform: scale(0.98)` |
| `button.focus` | 见 `border.focus.halo` |

### Layout
| Token | 值 |
|-------|-----|
| `layout.container.max` | `min(72rem, calc(100% - 48px))` / `--container` |
| `layout.section.hero.paddingY` | `padding-top: var(--header-offset)`，`header-offset: clamp(74px, 8vw, 88px)` |
| `layout.nav.minHeight` | `74px`（`.nav-grid`） |
| `layout.z.header` | `60`（`.site-header`） |
| `layout.z.decor` | `-5` ~ `-6`（noise/grid） |
| `ease.default` | `cubic-bezier(0.16, 1, 0.3, 1)` / `--ease-out` |
| `motion.header` | `transition: all 0.3s var(--ease-out)` |
| `motion.button` | `0.2s ease-out` |

## Style Principles
1. **单色品牌强调**：全站用同一套蓝（#0052ff → #4d7cff）做 CTA、渐变文字与光斑，避免引入第二套冲突色相。
2. **浅底 + 深字 + 灰说明书**：正文 slate 深色，说明用 muted 灰蓝，保证长文案可读又不抢主按钮。
3. **柔和层高**：投影递增（sm→xl），主按钮 hover 才抬升到 accent shadow，整体偏克制。
4. **「透气」区块节奏**：首屏 hero 居中标题 + 限制 `max-width` 行宽；区段用足够 `padding` 与 `gap`，避免信息堆叠。
5. **玻璃顶栏**：sticky + `backdrop-filter: blur(14px)`，滚动后底略微不透明，强化工具感。
6. **表单与营销页分层**：营销页圆角偏大（10–18px）；账号页输入框更「工具化」小圆角 6px、细边框与 focus 双环。
7. **深色主题为中性灰阶**：深灰而非纯黑，边框与文字对比略柔和，减少刺目感。
8. **动效节制**：以 `translateY` / `scale` 微交互为主，时长约 0.2–0.3s，符合 B2B 稳重气质。

## Prompt Pack
### Foundation Prompt
创建一个 **MarkFlow 风格** 的整页着陆框架：页面背景为极浅灰（`#fafafa`），叠加极淡噪声与 64px 淡网格；页眉 sticky、底部分割线、`backdrop-blur`；主标题使用 Inter 系，大号 `clamp` 标题、`letter-spacing` 略负；一句副标题为 muted 灰；唯一主色为 **#0052ff**，与 **#4d7cff** 组成渐变用于主按钮与标题渐变字；按钮为对角渐变、圆角约 10px，hover 轻微上浮与蓝色发光阴影；区段用白卡片与 `--shadow-md`~`lg`；避免紫色、避免霓虹发光主按钮、避免纯黑底白字（除非单独深色模式规范）。

**Token 约束**：`color.brand.primary=#0052ff`，`color.surface.page=#fafafa`，`color.surface.card=#ffffff`，`color.text.primary≈#0f172a`，`color.text.muted≈#64748b`，`radius` 以 10/14/18 为主。

**布局约束**：主内容 `max-width` 约 72rem 居中；hero 文案居中，`max-width` 限制可读行长。

**交互约束**：主 CTA hover 上移 2px + 阴影增强；focus 为 2px 品牌色环 + 外扩散浅环。

**Avoid**：随机多色渐变、每区块换accent色、粗重黑色描边、卡通插画风、无意义大圆角药丸铺满全站。

### Component Prompt
生成 **同品牌** 的组件集（按钮 secondary/ghost、卡片、FAQ 折叠、定价表、页脚）：所有组件边框使用 `1px` + 浅灰 `#e2e8f0`；主按钮复制「对角蓝渐变 + 白字 + 轻投影」；次级按钮为白底 + 灰边框，hover 边框带微蓝；卡片白底、`border-radius` 14–18px、`box-shadow` 用 md/lg；输入框若为表单场景使用 **6px** 圆角、浅灰底 `muted` 与蓝色 focus 双环。**Avoid**：炫彩边框、Neumorphism 深陷、彩色阴影。

### Variation Prompt
在 **保留** `accent=#0052ff` 与「浅灰底 + 白卡 + 蓝色 CTA」三件套前提下，做一版 **更紧凑** 变体：全局垂直间距减少约 15%，`section` padding 从 `clamp` 上限略降；标题 `line-height` 维持紧凑（约 1.05）；按钮仍保持 44px 最小点击高度不变。**Avoid**：为紧凑而压缩到行高小于 1.3 的正文段落、或取消焦点环。

## Reuse Notes
- **What must stay unchanged**: 主品牌蓝双色渐变体系（#0052ff / #4d7cff）、浅灰页面底与白卡对比、按钮 hover 抬升 + 蓝色投影、焦点环结构（2px ring + 外晕）。
- **What can be flexed**: Calistoga 是否用于展示大字、区段之间的具体 `padding` 数值、卡片圆角在 10–18 区间内微调。
- **Risk of style drift**: 引入第三色强调（绿/紫）做 CTA、或将背景改为重渐变/纯黑「科技风」会快速偏离当前站点的「克制 B2B」气质。

## Quality Score
- Total: 86/100
- Verdict: Pass

## Dimension Scores
- Style consistency: 17/20
- Token implementability: 14/15
- Color and contrast: 13/15
- Typography hierarchy: 8/10
- Component completeness: 8/10
- Layout and spacing: 9/10
- Anti-drift constraints: 9/10
- Variation control: 8/10

## Deductions
- Calistoga 已加载但 CSS 未统一用于标题，展示字族存在轻微「可选 vs 默认」模糊（-2 token 一致性）
- 部分装饰阴影为组件内硬编码，与 token 表需人工对齐一次（-2）

## Key Risks
- 复用时若忽略 `muted` 与 `border` 的 slate 体系，容易做成「冷灰偏蓝不一致」
- 深色主题若只改背景不改边框/弱文字，可能出现对比不足

## Fix First (Top 3)
1. （可选）若需提分：在样式中明确一处 Calistoga 用于 `hero` 或 `section-title`，或从 Prompt 中删除 Calistoga 以免混用。
2. 将 FAQ/定价等大块卡片的 `border-radius` 汇总为仅用 `radius-md`/`radius-lg` 两档，减少漂移。
3. 深色模式为 `muted-foreground` 与 `border` 做一次对比度抽检（WCAG AA）。

---

## 源码映射速查

| 区域 | 主要选择器 / 文件 |
|------|-------------------|
| 全局 token | `css/styles.css` `:root`、`[data-theme="dark"]` |
| 顶栏 / 导航 | `.site-header`、`.nav-grid`、`.mobile-nav` |
| Hero | `.hero--marketing`、`.hero-title--center`、`.hero-accent` |
| 按钮 | `.btn`、`.btn-primary`、`.btn-ghost` |
| 账号页 | `.auth-card`、`.auth-input-wrap` |


