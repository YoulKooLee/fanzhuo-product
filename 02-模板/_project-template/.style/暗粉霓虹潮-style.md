# Drift Landing Page — 视觉风格提取

来源：`hue-main/examples/drift/landing-page.html`（默认 `data-theme="dark"`，含明暗双主题）。

## 风格快照 / Style Snapshot

- **整体风格 / Overall style:** 近黑底、带微弱品红倾向的中性色阶；主强调为热粉洋红（`#FF3A8C` 系），辅以电黄（`electric-*`）作数据/徽章点缀。首屏为「手工叠层」：径向洋红光晕 + 斜向线性暗底 + 巨型三行展示字 + 强暗角 + 底部磨砂玻璃信息条，整体偏街头潮牌与高端暗色 SaaS 的混合气质。
- **语气关键词 / Tone keywords:** 锐利、霓虹感、低多边形式排版张力、小写/全大写混排、等宽字做「系统感」标签、 editorial 式留白与高密度信息块交替。
- **适配产品类型 / Suitable product types:** 潮流电商、寄售/拍卖、创作者工具、暗色品牌官网、强调「时间戳/账本/数据」的金融科技感落地页。

## 设计 Tokens / Design Tokens

### 颜色 / Colors

- `color.neutral.50` → `#F7F5F8`（骨白，文案与 hero composition 亮色字）
- `color.neutral.200` → `#D8D3DE`（次级正文 `text2` 暗色主题）
- `color.neutral.900` → `#07040B`（页面底 `bg` 暗色主题）
- `color.neutral.950` → `#030105`（近纯黑、渐变末端）
- `color.brand.primary`（暗色主题强调）→ `#FF3A8C`（`--brand-400`，`--accent`）
- `color.brand.primary.hover`（暗色）→ `#FF6BA7`（`--brand-300`，`--accent-hover`）
- `color.brand.primary`（浅色主题）→ `#E41874`（`--brand-500`）
- `color.semantic.positive` / 数据高亮 → `#E5D300`（`--electric-500`，如涨幅文案）
- `color.semantic.highlight-soft` → `#F8F06A`（`--electric-300`，如卡片 `new` 徽章）
- `color.surface.base`（暗）→ `var(--neutral-900)`；`color.surface.elevated.1` → `#141118`；`color.surface.elevated.2` → `#221F26`
- `color.border.default`（暗）→ `#221F26`；`color.border.visible` → `#35303A`
- `color.text.primary`（暗）→ `#F7F5F8`；`color.text.secondary` → `#D8D3DE`；`color.text.tertiary` → `#B2ABBC`；`color.text.muted` → `#78707E`
- `color.glass.scrim` → `rgba(7, 4, 11, 0.55)`（hero 底部内容区背景）
- `color.composition.pink-hot` → `#FF3A8C`（中间展示词 `found.`）
- `color.composition.bone` → `#F7F5F8`（`made.` / `sold.`）

### 字体 / Typography

- `font.family.display` → `Space Grotesk`，回退 `-apple-system, system-ui, sans-serif`
- `font.family.body` → `Inter`
- `font.family.mono` → `JetBrains Mono`
- `font.size.body` → `15px`，行高 `1.55`，抗锯齿 `-webkit-font-smoothing: antialiased`
- `font.size.nav` → `13px` / 字重 `500`
- `font.size.display.hero` → `clamp(56px, 9.5vw, 136px)`，行高 `~0.9`，字距 `-0.05em` ~ `-0.055em`，composition 为 **全大写**
- `font.size.display.section` → `clamp(36px, 5vw, 64px)`（intro 标题）、`clamp(28px, 3.6vw, 44px)`（feature 标题）、`clamp(48px, 7vw, 96px)`（底部 CTA 标题）；多数字幕式标题为 **小写**
- `font.size.mono.label` → `9px` ~ `11px`，大写 + `letter-spacing: 0.08em` ~ `0.18em`（眉标、元信息、页脚细字）
- `font.weight.display` → `700`；正文 Inter `400` / `500`

### 背景 / Backgrounds

