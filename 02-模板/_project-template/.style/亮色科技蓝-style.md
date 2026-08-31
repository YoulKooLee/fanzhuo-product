## 风格快照 / Style Snapshot
- **整体风格 / Overall style**：Inter 无衬线、大圆角卡片、手机状态栏式顶栏、底部悬浮导航与「主行动按钮 + 轻投影」语言；差异集中在页面底色、主色渐变与语义色点缀策略。
- **语气关键词 / Tone keywords**：清爽、可信、轻仪式感（蓝线）；尊贵、温润、纸质奶油感（金棕线）。
- **适配产品类型 / Suitable product types**：心愿清单、会员升级、个人中心、空状态引导、权益网格、定价条与底部 Tab 导航类 App 内嵌 H5。

## 设计 Tokens / Design Tokens

### 颜色 / Colors
- `color.brand.primary`：`#4C75F2`（A 主品牌蓝，图标、主按钮、强调文案、价格数字）
- `color.brand.primary-deep`：`#3A5CCC`（A 渐变终点，与 `from-[#4C75F2]` 组成 `bg-gradient-to-br`）
- `color.surface.page`：`#F4F5F7`（A 页面灰底）；`#F9F6F0`（B 暖灰纸感底）
- `color.surface.card`：`#FFFFFF`（A 白卡）；`#FFFDF9`（B 奶油卡，可用 `95%` 不透明度 + 毛玻璃做底栏）
- `color.surface.elevated-tint`：`#E0E7FF` ~30% 不透明度脉冲光晕（A 空状态）；`#F5F1E9`（B 权益图标浅底）
- `color.text.primary`：`#1A1A1A`（A）；`#3E2723`（B 主正文棕）
- `color.text.secondary`：`#999999`（A 副文案）；`#8D6E63`（B 说明棕）
- `color.text.muted`：`#A0A4B0` / `#C0C4CC`（A Tab 未选中）；`#D2C5B4`（B 更弱层级，按需）
- `color.accent.star`：`#FFD700` ~80% 不透明（A 装饰星标）
- `color.semantic.success`：`#10B981`（A 权益图标）；`color.semantic.premium`：`#8B5CF6`；`color.semantic.warning`：`#F5A623`
- `color.tint.blue-soft`：`#EEF2FF`（A 图标圆底）；`color.tint.amber-soft`：`#FFF9EE`；`color.tint.violet-soft`：`#F2EEFF`；`color.tint.green-soft`：`#EEFFF5`
- `color.hero.dark-from` / `color.hero.dark-to`：`#45271A` → `#2D1B14`（B 会员头图深色渐变）
- `color.gold.solid` / `color.gold.dark`：`#D4AF37` / `#B8860B`（B 徽章、进度高亮、按钮渐变端点）
- `color.border.subtle`：`border-gray-100` / `gray-200`（A）；`border-white/50`（B 底栏胶囊描边）

### 字体 / Typography
- `font.family.ui`：`Inter`，字重 `400` `500` `600` `700`（Google Fonts `@import`），`system-ui` 栈回退；`-webkit-font-smoothing: antialiased`
- `font.size.caption`：`11px`（Tab 标签、权益副说明）
- `font.size.body`：`13px`–`16px`（说明、按钮、列表）
- `font.size.subheading`：`17px`–`18px`（页标题、卡片内小标题）
- `font.size.title`：`22px`（A 空状态主标题）；`28px`（A 价格大号）
- `font.size.display`：`text-xl` / `text-2xl`（B 页眉与会员标题）
- `font.weight.cta`：`font-semibold`（次要主按钮）；`font-bold`（价格、区块标题、金线 CTA）
- `font.tracking`：`tracking-tight`（大标题）；`tracking-wide` / `uppercase tracking-wider`（状态栏时间、英文装饰标签）

