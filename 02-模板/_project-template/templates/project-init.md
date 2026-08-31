# 前端项目初始化指南

在已复制 vibepm-dev-agent（`.agents/` + `AGENTS.md`）的前提下，按本文创建前端子项目并接入 `page-generator`。

## 第 1 步：确定布局

| 模式 | 目录 | WORKSPACE_PATH | PROJECT_PATH |
|------|------|----------------|--------------|
| 单项目 | 根目录即前端 | 项目根 | 项目根 |
| 多子项目 | `admin/`、`mobile/` 并列 | 仓库根 | 各子目录 |

## 第 2 步：创建前端工程

以 **Vue 3 + Vite + TypeScript + Element Plus** 为例（其他 UI 库同理，安装对应依赖即可）：

```bash
# 在 WORKSPACE_PATH 下
pnpm create vite admin --template vue-ts
cd admin
pnpm install
pnpm add element-plus vue-router pinia axios
pnpm add -D unplugin-vue-components unplugin-auto-import
```

移动端示例：创建 `mobile/` 后安装 `vant` 而非 `element-plus`。

## 第 3 步：建立最小 src 结构

```
src/
├── api/
├── mock/
├── router/
│   └── modules/
│       └── index.ts       # 导出 routeModules 数组
├── types/
├── utils/
│   └── http/              # HTTP 封装（request.get/post 等）
├── views/
│   └── index/             # 布局壳页面（若有后台布局）
├── App.vue
└── main.ts
```

**最低要求**：存在 `package.json`、`src/`、可运行的 `pnpm dev`。

## 第 4 步：编写 README-DEV.md

```bash
# 在 PROJECT_PATH 下
cp ../templates/README-DEV.template.md ./README-DEV.md
```

编辑 `README-DEV.md`，填写文首「项目配置」表格中的所有占位项。  
这是 `page-spec-loader` 的**最高优先级**规范来源，不可省略。

## 第 5 步：配置 Mock（推荐）

在 `{PROJECT_PATH}/.env` 中：

```bash
VITE_USE_MOCK = true
VITE_PORT = 3006
```

按 README-DEV.md 中的 Mock 规范实现 `src/mock/` 与 API 层 `USE_MOCK` 判断。

## 第 6 步：准备 docs（若要写 SRS / 用 page-generator）

在工作区根目录：

```bash
mkdir -p docs/01-需求与规划
```

参见 [docs-structure.md](./docs-structure.md)。

## 第 7 步：验证

```bash
cd {PROJECT_PATH}
pnpm dev          # 能启动
pnpm build        # 能构建（page-generator 收尾会执行）
```

## 第 8 步：开始 AI 生成页面

1. 用 `req-doc` 编写 SRS（或使用已有需求文档）
2. 触发 `page-generator`：「按照 SRS 实现 xxx 功能」
3. AI 将自动：
   - 选定 `PROJECT_PATH`
   - 读取 `{PROJECT_PATH}/README-DEV.md`
   - 按 `package.json` 匹配 UI 库知识库
   - 在 `{PROJECT_PATH}/src/` 下生成代码

## 常见问题

**Q: 没有 README-DEV.md 能生成吗？**  
A: 可以，但会退化为读 `.agents/knowledge/conventions/` 和扫现有代码推断，风格不稳定。**强烈建议始终维护 README-DEV.md**。

**Q: 没有任何已有页面能生成吗？**  
A: 可以，但缺少风格参考。建议至少手写或生成 1 个标准列表页供后续对齐。

**Q: UI 库不是 Element Plus？**  
A: 在 `package.json` 安装对应库（如 `vant`），`page-spec-loader` 会自动加载 `ui-libs/vant/` 规范。
