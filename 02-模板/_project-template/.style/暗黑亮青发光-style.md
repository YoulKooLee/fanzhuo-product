## 风格快照 / Style Snapshot

- **整体风格 / Overall style**：深色「太空 slate」界面，主表面为 `#1E293B` / `#0F172A` 渐变与半透明层，正文浅灰蓝 `#E2E8F0`，强调色为亮青 `#22D3EE`（含外发光式投影）。玻璃拟态（`backdrop-blur`）+ 极低不透明度白边（`border-white/5`）构成层次。字体为 **Inter**（Google Fonts，字重 400–700），与 Tailwind 工具类混排。
- **语气关键词 / Tone keywords**：冷静、可信、订阅制产品感、微光层次、克制高光。
- **适配产品类型 / Suitable product types**：会员中心、订阅升级、SaaS 个人中心、金融科技轻量端、工具类 App 内嵌 H5。

## 设计 Tokens / Design Tokens

### 颜色 / Colors

- `color.surface.page`：`#0B0F19`（`body` 背景）
- `color.text.primary`：`#E2E8F0`（主正文）
- `color.text.on-emphasis`：`#FFFFFF`（主卡片大标题区）
- `color.surface.card.hero`：渐变 `from-[#1E293B]` → `to-[#0F172A]`（主会员卡）
- `color.surface.card.secondary`：`bg-[#1E293B]/50` + `backdrop-blur-sm`（权益列表外层）
- `color.surface.elevated.nav`：`bg-[#1E293B]/90` + `backdrop-blur-xl`（底栏胶囊）
- `color.brand.primary`：`#22D3EE`（主按钮、选中指示点、图标强调、VIP 字条背景）
- `color.brand.primary-foreground`：`#083344`（主按钮与 VIP 字条上的文字）
- `color.decor.glow`：`#22D3EE` @ ~10% 不透明 + `blur-2xl`（角部氛围光斑）
- `color.icon.circle`：`#1E293B`（顶栏圆形按钮底）
- `color.border.subtle`：`white` @ 5%（`border-white/5` 为主）
- `color.border.icon-halo`：`cyan-500/10`、`teal-500/10`（权益行图标容器细边）
- `color.icon.accent.dual`：`cyan-950/40` 与 `teal-950/40` 底 + 对应色系细边（列表图标区交替）

### 字体 / Typography

- `font.family.ui`：`Inter`，回退 `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- `font.smoothing`：`-webkit-font-smoothing: antialiased`
- `font.size.status`：~`15px`，`font-semibold`，`tracking-wide`，`text-white`（顶栏时间）
- `font.size.cta`：`16px`，`font-bold`（主行动按钮）
- `font.size.badge`：`10px`，`font-bold`（VIP 标签）
- `font.weight.display`：`font-bold` / `font-semibold` 用于标题与价格级信息
- 行高：Tailwind 默认继承 `line-height: 1.5`（`html`），卡片内描述可用 `text-sm` 级紧凑节奏

### 背景 / Backgrounds

- 页级：纯色深 `#0B0F19`，`min-h-screen`，`overflow-x-hidden`
- 主卡：`bg-gradient-to-br` 深蓝灰渐变 + 角部装饰「软光斑」（绝对定位圆 + 高模糊 + 品牌色低透明）
- 次级模块：半透明 slate + 轻模糊，形成浮在页底之上的层
- 底栏：高不透明度 slate + 强模糊，模拟「毛玻璃 dock」

### 阴影 / Shadows

- `shadow.card.hero`：`shadow-2xl`（主会员卡）
- `shadow.card.section`：`shadow-xl`（部分次级容器）
- `shadow.cta`：`0 8px 20px rgba(34, 211, 238, 0.2)`（主按钮品牌色弥散）
- `shadow.fab`：`0 12px 24px rgba(34, 211, 238, 0.3)`（底栏中央大圆按钮）
- `shadow.dock`：`0 8px 32px rgba(0, 0, 0, 0.4)`（底栏胶囊整体）
- 小控件：`shadow-sm`（顶栏圆钮等）

### 边框 / Borders

- 默认分割与容器：`1px`，`border-white/5` 为主语义
- 图标方块：`border` + `border-white/10` 或 `cyan-500/10` / `teal-500/10`
- 底栏中央 FAB：`border-[5px]` `border-[#1E293B]`（与页背景形成「嵌入」感）
- 底栏内竖分割：`bg-white/10`，宽 `1px`，高约 `18px`

### 圆角 / Radii

- `radius.screen-card`：`24px`（`rounded-[24px]`，主卡与主要块级容器）
- `radius.cta`：`18px`（主按钮 `rounded-[18px]`）
- `radius.dock`：`40px`（底栏容器 `rounded-[40px]`）
- `radius.chip`：`rounded-md`（VIP 小标签）
- `radius.icon-tile`：`rounded-2xl`（`1rem` 级权益图标底）
- `radius.circular`：`rounded-full`（顶栏按钮、底栏 FAB、选中点）

### 按钮 / Buttons

