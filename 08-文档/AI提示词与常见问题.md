# AI 提示词 & 常见问题速查

> 保存经过验证的有效提示词，以及踩过的坑。每次发现新规律就更新这个文件。

---

## 1. 移动端页面生成（390px 手机框、居中、无滚动条）

### ✅ 好用的提示词（直接复制）

```
请生成一个 390px 宽的移动端页面（参考 iPhone 14 Pro 比例 390×844），
页面内容放在 class="phone-frame" 的容器里，
外层 body 用 flex 居中，
phone-frame 设置 overflow:hidden 彻底关闭滚动条，
body 也加 overflow:hidden 兜底。
```

### 🔥 关键 CSS 模板（必须包含以下 3 条）

```css
/* 1. body 居中 + 禁止滚动 */
body {
  margin: 0;
  display: flex;
  justify-content: center;
  background: #e8eaed;        /* 外层灰色画布 */
  overflow: hidden;           /* 兜底：body 层不能滚动 */
  height: 100%;
}

/* 2. 手机框：固定宽高 + overflow:hidden（不用 overflow-y:auto） */
.phone-frame {
  width: 390px;
  height: 844px;
  max-height: 100vh;          /* 小屏幕自动收缩 */
  overflow: hidden;           /* 核心：彻底禁止滚动 */
  position: relative;
}

/* 3. 全局掐掉 webkit 滚动条（兜底） */
*::-webkit-scrollbar { width: 0; height: 0; display: none; }
```

### ❌ 不要做的事

- 不要用 `overflow-y: auto` —— 哪怕配合 `::-webkit-scrollbar { display: none }` 也不一定生效
- 不要用 `overflow: scroll` 或 `auto`
- 不要把宽高写在 body 上然后忘了 `overflow: hidden`
- 不要用粘贴脚本生成 CSS，容易引入 `)body {` 这种拼写错误导致整段规则被 parser 忽略

### 验证清单（改完自己检查）

```bash
# 检查 4 项是否全部到位
grep -c "^\s*\.phone-frame {" page.htm   # 应该有 1（phone-frame 规则存在）
grep -c "overflow:hidden" page.htm        # 应该 ≥ 2（body 和 phone-frame 都有）
grep -c ")body" page.htm                  # 必须是 0（不能有拼写错误）
```

---

## 2. 高保真页面还原（从 Axhub 导出包）

### 提示词

```
请阅读 C:\Users\游翔\Downloads 下 xxx.zip 里的 README.md，
根据 prompts/rebuild-page.md 的指引，
对「项目名」页面进行高精度还原：
- 以 screenshot.png 为视觉基准
- 使用 structure/doms.json 的节点数据
- 使用 structure/styles.json 的精确样式
- 嵌入 assets 中的真实图片（base64 格式）
```

### 踩过的坑

- 导出包的 `index.html` 里的 `data:image/png;charset=UTF-8;base64,...` 格式，
  普通正则 `data:image/png;base64` 匹配不到（中间多了一个 `;charset=UTF-8`），
  需要改用 `;base64,` 定位拆分提取

---

## 3. Axhub Make 项目启动

### 提示词

```
打开 C:\Users\游翔\Documents\AI work\Axhub\Rongzhihui_app\make-project-20260716，
启动项目，通过浏览器生成操作面板
```

### 固定操作流程

1. `cd` 到项目目录
2. `npm run dev` 启动 Vite dev server（端口默认 51720）
3. **管理后台**在 Windows 上无法自动启动（`spawn EINVAL` 错误），
   需手动执行：
   ```
   npx -y @axhub/make@latest "项目完整路径" --no-open --runtime-origin http://localhost:51720
   ```
4. 管理后台启动后监听 53817 端口，用 `/?projectId=make-project-20260716` 访问

### 验证端口

```bash
netstat -ano | grep 51720   # Vite 已在监听
netstat -ano | grep 53817   # 管理后台已在监听
```

---

## 4. 真实色板对齐（Tailwind → Ant Design）

### 背景

Axhub 导出数据的真实设计令牌通常是 **Ant Design**（`#1890ff`），
不要用 Tailwind 默认色板（`#3b82f6`）。

### 常用 Ant Design 令牌

| 用途 | 色值 | Tailwind 错用 |
|------|------|--------------|
| 主蓝 | `#1890ff` | `#3b82f6` |
| 深蓝 | `#0958d9` | `#1e60a8` |
| 浅蓝 | `#40a9ff` | `#60a5fa` |
| 蓝-1 底色 | `#e6f4ff` | `#eef2ff` |
| 危险红 | `#ff4d4f` | `#ef4444` |
| 成功绿 | `#52c41a` | `#10b981` |
| 正文字 | `#333333` | `#1a1a2e` |
| 次要字 | `#666666` | 保留 |
| 页面底 | `#f5f7fa` | `#f8fafc` |

### 提示词（替换全局色板时）

```
我用 Tailwind 色板写的页面，需要对齐为 Ant Design 标准色板：
#3b82f6 → #1890ff, #1e60a8 → #0958d9, #ef4444 → #ff4d4f,
#1a1a2e → #333333, #eef2ff → #e6f4ff
请替换所有文件中的颜色值，替换完成后自己检查确保无残留错色
```

---

## 5. 快速检查页面的命令

```bash
# 检查页面是否可访问
curl -s -m 5 -w "HTTP %{http_code}, size %{size_download}\n" "http://localhost:51720/prototypes/页面名/index.htm" -o /dev/null

# 检查 CSS 中是否缺 phone-frame 块
curl -s "http://localhost:51720/prototypes/页面名/index.htm" | grep -c "phone-frame"

# 检查是否残留拼写错误
curl -s "http://localhost:51720/prototypes/页面名/index.htm" | grep -c ")body"
```

---

> 最后更新：2026-07-17 ｜ 每次发现新的规律就回来加一条
