## Style Snapshot
- Overall style: 暗色企业级云平台风格，采用低饱和黑灰基底 + 高对比浅色信息层，强调“稳健、技术、可观测”。
- Tone keywords: 深色、冷静、理性、专业、克制、未来感、工程化。
- Suitable product types: 云平台官网、SaaS 控制台官网、B2B 技术产品落地页、开发者平台门户。

## Design Tokens
### Colors
- `color.surface.base`: `#030303`（页面主背景）
- `color.surface.canvas`: `#060606`（内容层背景）
- `color.surface.elevated`: `#0c0c0c`（抬升层）
- `color.surface.card`: `#0f0f10`（卡片底）
- `color.text.primary`: `#f4f4f5`
- `color.text.secondary`: `#a1a1aa`
- `color.text.tertiary`: `#71717a`
- `color.brand.primary`: `#fafafa`（亮色主强调）
- `color.brand.soft`: `rgba(250, 250, 250, 0.12)`
- `color.border.default`: `rgba(255, 255, 255, 0.08)`
- `color.border.strong`: `rgba(255, 255, 255, 0.14)`
- `color.effect.glow`: `rgba(255, 255, 255, 0.06)`

### Typography
- `font.family.body`: `"PingFang SC", "Microsoft YaHei", "Heiti SC", system-ui, sans-serif`
- `font.family.display`: `"Rajdhani", system-ui, sans-serif`
- `font.family.numeric`: `"Manrope", system-ui, sans-serif`
- `font.size.900`: `clamp(2rem, 6.5vw, 4.25rem)`（Hero 主标题）
- `font.size.700`: `clamp(1.65rem, 3vw, 2.1rem)`（区块标题）
- `font.size.500`: `1rem`（正文）
- `font.size.300`: `0.875rem`
- `font.size.200`: `0.8125rem`
- `font.weight.semibold`: `600`
- `font.weight.bold`: `700`
- `line.height.body`: `1.65`
- `line.height.display`: `1.14~1.3`（标题/卡片标题）
- `type.numeric.tabular`: `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;`

### Backgrounds
- `bg.page`: 纯深色背景 + 噪点贴图（低透明度）
- `bg.grid.overlay`: 56px 网格线叠层（极低对比）
- `bg.hero.scrim`: 多层 radial-gradient 压暗与聚焦
- `bg.section.alt`: 轻量线性渐变 + 径向微光
- `bg.card.default`: `rgba(255, 255, 255, 0.015~0.03)` 半透明暗卡
- `bg.pill`: `color-mix(..., transparent)` 半透明胶囊底

### Shadows
- `shadow.soft`: `0 24px 80px rgba(0, 0, 0, 0.65)`（全局软阴影）
- `shadow.header.floating`: `0 24px 60px rgba(0, 0, 0, 0.45)`（滚动后顶栏）
- `shadow.card.hover`: `0 14px 30px rgba(0, 0, 0, 0.28)`（价格卡 hover）
- `shadow.inner.stroke`: `0 0 0 1px rgba(255,255,255,0.05)`（轻描边抬升）

### Borders
- `border.width.default`: `1px`
- `border.color.default`: `rgba(255,255,255,0.08)`
- `border.color.strong`: `rgba(255,255,255,0.14)`
- `border.style`: `solid`
- `divider.style`: 低对比 1px 线性/纯色分割线
- `border.interaction`: hover 从 default 提升到 strong，不使用高饱和彩色边框

### Radii
- `radius.sm`: `10px`
- `radius.md`: `14px`
- `radius.lg`: `~18px`（登录卡片）
- `radius.pill`: `999px`
- Mapping:
  - `radius.pill`: 按钮、标签、胶囊操作
  - `radius.sm`: 输入容器、小控件
  - `radius.md`: 通用卡片
  - `radius.lg`: 核心大卡（登录卡）

### Buttons
- `button.size.sm`: `min-height: 2rem`, `font-size: 0.8125rem`
- `button.size.md`: `font-size: 0.875rem`
- `button.size.lg`: `font-size: 0.92rem`, `padding: 0.58rem 1.18rem`
- `button.variant.primary`:
  - bg: `#fafafa`
  - text: `#050505`
  - border: `#e4e4e7`
  - hover: 轻微透明度变化 + 保持高对比
- `button.variant.secondary` (`btn-hero-secondary`):
  - bg: `rgba(255,255,255,0.06)`
  - text: `#f4f4f5`
  - border: `var(--border-strong)`
  - hover: `background: var(--accent-soft)`, border 弱化
- `button.variant.ghost`:
  - bg: transparent
  - text: `var(--text-muted)`
  - hover: `var(--accent-soft)`
- `button.focus`: 使用可见轮廓（如 `outline: 2px solid rgba(255,255,255,0.4)`）

### Layout
- `layout.container.max`: `1200px`
- `layout.container.gutter`: `clamp(20px, 4vw, 40px)`
- `layout.hero.max`: `80rem`
- `layout.narrow.max`: `760px`
- `layout.section.y`: `clamp(4.5rem, 9vw, 6.75rem)`
- `layout.grid.cards.gap`: `1.25rem`
- `layout.breakpoint.md`: `860~960px`
- `layout.breakpoint.sm`: `640px`
- `space.2`: `0.5rem`
- `space.3`: `0.75rem`
- `space.4`: `1rem`
- `space.5`: `1.25rem`
- `space.6`: `1.5rem`
- `space.8`: `2rem`