### 背景 / Backgrounds
- `background.page`：浅灰（A）或暖米（B）纯色全屏 `min-h-screen`
- `background.hero.gradient`：A 为蓝对角渐变 `from-[#4C75F2] to-[#3A5CCC]`；B 为深棕对角渐变 `from-[#45271A] to-[#2D1B14]`，叠加大号 `bg-[#D4AF37]/10` + `blur-2xl` 光斑装饰
- `background.glass`：`bg-white/10`–`bg-white/20` + `backdrop-blur-md`，配 `border-white/30`（A 会员卡内头像环、徽章）；B 为 `bg-white/5` + `border-white/10` 小方块图标容器
- `background.nav-pill`：`bg-white/60 backdrop-blur-md`（A 顶栏胶囊）；B 底栏 `bg-[#FFFDF9]/95 backdrop-blur-xl`

### 阴影 / Shadows
- `shadow.cta.blue`：`0 10px 25px rgba(76, 117, 242, 0.3)` 或 `0 12px 24px rgba(76, 117, 242, 0.35)`（主 FAB / 主按钮）
- `shadow.cta.blue-alt`：`0 8px 20px rgba(76, 117, 242, 0.3)`（会员页底部长按钮）
- `shadow.card.soft`：`0 8px 32px rgba(0, 0, 0, 0.06)`（A 轻卡片，与 `shadow-sm` 同体系）
- `shadow.card.warm`：`0 2px 12px rgba(62, 39, 35, 0.05)`（B 奶油卡）
- `shadow.card.warm-float`：`0 8px 32px rgba(62, 39, 35, 0.08)`（B 底栏大胶囊）
- `shadow.fab.ring`：实心品牌色圆 + `5px` 白边 `border-[5px] border-white`（A 底栏中心按钮）

### 边框 / Borders
- `border.width.hairline`：`1px`（卡片、灰分割线 `#EAECEF` 竖条）
- `border.width.emphasis`：`5px`（FAB 外环）
- `border.color.default`：`border-gray-200` / `border-gray-100`；半透明白 `border-white/30`、`border-white/50`

### 圆角 / Radii
- `radius.card`：`20px`（A 权益小卡）；`24px`（双版本大卡片、会员头图）
- `radius.button`：`18px`–`20px`（全宽主按钮）
- `radius.chip`：`rounded-full`（状态胶囊、时间栏右侧控件）
- `radius.nav-bar`：`40px`（B 底部导航大圆角条）
- `radius.icon-tile`：`rounded-2xl`（`16px`，B 权益行左侧图标底）

### 按钮 / Buttons
- **主行动（A）**：`bg-[#4C75F2]`、`text-white`、`py-4`、圆角 `18px`–`20px`、`font-semibold` 或 `font-bold`、`shadow` 蓝系；`active:scale-95` 与 `transition-transform`
- **主行动（B）**：`bg-gradient-to-r from-[#B8860B] to-[#D4AF37]`、`text-white`、`rounded-[18px]`、`shadow-[0_8px_20px_rgba(184,134,11,0.2)]`、`active:scale-95`
- **次行动 / 文字按钮**：继承 `text-[#4C75F2]` 或白上 `text-white/70`；B 用棕阶 `text-[#5D4037]` 图标按钮 + `bg-[#FFFDF9]` 圆形底
- **聚焦 / 悬停**：源码未显式 `focus-visible`；复用时建议为所有 `button` 增加 `ring-2 ring-offset-2`，A 用 `ring-[#4C75F2]/40`，B 用 `ring-[#D4AF37]/50`

### 布局 / Layout
- `layout.container`：全宽 `w-full`，水平内边距 `px-4`–`px-5`，纵向分区 `space-y-4` 或 `gap-3` 网格
- `layout.max-width.content`：`max-w-[280px]`（A 空状态文案列）；`max-w-[400px]`（B 底栏胶囊）
- `layout.grid.benefits`：`grid-cols-2 gap-3`（A 四宫格权益）
- `layout.bottom-nav`：`fixed bottom-8` + 水平居中，`pointer-events-none` 外层 + 内层可点；中心 FAB `-top-5` 突出；Tab 三区 + `#EAECEF` 竖分隔（A）
- `layout.safe-area`：顶栏 `pt-4 pb-2`，主区 `pb-20` / `pb-[120px]` 为底栏留空

