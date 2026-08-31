## 风格快照 / Style Snapshot
- 整体风格 / Overall style: 深色极简移动会员页；近乎纯黑背景叠多层炭灰卡片，酸性荧光黄绿（#D9FF00）作为唯一强品牌色，配合微弱白描边与柔和投影，整体偏「暗黑 UI + 电竞/工具类高级感」。
- 语气关键词 / Tone keywords: 克制、高对比、磨砂点缀、荧光强调、圆角胶囊、移动端手势友好。
- 适配产品类型 / Suitable product types: 会员订阅 / Pro 升级、工具类 App WebView、金融科技极简暗黑营销页、游戏化进度展示。

## 设计 Tokens / Design Tokens
### 颜色 / Colors
- `color.surface.base`: `#0A0A0A`（页面底色）
- `color.surface.card`: `#1A1A1A`（主卡片、顶栏圆形按钮、底部 Tab 容器）
- `color.surface.section`: `#121212`（次级内容区块，略浅于底、略深于主卡片时可与 `#1A` 互换层级）
- `color.brand.primary`: `#D9FF00`（CTA、图标强调、进度数字、选中 Tab、FAB）
- `color.brand.primaryMuted`: `rgba(217, 255, 0, 0.1)`（装饰光晕 blob）
- `color.text.primary`: `#FFFFFF`（标题与主要正文）
- `color.text.body`: `#F0F0F0`（body 默认文本色，可与纯白混用）
- `color.text.secondary`: Tailwind `gray-500` → `#6B7280`
- `color.text.muted`: `gray-400` `#9CA3AF` / 未选中 Tab `gray-600` `#4B5563`
- `color.text.onPrimary`: `#000000`（按钮与 VIP 徽章上的字）
- `color.border.subtle`: `rgba(255,255,255,0.05)`（卡片外框）
- `color.border.default`: `rgba(255,255,255,0.10)`（图标按钮、玻璃质感块）
- `color.divider`: `rgba(255,255,255,0.05)`（Tab 内竖线 `1×18px`）

### 字体 / Typography
- `font.family.ui`: `Inter`（Google Fonts），weights `400 / 500 / 600 / 700 / 900`，system-ui 栈回退；`-webkit-font-smoothing: antialiased`
- `font.size.badge`: `10px`，`font.black`（900）
- `font.size.tab`: `11px`，选中 `bold`，未选中 `medium`
- `font.size.caption`: `13px`，说明与列表描述，`leading-relaxed`（~1.625）
- `font.size.body`: `15px` ~ `16px`（状态栏时间、主按钮）
- `font.scale.sm`: `0.875rem` / `text-sm`
- `font.scale.lg`: `1.125rem` / `text-lg`（区块标题）
- `font.scale.xl`: `1.25rem` / `text-xl`（页标题）
- `font.scale.2xl`: `1.5rem` / `text-2xl`（卡片主标题、大号数字）
- `font.tracking.tight`: `-0.025em`（大标题）
- `font.tracking.wide`: `0.025em` ~ `0.05em`（数字与 Tab 层级）

### 背景 / Backgrounds
- 全局纯色 `#0A0A0A`，无大图底纹。
- 卡片局部装饰：`absolute` 圆形 `#D9FF00` 10% 不透明 + `blur-2xl`（~40px）制造微弱荧光氛围。
- 图标托盘：`bg-white/5` + `backdrop-blur-md`（~12px）+ `border-white/10`。
- 底部导航容器：`bg-[#1A1A1A]/95` + `backdrop-blur-xl`（~24px），悬浮玻璃条。

### 阴影 / Shadows
- `shadow.card`: Tailwind `shadow-xl` → `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- `shadow.dock`: `shadow-2xl` → `0 25px 50px -12px rgb(0 0 0 / 0.25)`
- `shadow.control`: `shadow-sm`（顶栏圆形返回按钮）
- `shadow.brandGlow.cta`: `0 8px 30px rgba(217, 255, 0, 0.2)`（主按钮）
- `shadow.brandGlow.fab`: `0 12px 24px rgba(217, 255, 0, 0.3)`（中央圆形主操作）

### 边框 / Borders
- 默认 `1px` `solid`，颜色在 `white/5` 与 `white/10` 两档切换。
- FAB 与 Tab 底槽：`border-[5px] solid #1A1A1A` 形成「嵌入 dock」的切割感。

