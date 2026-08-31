## Style Snapshot
- Overall style: 深色科技感 SaaS 界面，采用低饱和中性色基底 + 紫色品牌强调，结合轻玻璃拟态与细网格纹理。
- Tone keywords: 冷静、专业、克制、未来感、可观测、企业级。
- Suitable product types: 客服/工单系统、控制台后台、SaaS 管理平台、数据监控产品、企业服务官网。

## Design Tokens
### Colors
- `color.brand.primary`: `#6867f7`
- `color.brand.primary.hover`: `#7b7af9`
- `color.brand.glow`: `rgba(104,103,247,0.22~0.32)`
- `color.surface.base.dark`: `#050506`
- `color.surface.deep.dark`: `#020203`
- `color.surface.elevated.dark`: `#0a0a0c`
- `color.surface.card.dark`: `rgba(255,255,255,0.03~0.08)`
- `color.text.primary.dark`: `#edecef`
- `color.text.secondary.dark`: `rgba(255,255,255,0.6)`
- `color.border.default.dark`: `rgba(255,255,255,0.06)`
- `color.border.hover.dark`: `rgba(255,255,255,0.1)`
- `color.border.accent.dark`: `rgba(104,103,247,0.32~0.36)`
- `color.semantic.success`: `#86efac` + `rgba(110,231,183,0.14)` background
- `color.semantic.error`: `#fda4a4` + `rgba(248,113,113,0.14)` background
- `color.surface.base.light`: `#f5f8ff`
- `color.text.primary.light`: `#11162a`

### Typography
- `font.family.base`: `"Inter", "Geist Sans", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`
- `font.weight.regular`: `400`
- `font.weight.medium`: `500`
- `font.weight.semibold`: `600`
- `font.weight.bold`: `700`
- `font.size.hero`: `clamp(2.2rem, 5vw, 3.5rem)`
- `font.size.sectionTitle`: `clamp(1.8rem, 3.7vw, 3rem)`
- `font.size.body`: `1rem`
- `font.size.ui`: `0.82rem~0.9rem`
- `font.size.caption`: `0.72rem~0.78rem`
- `lineHeight.base`: `1.6`
- `lineHeight.hero`: `1.3`

### Backgrounds
- `bg.page.dark`: `linear-gradient(180deg, #0d1023 0%, #06070e 36%, #020203 100%)`
- `bg.page.light`: `radial-gradient(130% 130% at 50% 92%, #ffffff 46%, #aeb6ff 100%)`
- `bg.noise.overlay`: 极低不透明度噪点纹理（约 `0.015~0.03`）
- `bg.grid.overlay`: 64px 网格线，低对比（约 `0.02~0.03`）
- `bg.card.glass.dark`: `linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`
- `bg.input.tint.dark`: `rgba(104,103,247,0.12)`（主色 + 透明度）
- `bg.scrim.hero.dark`: 深色纵向蒙层 + 紫色径向光晕叠加

### Shadows
- `shadow.none`: `none`
- `shadow.focus.ring`: `0 0 0 1px rgba(104,103,247,0.35), 0 0 0 4px rgba(104,103,247,0.16~0.2)`
- `shadow.card.base`: `0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)`
- `shadow.card.hover`: `0 10px 24px rgba(0,0,0,0.28)`
- `shadow.button.primary`: `0 10px 20px rgba(104,103,247,0.28)`
- `shadow.button.primary.hover`: `0 14px 28px rgba(104,103,247,0.34)`

### Borders
- `border.width.default`: `1px`
- `border.color.default.dark`: `rgba(255,255,255,0.06)`
- `border.color.strong.dark`: `rgba(255,255,255,0.1~0.16)`
- `border.color.brand`: `rgba(104,103,247,0.34~0.72)`
- `border.divider.section`: `1px solid var(--border-default)`
- `border.state.error`: `rgba(248,113,113,0.52~0.72)`
- `border.state.success`: `rgba(110,231,183,0.45~0.5)`

### Radii
- `radius.xs`: `8px`
- `radius.sm`: `10px`
- `radius.md`: `12px`
- `radius.lg`: `16px`
- `radius.xl`: `18px~20px`
- `radius.pill`: `999px`

### Buttons
- `button.height.sm`: `34px`
- `button.height.md`: `42px`
- `button.height.lg`: `44px`
- `button.variant.primary.bg`: `var(--accent)`
- `button.variant.primary.hover`: `var(--accent-bright)`
- `button.variant.ghost.bg`: `rgba(255,255,255,0.05)`
- `button.variant.ghost.hover`: `rgba(255,255,255,0.09)`
- `button.focus.ring`: 深色底 + 品牌色外环
- `button.transition`: `240ms var(--ease-expo)`（interaction feedback <= 240ms）

### Layout
- `layout.container.max`: `min(1200px, calc(100% - 48px))`
- `layout.container.mobile`: `min(100%, calc(100% - 30px))`
- `layout.header.offset`: `clamp(74px, 8vw, 88px)`
- `layout.grid.heroMetrics.desktop`: `4 columns`
- `layout.grid.heroMetrics.mobile`: `2 columns`
- `layout.section.paddingY`: `~72px 0`（按区块类型浮动）
- `layout.gap.base`: `8px / 10px / 12px / 14px / 20px / 30px`