## 风格原则 / Style Principles
1. **双主题单骨架**：列表—卡片—底栏的信息架构在两套配色下保持一致，仅替换 `surface`、`brand` 与投影色相。
2. **冷线以蓝为锚**：几乎所有强交互与选中态回到 `#4C75F2`，避免引入第二种高饱和主色。
3. **暖线以金棕为梯**：正文 `#3E2723`、说明 `#8D6E63`、高光 `#D4AF37`，深色头图压暗背景突出金属质感。
4. **圆角偏大**：`20px`–`24px` 卡片与 `18px` 按钮传递友好、偏消费级 App 气质。
5. **轻投影叙事**：彩色投影只给主 CTA / FAB；内容卡用极低对比黑或棕 `alpha` 投影。
6. **语义色点状使用**：紫/绿/橙小圆底图标仅在权益宫格中出现，面积小、不抢主蓝。
7. **空状态仪式感**：大插画区 + 淡色脉冲圆 + 单颗金色点缀，文案居中窄列。
8. **会员头图层次**：渐变底 + 半透明圆装饰 + 玻璃拟态头像/徽章，前景 `z-10` 叠字。
9. **排版密度中等**：`11px` 辅文 + `15px` 正文 + `22px` 级标题形成清晰台阶。
10. **动效克制**：仅 `active:scale` 与 `animate-pulse` 光晕，避免复杂曲线动画。

## 提示词包

### 基础提示词

**审美方向**  
生成一款**竖屏移动端**界面（约 390px 逻辑宽）。默认采用 **Inter** 字体与**大圆角卡片**。提供两种皮肤可选：**皮肤 A** 为浅灰页面 `#F4F5F7` + 品牌蓝 `#4C75F2` 与深蓝渐变头图；**皮肤 B** 为暖米底 `#F9F6F0` + 深棕金渐变头图与奶油卡 `#FFFDF9`。整体应干净、易读，主按钮带**同色柔和长投影**，避免扁平无层次。

**Token 约束**  
- 皮肤 A：`color.surface.page` `#F4F5F7`，`color.text.primary` `#1A1A1A`，`color.brand.primary` `#4C75F2`，渐变第二色 `#3A5CCC`，辅文 `#999999`，禁用 Tab `#A0A4B0` / `#C0C4CC`。  
- 皮肤 B：`color.surface.page` `#F9F6F0`，`color.text.primary` `#3E2723`，头图 `from #45271A to #2D1B14`，强调金 `#D4AF37`、深金 `#B8860B`，说明 `#8D6E63`，奶油表面 `#FFFDF9`。  
- 圆角：内容卡 `20px`–`24px`，主按钮 `18px`–`20px`，必要时底栏 `40px` 胶囊。  
- 投影：皮肤 A 主按钮 `0 10px 25px rgba(76,117,242,0.3)`；皮肤 B 主按钮 `0 8px 20px rgba(184,134,11,0.2)`，奶油卡 `0 2px 12px rgba(62,39,35,0.05)`。

**布局约束**  
全宽列 + `px-5` 内边距；区块纵向 `space-y-4`；权益可用 **2 列网格** `gap-3`（皮肤 A）或 **单列列表 + 左图标**（皮肤 B）。底部预留 **≥100px** 给导航或 FAB。顶栏含伪状态栏时间与右上图标区。

**交互约束**  
主按钮使用 **`active:scale-95`**（或 `0.98`）与 **`transition-transform`**。选中 Tab 用品牌色图标+标签；未选中降饱和灰或棕。可点击区域 **≥44px** 高。

**避免项**  
- 禁止在同一屏混用 A 的蓝主色与 B 的金棕主色（除非做明确「主题切换」示意）。  
- 禁止高饱和红绿大面积背景。  
- 禁止小于 `10px` 的正文。  
- 禁止无圆角的直角按钮作为主 CTA。  
- 禁止去掉主按钮投影导致与灰底黏连。

### 组件提示词