- `background.hero.layer1`：左上角椭圆径向（品红半透明 `#FF3A8C` → 深品红 `#B3105A` → 深 `#1F0210` / `#07040B`）叠加 `135deg` 线性（`#140108` → `#07040B` → `#030105`）
- `background.hero.glow`：`::after` 约 `520×520px` 圆斑，`rgba(255,58,140,0.35)` 心部，`filter: blur(40px)`
- `background.hero.vignette`：椭圆径向，中心透明向外 `#030105` 加深（压暗边缘、框住构图）
- `background.section.cta`：居中椭圆径向淡粉光 + `blur(40px)` 作氛围底
- `background.surface.glass`：`backdrop-filter: blur(22px) saturate(140%)` + 半透明深底（见 `color.glass.scrim`）
- `background.feature-visual`：`color-mix(in srgb, var(--surface1) 50%, transparent)` 叠 `1px` 边框
- 浅色主题：径向与线性整体漂向 `#F7F5F8` / `#FFEEF5`，光晕透明度降低，暗角改为淡紫灰（`rgba(216,211,222,...)`）

### 阴影 / Shadows

- `shadow.brand-mark` → `0 0 18px rgba(255, 58, 140, 0.55)`（Logo 方块）
- `shadow.text.composition.bone` → 深投影 `0 6px 40px rgba(7,4,11,0.75)` + 细白边 `0 0 1px rgba(255,255,255,0.25)`
- `shadow.text.composition.pink` → 多层外发光：`0 0 60px`、`0 0 120px`、`0 8px 40px` 等 `rgba(255,58,140, …)`（中间词霓虹感）
- `shadow.panel.glass` → `0 30px 80px rgba(3,1,5,0.55)` + 内高光 `inset 0 1px 0 rgba(255,255,255,0.06)`
- `shadow.theme-bar` → `0 10px 40px rgba(0,0,0,0.5)`
- `shadow.eyebrow-dot` → `0 0 10px var(--brand-400)`
- 主题切换：`body` 上 `background` / `color` `300ms ease`

### 边框 / Borders

- `border.width.default` → `1px`；卡片/分割普遍 `solid`，颜色取 `var(--border)` 或 `var(--border-vis)`
- `border.glass` → `1px solid rgba(255,255,255,0.06)`（暗色 hero 磨砂条）
- `border.accent-subtle` → `1px solid rgba(255,58,140,0.35)`（眉标、验证标签等）
- 列表装饰：行前 `10×1px` 横线，色为 `var(--brand-400)`

### 圆角 / Radii

- `radius.xs` → `2px`（`--r-element`，小徽章）
- `radius.sm` → `4px`（`--r-control`）
- `radius.md` → `6px`（`--r-component`，产品卡）
- `radius.lg` → `10px`（`--r-container`，大面板/磨砂条）
- `radius.pill` → `999px`（按钮、眉标、主题切换条）
- **几何对立：** Logo 色块与卖家头像为 **`border-radius: 0`**（锐利方块），与大量圆角控件形成对比

### 按钮 / Buttons

- 基类 `.btn`：`padding: 11px 22px`，`border-radius: var(--r-pill)`，`font-size: 13px`，`font-weight: 500`，`transition: all 220ms ease`，文案 **小写**
- `button.primary`：背景 `var(--brand-400)`，字色 `var(--neutral-950)`（暗主题）；`hover` 背景 `var(--brand-300)`，`transform: translateY(-1px)`（轻微上浮）
- `button.ghost`：透明底、字色 `text2`、`border-color: border-vis`；`hover` 字色抬至 `text1`、`border-color` 用 `text3`
- 浅色主题：`btn-primary` 字色改为 `#fff`，`hover` 用 `brand-600`
- **说明：** 源 HTML 未单独写出 `:focus-visible` 轮廓样式，复用时建议补全可访问性焦点环（与品牌粉或白半透明一致）

### 布局 / Layout

- `layout.container.maxWidth` → `1200px`，水平内边距 `var(--sp-2xl)`（`48px`）
- `space.scale` → `4, 8, 16, 24, 32, 48, 64, 96, 128, 160px`（`--sp-xs` … `--sp-6xl`）
- `layout.header.height` → `76px`，顶栏绝对定位叠在 hero 上
- `layout.hero.minHeight` → `100vh`；主视觉三词绝对层垂直居中区域，`bottom` 预留给底部内容
- `layout.hero.composition`：三行 `translateX` 分别为约 `-16vw`、`-2vw`、`+12vw`（大屏阶梯错位）；`<960px` 时改为正向递增偏移以适配窄屏
- `layout.feature.grid` → `1fr 1fr`，列间距 `96px`（`sp-4xl`）；窄屏单列
- `layout.hero-content` → `grid`：`1fr auto`，最大宽约 `860px`，底对齐视口内容区

## 风格原则 / Style Principles

