## Style Snapshot
- Overall style: 现代极简 SaaS 风格，浅底深字，黑色主 CTA，辅以轻微玻璃感和低噪点纹理。
- Tone keywords: clean, neutral, premium-light, calm, structured, high-clarity。
- Suitable product types: SaaS 官网、产品落地页、预约演示页、登录注册页、B2B 增长站点。

## Design Tokens
### Colors
- `color.brand.primary`: `#000000`
- `color.brand.onPrimary`: `#ffffff`
- `color.surface.base`: `#f9fafb`
- `color.surface.card`: `#ffffff`
- `color.surface.muted`: `#f4f4f5`
- `color.text.primary`: `#101112`
- `color.text.secondary`: `#71717a`
- `color.text.strong`: `#18181b`
- `color.border.subtle`: `rgba(0, 0, 0, 0.06)`
- `color.border.default`: `#e4e4e7`
- `color.state.focusRing`: `#a1a1aa`
- `color.state.error`: `#dc2626`
- `color.state.errorBg`: `#fff7f7`
- `color.neutral.50`: `#fafafa`
- `color.neutral.100`: `#f4f4f5`
- `color.neutral.200`: `#e4e4e7`
- `color.neutral.300`: `#d4d4d8`
- `color.neutral.400`: `#9f9fa9`
- `color.neutral.500`: `#71717a`
- `color.neutral.600`: `#52525c`
- `color.neutral.700`: `#3f3f46`
- `color.neutral.800`: `#27272a`
- `color.neutral.900`: `#18181b`

### Typography
- `font.family.base`: `"Inter", "SF Pro Display", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`
- `font.family.brand`: `"Manrope", "Inter", sans-serif`
- `font.family.mono`: `"Fira Code", ui-monospace, monospace`
- `font.size.100`: `0.75rem`
- `font.size.200`: `0.8125rem`
- `font.size.300`: `0.875rem`
- `font.size.400`: `1rem`
- `font.size.500`: `1.125rem`
- `font.size.600`: `1.25rem`
- `font.size.display`: `clamp(2.25rem, 5vw, 3.75rem)`
- `font.size.title`: `clamp(1.75rem, 3vw, 2.25rem)`
- `font.weight.medium`: `500`
- `font.weight.semibold`: `600`
- `font.weight.bold`: `700`
- `font.weight.extrabold`: `800`
- `font.lineHeight.base`: `1.6`
- `font.letterSpacing.base`: `-0.015em`
- `font.letterSpacing.heading`: `-0.02em ~ -0.04em`

### Backgrounds
- `bg.page.gradient`: `linear-gradient(180deg, #ffffff 0%, #fafafa 100%)`
- `bg.mesh.overlay.1`: `radial-gradient(ellipse 80% 50% at 0% -20%, rgba(99, 102, 241, 0.08), transparent 50%)`
- `bg.mesh.overlay.2`: `radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.06), transparent 45%)`
- `bg.mesh.overlay.3`: `radial-gradient(ellipse 50% 30% at 100% 100%, rgba(244, 63, 94, 0.05), transparent 50%)`
- `bg.section.tech`: `#f8f9fa`
- `bg.section.techTexture`: `radial-dot pattern @18px grid, opacity 0.42`

### Shadows
- `shadow.card`: `0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)`
- `shadow.floating`: `0 20px 40px -15px rgba(0,0,0,0.08), 0 8px 16px -8px rgba(0,0,0,0.05)`
- `shadow.button.primary`: `0 20px 60px -30px rgba(0, 0, 0, 0.12)`
- `shadow.hover.card`: `0 20px 60px -10px rgba(0, 0, 0, 0.08)`

### Borders
- `border.width.base`: `1px`
- `border.color.subtle`: `rgba(0, 0, 0, 0.06)`
- `border.color.soft`: `rgba(228, 228, 231, 0.55)`
- `border.color.form`: `#d4d4d8`
- `border.color.error`: `#dc2626`
- `border.style.default`: `solid`
- `divider.default`: `1px solid var(--color.neutral.200)`