- **主 CTA（全宽）**：`bg-[#22D3EE]`，`text-[#083344]`，`py-4`，`rounded-[18px]`，`text-[16px]`，`font-bold`，品牌色弥散投影，`active:scale-95`，`transition-transform`
- **顶栏图标按钮**：`w-10 h-10`，`bg-[#1E293B]`，`rounded-full`，`shadow-sm`，内容居中
- **底栏中央 FAB**：`72×72`，`bg-[#22D3EE]`，`rounded-full`，更强青辉投影，`border-[5px] border-[#1E293B]`，`z-10`
- **底栏文字项**：纵向 `flex-col`，`gap-1.5`，当前项顶部有 `w-1.5 h-1.5` 青点 `absolute -top-1`
- **聚焦 / 键盘**：源 HTML未显式 `ring`；实现时建议：`focus-visible:outline-none` + `focus-visible:ring-2 ring-[#22D3EE]/50`

### 布局 / Layout

- **页边距**：横向 `px-5`（约 `20px`），顶栏 `pt-4 pb-2`
- **主内容宽度**：`w-full`，块级卡片全宽铺满内容区
- **底栏**：`fixed bottom-8`，水平 `px-5`，内部 `max-w-[400px]` 居中，`h-[76px]`，`px-10`，三栏或类似分布（含中央突出 FAB）
- **垂直节奏**：卡片内 `p-6`；区块间用全宽卡片自然分隔；主卡内顶部区 `mb-8` 级留白（相对）
- **Z 序**：装饰光斑较低，主信息 `relative z-10`；底栏 `z-50`

### 同系列其他页速览（会员中心 1–3）

| 文件 | 页底 | 主强调 | 气质 |
|------|------|--------|------|
| 会员中心1 | `#F4F5F7` / 字 `#1A1A1A` | `#4C75F2` 渐变卡 | 浅色工具、多色权益图标 |
| 会员中心2 | `#F9F6F0` / 字 `#3E2723` | `#D4AF37` 金 + 深棕渐变卡 | 暖色尊贵、纸感卡片 |
| 会员中心3 | `#0A0A0A` / 字 `#F0F0F0` | `#D9FF00` 荧光黄 | 极简高对比、近潮流 UI |

## 风格原则 / Style Principles

1. **冷色底 + 单点色相**：大面积无彩深灰蓝，仅用青色家族做「可点击与身份」锚点，避免彩虹化。
2. **渐变只服务主身份卡**：主会员卡用对角渐变抬升仪式感，次级列表用半透明+模糊，避免处处渐变。
3. **边界极轻**：`white/5`～`10%` 描边统一全页，形成「气密舱」式界面而非硬分割表格。
4. **圆角阶梯**：`24px` 块、`18px` 按钮、`40px` dock，尺度分明，暗示组件层级。
5. **投影叙事**：环境暗阴影托底栏与主卡，品牌色投影只给主 CTA 与 FAB，控制「发光」数量。
6. **Inter + 半粗体**：标题与价格信息偏粗，说明性辅文降一级字重或字号，形成垂直扫描路径。
7. **图标容器系统化**：`12×12`（`w-12 h-12`）圆角方块 + 低饱和底色 + 细色边，列表行左对齐稳定栅格。
8. **交互偏「实体按压」**：`active:scale-95` 提供触感反馈，动效短、不抢戏。
9. **底栏「岛屿」布局**：浮于内容之上、左右留白、最大宽度约束，适配手机视觉重心。
10. **与会员中心3 的差异原则**：不用荧光黄作主色；青更偏「可信科技」而非「潮牌警示」。

## 提示词包

### 基础提示词

**审美方向**  
生成一页移动端会员中心 H5：深太空蓝灰背景（`#0B0F19`），主卡片为从 `#1E293B` 到 `#0F172A` 的柔和对角渐变，配以极淡青色角部光晕（高模糊、低透明度）。整体气质冷静、高级、偏 SaaS，而非游戏或霓虹派对。文字以浅灰蓝为主，关键数字与主按钮使用亮青 `#22D3EE`，按钮上文字用深蓝绿 `#083344` 保证对比。

**Token 约束**  
- 页面：`color.surface.page = #0B0F19`，正文 `color.text.primary = #E2E8F0`。  
- 主卡：`color.surface.card.hero` 使用上述渐变；角部装饰圆 `~128px`，`blur` 大，`#22D3EE` 约 10% 透明。  
- 次级面板：`#1E293B` 50% 不透明 + `backdrop-blur-sm`，边 `border-white/5`。  
- 品牌：`color.brand.primary = #22D3EE`，主按钮与底栏 FAB 同色；投影 `0 8px 20px rgba(34,211,238,0.2)`（按钮）与 `0 12px 24px rgba(34,211,238,0.3)`（FAB）。  
- 字体：全页 **Inter**，标题 `font-bold`/`font-semibold`，主 CTA `16px` 粗体。  
- 圆角：块 `24px`，按钮 `18px`，底栏容器 `40px`，FAB 正圆。