1. **暗色为画布、品红为聚光灯：** 大面积近黑中性底，用可控的径向洋红光斑引导视线，而非整屏平铺高饱和。
2. **字体分工极清晰：** `Space Grotesk` 承担「海报级标题与品牌」，`Inter` 承担阅读段落，`JetBrains Mono` 承担「时间戳、眉标、数据、页脚条款感」。
3. **大小写即角色：** 巨型 composition 用全大写制造冲击；导航与章节标题用小写，形成「秀场 vs 日常界面」对比。
4. **锐利与圆润并存：** 关键品牌符号用零圆角方块；交互控件与小卡用中小圆角；主按钮用药丸形，制造产品个性。
5. **层级靠光而非仅靠灰阶：** 中间展示词用多层粉色外发光；两侧词用深投影 + 细亮描边式 `text-shadow`，在暗底上保持浮雕感。
6. **玻璃磨砂承载操作：** 主文案与 CTA 放在半透明深_scrim + 模糊 + 内高光条上，保证可读又不抢主视觉合成层。
7. **强暗角即构图框：** vignette 把观众目光锁在中央斜向排版区域，属于整体美学的一部分，不是可有可无的装饰。
8. **双主题同一 DNA：** 浅色模式降低光晕与阴影对比、强调色略收为 `#E41874` 系，但粉黄数据点缀与三词结构不变。
9. **间距节奏偏「杂志」：** 大段垂直留白（`sp-5xl` 等）分隔区块；组件内用 `sm`/`md` 级密排数据。
10. **微动效克制：** 按钮与卡片以 `200ms`~`220ms` 的 `ease` 与 `translateY` 小位移为主，无夸张弹跳。

## 提示词包

### 基础提示词

**审美方向**  
生成一页暗色主导的潮流寄售/电商落地页。首屏为全视高 hero：左上角有柔和但可辨的品红径向光晕，叠加深紫黑线性渐变，中央三行超大 `Space Grotesk` 全大写单词阶梯横向错位（中间一词为热粉 `#FF3A8C` 并带强外发光，两侧为骨白 `#F7F5F8` 配深投影）。整屏加椭圆暗角压边。底部一块圆角约 `10px` 的磨砂玻璃横条（深半透明底、`blur(22px)`、细白半透明描边、下沉投影），内嵌小写副文案与双按钮。整体气质：冷静黑底 + 霓虹强调 + 编辑排版 + 一点金融数据感。

**Token 约束**  
背景主色链使用 `#07040B`、`#030105`、`#140108` 与少量 `#1F0210`；中性文字 `#F7F5F8` / `#D8D3DE` / `#B2ABBC` / `#78707E` 四级层级。品牌主色固定为 `#FF3A8C`，悬停亮一级至 `#FF6BA7`。数据正向点缀使用 `#E5D300` 或 `#F8F06A`。字体组合固定为标题 `Space Grotesk` 700、正文 `Inter` 15px 行高 1.55、标签与数字 `JetBrains Mono` 9–11px、大写且字距 0.08em–0.18em。圆角体系：`2px` / `4px` / `6px` / `10px` / 全圆药丸；品牌标记使用零圆角方块并可加粉色光晕投影。

**布局约束**  
主容器最大宽度 `1200px`，左右内边距 `48px`。首屏 `min-height: 100vh`，顶栏高度约 `76px` 浮于内容之上。功能区块采用双列 `1fr 1fr`、列间距约 `96px`，移动端改为单列。Hero 内主文案块最大宽度约 `860px`，采用两列网格：左文案右纵向按钮组。竖向区块之间使用 `96px`–`128px` 级大间距分段。

**交互约束**  
主按钮药丸形，悬停时背景变浅粉洋红并上移 `1px`，过渡约 `220ms ease`。幽灵按钮悬停时提升字色与边框可见度。产品卡悬停轻微上移 `2px`。主题切换为底部固定药丸分段控件，激活项使用更深表面底色。页面级背景与字色切换使用 `300ms ease`。

**避免项**  
避免整屏扁平纯 `#000` 无渐变与无光晕；避免去掉暗角导致构图涣散；避免用圆角处理品牌主方块标记；避免把中间展示词改为无发光的实心粉字（会失去霓虹记忆点）；避免正文使用展示字体通篇排版；避免高饱和粉大面积铺底取代黑底叙事；避免在 hero 区使用浅色大面卡片遮挡三词构图主体。

### 组件提示词