### Radii
- `radius.pill`: `9999px`
- `radius.xs`: `0.55rem`
- `radius.sm`: `0.65rem`
- `radius.md`: `0.85rem`
- `radius.lg`: `1rem`
- `radius.xl`: `1.25rem`
- `radius.card`: `16px`

### Buttons
- `button.height.sm`: `~2.5rem`
- `button.height.md`: `~2.8rem`
- `button.padding.md`: `0.65rem 1.25rem`
- `button.padding.lg`: `0.85rem 1.5rem`
- `button.padding.hero`: `1rem 2.5rem`
- `button.weight`: `600`
- `button.radius`: `radius.pill`
- `button.variant.primary.bg`: `color.brand.primary`
- `button.variant.primary.text`: `color.brand.onPrimary`
- `button.variant.primary.hover`: `color.neutral.800`
- `button.variant.secondary.bg`: `color.neutral.100`
- `button.variant.secondary.text`: `color.neutral.900`
- `button.variant.ghost.bg`: `transparent`
- `button.variant.ghost.text`: `color.neutral.700`
- `button.state.focusRing`: `0 0 0 2px #fff, 0 0 0 4px color.state.focusRing`
- `button.state.active`: `~translateY(1px)`（建议补充）

### Layout
- `layout.container.max`: `80rem`
- `layout.container.paddingX`: `1.25rem`
- `layout.container.narrow`: `48rem`
- `layout.section.paddingY`: `clamp(4rem, 8vw, 6rem)`
- `layout.hero.paddingTop`: `clamp(3rem, 8vw, 5rem)`
- `layout.hero.paddingBottom`: `clamp(4rem, 10vw, 6rem)`
- `layout.grid.gap.1`: `0.75rem`
- `layout.grid.gap.2`: `1rem`
- `layout.grid.gap.3`: `1.25rem`
- `layout.grid.gap.4`: `1.5rem`
- `layout.breakpoint.sm`: `640px`
- `layout.breakpoint.md`: `768px`
- `layout.breakpoint.nav`: `900px`
- `layout.breakpoint.hero`: `960px`
- `layout.breakpoint.form`: `980px`
- `layout.breakpoint.lg`: `1024px`
- `layout.breakpoint.xl`: `1200px`

## Style Principles
1. 高对比用于“行动点”，低对比用于“信息背景”，用黑白 CTA 锁定转化焦点。
2. 以中性灰阶作为主色语言，避免饱和色大面积占用，维持 B2B 场景的专业感。
3. 标题采用紧字距和高字重，正文保持 1.6 行高，形成清晰阅读节奏。
4. 大圆角 + 细边框 + 轻阴影组合塑造温和且现代的组件几何。
5. 卡片悬浮仅做微位移和阴影增强，交互语气克制，不制造“跳动感”。
6. 通过容器宽度与固定节奏间距建立整站秩序，保证多页面一致性。
7. 背景纹理和渐变透明度控制在低阈值，增强精致感但不干扰内容。
8. 动效以线性滚动和短过渡为主，保留信息效率优先于娱乐性。
9. 表单状态（focus/error）必须显式可见，优先可访问性反馈。
10. 移动端优先保证导航与主按钮可点击面积，视觉层次不牺牲可用性。