**布局约束**  
- 全宽内容区，水平内边距约 `20px`（`px-5`）；主垂直堆叠若干全宽卡片。  
- 顶栏：左时间右操作，圆形容器 `40×40`。  
- 底栏：`fixed`，距底约 `32px`，内部 `max-width: 400px` 居中，`height ~76px`，左右内边距较大；中央 FAB `72px` 突出，与栏体 `5px` 深色描边。  
- 权益列表：左 `48px` 图标格 + 右文案，行距舒适，卡片内边距 `24px`（`p-6`）。

**交互约束**  
- 主按钮与重要点击：`active` 时 `scale(0.95)`，带短 `transition`；悬停可轻微提亮背景或略增投影，勿大幅变色。  
- 底栏当前项以顶部小圆点（`#22D3EE`）标识。  
- 键盘聚焦需可见环（建议青半透 `ring`），源参考未写死但生产应补。

**避免项**  
- 禁止使用高饱和荧光黄绿作主色（易与「潮流黑黄」混淆，偏离本页青辉科技调性）。  
- 禁止大面积纯白背景块破坏深色沉浸。  
- 禁止每个卡片都用强渐变或强发光，导致层次flatten。  
- 禁止使用细衬线正文或装饰性过强字体替代 Inter。  
- 禁止使用粗实线深色边框分割（应用极淡白透明边替代）。

### 组件提示词

- **主会员卡**：全宽，`rounded-[24px]`，`p-6`，`text-white`，`shadow-2xl`，`border border-white/5`，内区上为标题+VIP 字条（青底深字 `10px` 粗体），下为进度或权益摘要；角部一层装饰模糊圆。  
- **权益行卡片**：容器 `rounded-[24px]`，`bg-[#1E293B]/50`，`backdrop-blur-sm`，`border-white/5`，`shadow-xl`（可选）；内部多行，每行左 `w-12 h-12` `rounded-2xl` 图标底（`cyan-950/40` 或 `teal-950/40`）+ `border` 弱色边。  
- **主 CTA 按钮**：全宽，`py-4`，`rounded-[18px]`，`bg #22D3EE`，字 `#083344`，`font-bold`，青弥散投影，`active:scale-95`。  
- **底栏导航**：胶囊 `rounded-[40px]`，半透明 slate + 强模糊，暗投影；左右 Tab + 中央 FAB；竖分割 `1px` `white/10`。

### 变体提示词

- **更亮**：页底改为 `#0F172A`，卡片渐变起点略提亮；青不变，光斑略强。  
- **更暗**：页底近 `#050810`，次级卡片改 `40%` 不透明，投影略收。  
- **更暖**：仅在光斑中混入极少量青绿向 teal，不改变主按钮色相，避免变「金棕主题」。  
- **更密**：`p-6` 改 `p-5`，卡片圆角维持 `24px` 以保识别度。

## 复用说明

- **必须保持不变**：页底 `#0B0F19`、主强调 `#22D3EE`、主按钮字色 `#083344`、块级 `24px` / 按钮 `18px` / dock `40px` 圆角阶梯、底栏岛屿式 `max-w 400px` + 中央 FAB 结构、`border-white/5` 级弱边、Inter 字体族。  
- **可弹性调整**：权益条数与文案、图标具体 SVG、主卡是否展示进度数字、顶栏是否显示真实时间、模糊强度（`sm`/`xl`）。  
- **风格跑偏风险**：改用高对比荧光accent、或整体改为浅色底、或取消模糊全改实色扁平，会失去「青辉科技会员页」识别度。

---

## 质量评分 / Quality Score

- **总分**：88/100  
- **结论**：通过（可直接用于迭代同系列页面与 AI 生成）

## 分项得分 / Dimension Scores

- 风格一致性：18/20  
- Token 可执行性：14/15  
- 色彩与对比：13/15  
- 排版层级：9/10  
- 组件完整度：8/10  
- 布局与间距：9/10  
- 防跑偏约束：9/10  
- 变体控制力：8/10  

## 扣分说明 / Deductions

- 源 HTML 为导出页，未显式写出 `focus-visible` 环样式，组件完整度略扣（实现需在提示词中补足）。  
- 部分行高与次要字号依赖 Tailwind 类推断，非内联精确值，Token 可执行性小幅扣分。  

## 关键风险 / Key Risks

- 与 **会员中心3**（黑 + `#D9FF00`）同属深色会员壳，若生成时未锁死主色，模型易混用荧光黄方案。  
- 过多 `backdrop-blur` 在低端机上可能影响性能，需准备降级为实色半透明。  

## 优先修订（三项）

1. 在实现层为所有可聚焦控件补齐统一的 `focus-visible` 环（建议 `ring-2 ring-[#22D3EE]/40`）。  
2. 将权益列表的 cyan/teal 交替规则写成设计系统条目（奇偶行或按业务分类映射），减少生成随机性。  
3. 为底栏与主卡提供无 `blur` 的降级色值（提高不透明度 5–10%）以覆盖性能敏感场景。  