## Style Principles
1. 以深色底承载信息，亮色只给关键动作与核心数据，避免全局高亮导致噪声。
2. 对比策略采用“文本高对比、边框低对比、背景微差异”三层体系，保持科技感与可读性平衡。
3. 组件几何以中圆角 + 胶囊形为主，减少锐角，呈现稳定与企业级可信感。
4. 交互反馈克制：hover 主要变化边框强度、背景透明度和轻微位移，不做夸张动画。
5. 信息层级靠字号与字重分层，而不是颜色过多分层；正文长期保持中灰，标题与关键指标提亮。
6. 数据类文本统一等宽数字体系，强化仪表盘与指标可信度。
7. 布局密度“上松下稳”：Hero 空间更大，列表与卡片采用规律化 gap，保证扫描效率。
8. 背景纹理（噪点/网格）仅做氛围，不参与信息表达，透明度必须压低。
9. 多端保持同一视觉 DNA，移动端通过压缩间距和重排网格，而非更换风格语言。
10. 语义化按钮区分“主动作（高对比）/次动作（低对比）”，并确保尺寸系统一致。

## Prompt Pack
### Foundation Prompt
为一个 B2B 云平台页面生成暗色技术风格视觉系统。整体基调：`#030303` 深色底、低对比边框、明亮文本和胶囊化交互。必须使用以下 token 约束：`color.surface.base=#030303`、`color.text.primary=#f4f4f5`、`color.border.default=rgba(255,255,255,0.08)`、`radius.md=14px`、`radius.pill=999px`、`layout.container.max=1200px`。布局约束：Hero 居中叙事，区块上下留白使用 `clamp(4.5rem,9vw,6.75rem)`，卡片网格间距 `1.25rem`。交互约束：hover 仅允许边框增强、背景轻微提亮、最多 2px 位移；按钮主次关系明确（Primary 高对比，Secondary 半透明暗底）。Avoid：高饱和渐变、霓虹发光主导、超过 2 种强调色、重阴影堆叠、花哨插画背景。

### Component Prompt
按该项目风格生成组件集合：导航栏、按钮、卡片、表单输入、FAQ 折叠项。组件 token 约束：按钮高度采用 `sm/md/lg` 三档，主按钮 `bg=#fafafa text=#050505`，次按钮 `bg=rgba(255,255,255,0.06) border=rgba(255,255,255,0.14)`；输入框与卡片边框默认 `rgba(255,255,255,0.08)`，focus/hover 提升到 `rgba(255,255,255,0.14)`。布局约束：卡片圆角 14px，输入框圆角 10px，胶囊控件 999px；移动端 ≤640px 进行单列重排。交互约束：按钮需给出 hover/focus/active 三状态，focus 需可见。Avoid：按钮样式混乱（同级按钮不同高度）、过强高光边框、无状态反馈。

### Variation Prompt
在保持同一品牌 DNA 的前提下，生成“更轻一点”的变体：保留深色底与结构不变，但将文本次级色从 `#a1a1aa` 提亮到 `~#b3b3bc`，卡片背景从 `rgba(255,255,255,0.015)` 提升到 `~0.025`，边框强度维持不变。布局与组件几何不可变（容器宽度、圆角尺度、按钮体系必须一致）。交互约束不变：轻反馈、低动效。Avoid：改成浅色主题、引入新品牌色、改变圆角体系、将卡片改成高阴影拟物风。

## Reuse Notes
- What must stay unchanged:
  - 深色底 + 低对比边框 + 高对比主文本的核心对比策略
  - 圆角体系（10/14/999）和按钮主次样式关系
  - 容器宽度与区块节奏（1200 + clamp 间距）
  - 交互克制原则（边框/背景微变化）
- What can be flexed:
  - Hero 文案密度与信息块数量
  - 卡片网格列数（依据业务内容 2~4 列）
  - 次级文本亮度可在 `#9ca3af ~ #b3b3bc` 小范围浮动
  - 背景网格/噪点透明度可按品牌语气微调
- Risk of style drift:
  - 过度使用亮色按钮会破坏层级
  - 引入多彩渐变会偏向营销页而非企业技术页
  - 阴影过强会削弱当前“稳健克制”的工业感

## Quality Score
- Total: 92/100
- Verdict: Pass

## Dimension Scores
- Style consistency: 18/20
- Token implementability: 14/15
- Color and contrast: 14/15
- Typography hierarchy: 9/10
- Component completeness: 9/10
- Layout and spacing: 9/10
- Anti-drift constraints: 10/10
- Variation control: 9/10

## Deductions
- 个别微层级色值在不同模块有轻微浮动，统一后可再提升：-2
- 动效人格未拆分到更细的时间曲线 token：-2
- 部分组件（如复杂表单校验态）未做独立语义色 token：-4

## Key Risks
- 若后续新增彩色品牌主色，需重新平衡当前黑白灰主导对比体系。
- 若改动 section 间距但不联动字体层级，页面会出现“密度失衡”。