**顶栏**  
皮肤 A：时间 `text-[15px] font-semibold tracking-wide`；右侧 `w-[88px] h-[32px] bg-white/60 backdrop-blur-md rounded-full border border-gray-200 shadow-sm`。皮肤 B：图标与时间与 `#5D4037` 统一。

**会员头图卡片**  
皮肤 A：`w-full bg-gradient-to-br from-[#4C75F2] to-[#3A5CCC] rounded-[24px] p-6 shadow-lg relative overflow-hidden`，角上 `bg-white/10 rounded-full` 装饰圆，正文白字/白字 70% 透明度。皮肤 B：深棕渐变 + 金色模糊光斑 + `shadow-xl`。

**权益单元**  
皮肤 A：白底 `rounded-[20px] p-4 shadow-sm border border-gray-100`，上图标圆底 `#EEF2FF` / `#FFF9EE` / `#F2EEFF` / `#EEFFF5` 四选一配对应图标色。皮肤 B：奶油卡 + `rounded-2xl` 图标浅底 `#F5F1E9` + 标题 `#3E2723` + 描述 `#8D6E63`。

**定价条**  
皮肤 A：白卡 `rounded-[24px] p-5`，价格数字 `text-[28px] font-bold text-[#4C75F2]`，前缀 `¥` `text-[14px]`。皮肤 B：同结构但数字改金棕渐变或实色金。

**底部导航**  
皮肤 A：中心 `72px` 圆形 FAB `bg-[#4C75F2]` + 蓝投影 + `5px` 白边；两侧 Tab `text-[11px]`。皮肤 B：`max-w-[400px] rounded-[40px]` 奶油半透明条 + `border-white/50` + 棕系投影。

### 变体提示词

- **更亮**：页面底调亮 4%–6%（A 趋近 `#F8F9FB`，B 趋近 `#FCFAF6`），投影 `alpha` 略降，保留品牌色不变。  
- **更暗（仅皮肤 A）**：页面改为 `#EAECEF`，卡片仍白，主蓝不变，文字保持 `#1A1A1A`。  
- **更密**：`p-4`→`p-3`，`gap-3`→`gap-2`，字号不降于 `11px` 正文底线。  
- **更暖（仅 B）**：在不影响对比的前提下将 `#FFFDF9` 略向杏色偏移，金高光略提高饱和度 **≤5%**。

## 复用说明
- **必须保持不变**：Inter 栈、大圆角层级（卡 20–24 / 按钮 18–20）、主 CTA 的彩色长投影与 `active:scale` 反馈、双主题**二选一**的配色逻辑。  
- **可弹性调整**：具体文案、权益项数量、网格 vs 列表、状态栏装饰、金蓝渐变角度（保持 `to-br` 或 `to-r` 即可）。  
- **风格跑偏风险**：混用两套主色、去掉毛玻璃/半透明度导致顶栏与底栏发「塑料灰」、阴影色相与主色不一致（例如金主题用蓝投影）。

---

## 质量评分 / Quality Score
- **总分**：91/100
- **结论**：通过（可直接用于迭代与批量出稿）

## 分项得分 / Dimension Scores
- 风格一致性：18/20
- Token 可执行性：14/15
- 色彩与对比：14/15
- 排版层级：9/10
- 组件完整度：9/10
- 布局与间距：9/10
- 防跑偏约束：9/10
- 变体控制力：9/10

## 扣分说明 / Deductions
- 源 HTML 未定义 `focus-visible` 样式，文档中为**推断补充**，扣在组件完整度与 Token 可执行性各 1 分档内，不影响整体通过。

## 关键风险 / Key Risks
- 两页会员中心主题不同，若产品只保留一套品牌，需在实现层锁定 **A 或 B**，避免设计稿混贴。

## 优先修订（三项）
1. 在工程里为所有 `button` 补齐 `focus-visible` 环，与现有 `active:scale` 并存。  
2. 将 `shadow-*` 与色值抽为设计 Token（CSS 变量），避免在 JSX 中散落任意值。  
3. 若仅输出单一品牌，在提示词首部删除另一套皮肤的色板段落，仅保留对应变体。