## Style Principles
1. **深底高层次**：以近黑背景建立稳定基底，用半透明面和边框层次区分信息优先级。
2. **单一品牌强调**：全局仅用一组紫色品牌色承担主 CTA、关键图标、焦点反馈与数据强调。
3. **对比克制但可读**：正文使用高亮灰白，次级信息降到约 60% 透明度，避免纯白泛滥。
4. **玻璃感不喧宾夺主**：卡片使用轻微渐变与模糊，强调“质感”而非重度拟态。
5. **组件几何统一**：普遍使用 10~16px 圆角，重要容器提升到 18~20px，标签/胶囊统一 999px。
6. **交互反馈短促明确**：hover/focus 以边框、阴影、轻位移表达，时长集中在 200~240ms。
7. **背景细节低占比**：噪点和网格仅做氛围，不参与信息层级，透明度始终保持低值。
8. **大标题渐变，正文纯色**：仅核心标题用品牌渐变，正文与表单文本保持纯色增强阅读稳定性。
9. **暗亮双主题同 DNA**：light 模式保留同一紫色品牌与层级逻辑，仅翻转底色和边框对比。

## Prompt Pack
### Foundation Prompt
构建一个企业级 SaaS 页面视觉系统：深色背景（接近 `#050506`）+ 单一紫色品牌强调（`#6867f7`），使用低对比噪点和细网格背景。容器宽度采用 `min(1200px, calc(100% - 48px))`，区块以卡片化组织，卡片使用 `1px` 半透明白边框与轻玻璃渐变背景。文本层级为：主文本高亮灰白、次级文本约 60% 透明度。主按钮使用品牌色实体填充，hover 提亮到 `#7b7af9`，focus 使用品牌双层外环。交互时长限制在 `200~240ms`，仅使用 `opacity/transform/box-shadow/border-color` 变化。  
Avoid: 不要多品牌色、不要高饱和彩虹渐变、不要厚重拟态阴影、不要过亮纯白大面积背景、不要无边框输入框。

### Component Prompt
生成同风格组件集（按钮/输入框/卡片/Toast）：  
- 按钮：`sm/md/lg` 三档高度（34/42/44），primary 为紫色实底，ghost 为半透明暗底。  
- 输入框：暗色面板 + 主色透明底（如 `rgba(104,103,247,0.12)`），focus 态边框和外环加强。  
- 卡片：圆角 `16~20px`、半透明渐变背景、`1px` 低对比边框、中等阴影。  
- Toast：语义色化，error 用红色透明底+红字，success 用绿色透明底+绿字，图标跟随文本色。  
- 分割线统一 `1px solid rgba(255,255,255,0.06)`。  
Avoid: 不要把语义提示做成统一白字黑底；不要去掉 focus 可视态；不要把输入框做成高亮纯白。

### Variation Prompt
在保持同一品牌 DNA 下生成“更高密度控制台变体”：保留 `#6867f7` 主品牌色与深色基底不变，将卡片内边距缩小 `8~12%`，文本字号整体下调一个层级（约 `0.05~0.1rem`），网格和分割线对比略增强（边框 alpha +0.02）。按钮形态与焦点规则不变，输入框仍使用品牌色透明底。  
Avoid: 不要改变品牌色相；不要改成扁平无层次；不要把高密度变体做成拥挤（需维持 8/10/12 间距节奏）。

## Reuse Notes
- What must stay unchanged:
  - 单一品牌主色（`#6867f7`）及其 hover/focus 体系
  - 深色基底 + 半透明卡片 + 细边框的层级结构
  - 10~20px 圆角尺度与 1px 边框体系
  - 短时长交互反馈（200~240ms）
- What can be flexed:
  - 卡片透明度（`0.03~0.12`）与阴影强度
  - 容器最大宽度（1120~1280 区间）
  - 标题渐变角度与覆盖范围
  - light 模式下的中性灰蓝底值
- Risk of style drift:
  - 引入第二强调色会削弱品牌识别
  - 过高透明度或过多 glow 会显得“廉价霓虹”
  - 把输入、按钮改成纯亮色会破坏暗色层次

## Quality Score
- Total: 90/100
- Verdict: Pass

## Dimension Scores
- Style consistency: 18/20
- Token implementability: 14/15
- Color and contrast: 14/15
- Typography hierarchy: 9/10
- Component completeness: 9/10
- Layout and spacing: 9/10
- Anti-drift constraints: 9/10
- Variation control: 8/10

## Deductions
- Variation prompt 仅提供一个方向，场景覆盖仍可扩展：-2
- 部分 token 以区间表示，非单值常量：-3
- 未附组件级代码片段映射：-5

## Key Risks
- 后续实现若忽略焦点态边框/外环，交互可用性会明显下降。
- 若将卡片透明度继续提高，文本对比可能不足。

## Fix First (Top 3)
1. 为按钮、输入框、Toast 增加“token -> CSS 示例”对照表。
2. 补充第二个 variation（如暖色版或浅色高密版）并重新评分。
3. 将区间 token 收敛为“默认值 + 可调范围”双列规范。