- **顶栏：** 透明底，`Space Grotesk` 小写品牌名 + 左侧 `14px` 零圆角洋红方块（带 `0 0 18px` 粉色光晕），右侧小写导航 `Inter` 13px 500 字重、次级灰字，最右主按钮药丸。
- **主按钮：** 填充 `#FF3A8C`，字色近黑 `#030105`（暗主题），内边距约 `11px 22px`，全小写文案。
- **幽灵按钮：** 透明、`1px` 可见边框、灰字，悬停字色变白、边框略亮。
- **眉标 pill：** `JetBrains Mono` 10px 全大写、粉细边框、极低透明粉底，左侧 `6px` 圆点带粉光晕。
- **功能视觉容器：** `10px` 圆角、`1px` 默认边框、半透明 `surface1` 混合底，内嵌 2×2 产品卡栅，`6px` 圆角卡，卡面用洋红/深紫/骨白等线性渐变区分款型。
- **数据图表块：** 折线主色 `#FF3A8C`，面积渐变同色相透明衰减；涨幅文字用 `#E5D300`。
- **页脚：** 上边框分割，`Space Grotesk` 品牌重复 + `Inter` 13px 灰色 tagline，`JetBrains Mono` 10px 全大写底栏元信息。

### 变体提示词

- **更亮：** 保留粉强调与字体系统，将底改为 `#F7F5F8` 系，光晕透明度减半，暗角改为浅紫灰，`text-shadow` 对比减弱，主按钮改为 `#E41874` 填充白字。
- **更暗更电影感：** 缩小径向光斑半径与透明度，暗角 `opacity` 提高，`text-shadow` 加长扩散，玻璃区背景不透明略升。
- **更密：** 垂直 `sp-5xl` 改为 `sp-4xl`，双列间距由 `96px` 改为 `64px`，intro/feature 正文字号维持 15–16px 不变以免拥挤。
- **更暖：** 在线性渐变端点与中性灰中略增红橙（保持品牌粉不变），骨白略偏奶油。
- **更冷：** 中性阶往青紫偏移（仍保持暗底），品牌粉略向品红蓝侧偏移一档，减少黄色数据点缀使用频率。

## 复用说明

- **必须保持不变：** 三词 hero 构图逻辑（错位 + 中间词唯一霓虹粉处理）、暗底 + 左上角品红光源 + 强暗角的三层关系、`Space Grotesk` / `Inter` / `JetBrains Mono` 三角分工、主色 `#FF3A8C` 与近黑 `#07040B` / `#030105` 的对比结构、磨砂玻璃内容条与内高光细线语言。
- **可弹性调整：** 具体文案、feature 区块数量、产品卡配色渐变、`clamp`  viewport 断点、双列间距、电黄点缀比例、主题切换组件是否展示。
- **风格跑偏风险：** 若去掉 `JetBrains Mono` 标签层会削弱「时间戳/账本」气质；若把圆角统一为极大圆角会失去锐利方块对比；若 hero 不用多层 `text-shadow` / 光晕则易沦为普通深色模板页。

---

## 质量评分 / Quality Score

- **总分**：88/100
- **结论**：通过（源文件为自包含 CSS，Tokens 与交互规则可近乎直接落地；仅焦点态需自行补全。）

## 分项得分 / Dimension Scores

- 风格一致性：18/20
- Token 可执行性：14/15
- 色彩与对比：14/15
- 排版层级：9/10
- 组件完整度：8/10
- 布局与间距：9/10
- 防跑偏约束：9/10
- 变体控制力：7/10

## 扣分说明 / Deductions

- 源样式未定义 `:focus-visible` 等焦点环：组件完整度 −2。
- 变体提示词为方向性描述，未逐 token 数值化到每个断点：变体控制力 −3。

## 关键风险 / Key Risks

- 直接生成时若忽略 `clamp` 与 `translateX`  vw 规则，小屏可能出现三词重叠或裁切。
- 高斯模糊与大面积半透明在低端设备上可能影响滚动性能，需酌情降级。
- 霓虹 `text-shadow` 层数多，导出到设计工具时易与实现不一致，需与设计对齐验收。

## 优先修订（三项）

1. 为 `.btn`、链接与主题按钮补充统一的 `:focus-visible` outline 或 box-shadow（与 `#FF3A8C` 或白半透明协调）。
2. 在设计交付物中明确 `<960px`  composition 偏移规则，避免响应式回归默认堆叠过正。
3. 若需 WCAG 更高对比档，校验 `#D8D3DE` 小字在 `#07040B` 上的对比度并按字号分级加深 `text2`/`text3`。