### 圆角 / Radii
- `radius.full`: 圆形按钮（`w-10 h-10`）、进度胶囊端点、`rounded-full` 指示点。
- `radius.sm`: `rounded-md`（~6px）VIP 标签。
- `radius.lg`: `rounded-2xl`（~16px）48×48 图标容器。
- `radius.cta`: `18px` 主按钮全宽。
- `radius.card`: `24px` 所有主要内容卡片。
- `radius.dock`: `40px` 底部 Tab 外壳。

### 按钮 / Buttons
- **主行动按钮（Primary CTA）**：背景 `#D9FF00`，字色黑，`font-black`，`py-4`，全宽，`rounded-[18px]`，`text-[16px]`，投影使用品牌荧光扩散；**按下态**：`scale(0.95)`，`transition-transform` 150ms ease。
- **图标幽灵按钮**：`40×40`，`bg-[#1A1A1A]`，`rounded-full`，`border-white/10`，`shadow-sm`，图标 `text-white`，描边图标 `stroke-width` ~2.5。
- **Tab item（选中）**：图标与文案 `#D9FF00`，文案 `font-bold`，顶部 `w-1.5 h-1.5` 荧光圆点指示。
- **Tab item（未选中）**：`text-gray-600`，`font-medium`。
- **中央悬浮主按钮（FAB）**：`72×72`，`bg-[#D9FF00]`，`rounded-full`，黑描边图标 `stroke-width: 3`，外圈 `5px` `#1A1A1A` + 强荧光外发光投影。

### 布局 / Layout
- 移动端单列：`w-full`，水平内边距主导 `px-5`（状态/标题），内容区 `px-4`。
- 垂直节奏：`space-y-4`（~16px）分区；卡片内标题区 `mb-8`，列表 `space-y-6`。
- 为底部 dock 预留：`pb-[120px]`。
- **Dock**：`fixed`，`bottom-8`，水平 `px-5`，内部条 `max-w-[400px]` 居中，`h-[76px]`，`px-10`，三栏 `justify-between`；中央 FAB `-top-5` 溢出抬高。
- 进度条：`h-3`，6 段 `flex-1` `gap-1`，轨道 `bg-white/10`，首尾段 `rounded-l-full` / `rounded-r-full`。

## 风格原则 / Style Principles
1. **单一强调色定律**：除中性灰阶外，彩色只用 `#D9FF00`，避免第二品牌色破坏暗黑一致性。
2. **层级靠明度不靠炫色**：表面从 `#0A → #12 → #1A` 递增，文字用白与 gray-500/600 分工，荧光仅点在「可行动/状态」上。
3. **圆角尺度分层**：交互控件偏圆（全圆、18px），信息容器统一 24px，导航外壳 40px 强化「设备级 dock」隐喻。
4. **微弱玻璃感**：仅在图标底托与底部条使用低透明度白 + blur，不做大面积毛玻璃以免发灰。
5. **阴影叙事**：结构阴影用中性黑；营销触感靠荧光着色投影（带色相的外发光），克制用量（主按钮 + 中央 FAB）。
6. **动效极少但有力**：按下缩放反馈优先于 hover（移动场景），时长短（150ms）。
7. **图标语言**：线图标荧光描边 `stroke #D9FF00` / `stroke-width 2`；面图标可用同色填充；中心 FAB 用粗黑线对比荧光底。
8. **分隔克制**：优先 `border-white/5`，需要更强可读时用 `/10`；Tab 内竖线极淡。

## 提示词包
### 基础提示词
**审美方向**：生成移动端优先的深色会员页界面：近黑背景 `#0A0A0A`，炭灰卡片 `#1A1A1A` / `#121212`，单一酸性荧光黄绿强调色 `#D9FF00`，极细白色描边（白透明度约 5%～10%），柔和中性黑色投影，仅在主行动点使用少量荧光色外发光。字体 Inter，开启抗锯齿。

**Token 约束**：表面层级——底色 `#0A0A0A`，主卡片 `#1A1A1A`，次级区块 `#121212`。文字——主文案纯白，次要说明 gray-500，未激活态 gray-600。深色表面上的强调图标/数字：`#D9FF00`；荧光按钮上的字：黑色。边框——默认 `rgba(255,255,255,0.05)`，需强调时用 `0.10`。装饰光斑：`rgba(217,255,0,0.1)` + 强模糊。

**布局约束**：单列流式布局；水平内边距外层约 20px、内容区约 16px；纵向区块间距约 16px；卡片圆角 24px；底部悬浮导航条最大宽约 400px 居中；底部为 dock / FAB 预留约 120px 内边距。