## Prompt Pack
### Foundation Prompt
为我生成一个现代 B2B SaaS 官网页面，风格为“浅底深字、黑色主 CTA、克制中性色、轻玻璃感”。  
请严格使用以下约束：  
1) 颜色 token：主色 `#000000`，主按钮文字 `#ffffff`，正文 `#101112`，次级文字 `#71717a`，背景 `#f9fafb`，卡片 `#ffffff`，边框 `rgba(0,0,0,0.06)`。  
2) 排版：主字体 Inter 系列，正文 16px/1.6，标题字重 700-800，标题字距 -0.02em 到 -0.04em。  
3) 布局：容器最大宽 80rem，区块上下留白 `clamp(4rem,8vw,6rem)`，首屏可在 960px 以上采用双列。  
4) 组件几何：卡片圆角 16px，按钮胶囊圆角 9999px，输入框圆角 0.65rem-0.85rem。  
5) 交互：hover 仅轻微阴影/颜色变化，focus 使用 2 层 ring（白色内圈 + 灰色外圈）。  
6) 视觉效果：允许低透明度渐变或网点纹理背景，但透明度需低于主内容对比。  
Avoid: 大面积高饱和渐变、重拟物阴影、夸张动效、霓虹色描边、过密信息栅格、花哨装饰图标。

### Component Prompt
请生成同一风格体系下的按钮、卡片、表单组件集（含状态）。  
要求：  
1) 按钮至少包含 `primary/secondary/ghost` 三种变体，提供 `default/hover/focus/disabled/active` 状态。  
2) Primary 按钮背景 `#000000`，hover 变为 `#27272a`，focus ring 为 `0 0 0 2px #fff, 0 0 0 4px #a1a1aa`。  
3) 卡片背景纯白，边框 `rgba(228,228,231,0.55)`，阴影使用轻层级，不可出现重投影。  
4) 输入框默认浅灰底，focus 改白底并显示 3px 灰色 ring；错误态使用 `#dc2626` 边框与浅红背景。  
5) 组件间距遵循 8px 基线（8/12/16/20/24），不允许随意插值。  
Avoid: 渐变按钮、玻璃态输入框、锐角直角卡片、无状态反馈的表单控件、过粗边框。

### Variation Prompt
在保持同一设计 DNA 的前提下，生成“更暖、更柔和”的变体主题。  
控制变量仅限：  
1) 将背景从冷灰白改为暖灰白（如 `#faf9f7` ~ `#f7f5f2`）。  
2) 中性文本色整体暖化半级（对比度保持 AA）。  
3) 阴影透明度提升 10%-15%，但模糊半径不增加。  
4) 圆角允许 +2px（按钮仍保持胶囊）。  
保持不变：布局节奏、主 CTA 黑白对比、表单状态可见性、组件层级逻辑。  
Avoid: 改主色为彩色、降低主 CTA 对比、压缩区块留白、引入拟物/复古纹理。

## Reuse Notes
- What must stay unchanged: 黑白主 CTA 对比、中性灰主导、16px+圆角卡片体系、克制阴影、清晰 focus/error 状态、80rem 容器与大区块留白节奏。
- What can be flexed: 背景纹理类型、品牌辅助色点缀、标题字体（同类无衬线）、部分圆角级别、分栏密度（在断点规则内）。
- Risk of style drift: 最常见漂移是“颜色变花”“阴影过重”“按钮不再高对比”“间距被压缩”；一旦出现会快速失去该风格的专业与克制气质。

## Quality Score
- Total: 92/100
- Verdict: Pass

## Dimension Scores
- Style consistency: 19/20
- Token implementability: 14/15
- Color and contrast: 14/15
- Typography hierarchy: 9/10
- Component completeness: 9/10
- Layout and spacing: 9/10
- Anti-drift constraints: 9/10
- Variation control: 9/10

## Deductions
- `-2`：个别按钮 active 态为推断值（`~translateY(1px)`），非源码显式定义。
- `-2`：暖色变体提供了区间约束，但未给唯一十六进制固定值。
- `-4`：局部背景效果（mesh 叠层）在跨项目复刻时可能需二次拟合。

## Key Risks
- 多页面迁移时若直接删去中性灰层级，会导致信息层次塌陷。
- 若将主按钮改成彩色品牌色，转化焦点会从“强对比”变为“强色相”，风格明显偏移。
- 若过度增加阴影和动画，整体气质会从“专业克制”偏向“营销炫技”。