**交互约束**：主按钮全宽、圆角 18px、黑字、字重 900、带荧光色扩散阴影；按下态缩放至 0.95，`transform` 过渡约 150ms。Tab：选中为荧光色 + 粗体 + 顶部小圆点指示；未选中为 gray-600 + `medium` 字重。

**避免项**：不要第二种高饱和色相（不要用蓝/橙等做主 CTA）；不要纯白整页底；不要满屏细霓虹描边；不要用厚重渐变替代扁平分层；除非刻意适配桌面，否则不要多栏大屏布局。

### 组件提示词
**卡片**：深色 `#1A1A1A`，圆角 24px，内边距 24px（`p-6`），`border-white/5`，可选用 `shadow-xl`；内容区右上角后方放置淡黄色模糊圆形装饰（容器 `overflow-hidden`）。

**列表行**：左侧图标底 48×48，`bg-white/5`，`rounded-2xl`，线图标描边 `#D9FF00`、线宽约 2px；标题 `font-bold`、`text-white`；描述 `13px`、`text-gray-500`；行间距约 16px，区块内纵向间距约 24px。

**分段进度条**：每段轨道 `bg-white/10`，高度约 12px，段间距 `gap-1`，整体首尾胶囊圆角。

**主按钮**：填充 `#D9FF00`，标签黑色，字号 16px、字重 900，`rounded-[18px]`，纵向内边距约 16px，外发光 `0 8px 30px rgba(217,255,0,0.2)`。

**底部 Dock**：胶囊容器 `#1A1A1A`、不透明度约 95%，`backdrop-blur-xl`，圆角 40px，高度约 76px，`shadow-2xl`，`border-white/10`；中央 FAB 为直径 72px 的荧光圆，向上抬高，外圈 `5px #1A1A1A` 环，外发光 `0 12px 24px rgba(217,255,0,0.3)`。

### 变体提示词
在同一视觉 DNA 下可做可控变化：**更暗**：三层表面整体再压暗约 4%～6%，强调色保持 `#D9FF00` 或略降饱和。**更亮**：将 `#121212` 区块提亮至接近 `#1A1A1A`，次要正文可升到 `gray-400`。**更暖**：仅对边框与次要文字的中性灰微调偏暖，不改变 `#D9FF00`。**更紧凑**：卡片改为 `p-5`，`space-y-3`，标题区 `mb-6`，dock 高度约 `68px`。**更疏朗**：`space-y-6`，正文 14～15px，进度条高度约 `h-4`。

## 复用说明
- **必须保持不变**：单一荧光强调色 `#D9FF00`、黑底三层表面明度关系、卡片 24px 圆角与底部 dock 40px 形态语言、主按钮黑字高对比。
- **可弹性调整**：灰阶具体档位（如 Tailwind gray）、阴影强弱、模糊强度、间距刻度、进度分段数量与文案。
- **风格跑偏风险**：加入蓝紫渐变或金属纹理会破坏极简工具气质；强调色铺得太满会像廉价警示条；`white/20` 以上描边过多会像「假暗黑」浅色混合。

---

## 质量评分 / Quality Score
- **总分**：88/100
- **结论**：通过（可直接用于迭代）

## 分项得分 / Dimension Scores
- 风格一致性：18/20
- Token 可执行性：14/15
- 色彩与对比：13/15
- 排版层级：9/10
- 组件完整度：9/10
- 布局与间距：9/10
- 防跑偏约束：9/10
- 变体控制力：8/10

## 扣分说明 / Deductions
- 页面内嵌浏览器扩展、第三方翻译组件样式不属于品牌 DNA（提取时已排除），还原稿时应忽略注入节点。
- 源页面未定义 `:focus-visible` 焦点环，无障碍需在实现层补齐（与「不破坏对比」原则相容）。

## 关键风险 / Key Risks
- `#D9FF00` 用作小字号长文可读性差，仅可作点缀，勿当正文色。
- 荧光色投影叠加过多易显「脏亮」，建议每屏不超过 2 处。

## 优先修订（三项）
1. （可选）为按钮与 Tab 增加焦点样式：`focus-visible: ring-2 ring-[#D9FF00]/50 ring-offset-2 ring-offset-[#0A0A0A]`。
2. 设计交付时锁定三层表面 hex，避免实现阶段随意混用 `#111` / `#222`。
3. 列表图标若需浅色模式请单独做变体，勿在同一暗黑主题内强行反转对比。
