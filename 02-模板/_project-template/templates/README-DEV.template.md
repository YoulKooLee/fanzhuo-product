# {项目名称} - 开发规范

> **AI 协作说明**：技能触发与工作流见 [AGENTS.md](../AGENTS.md)（单项目时 AGENTS.md 与本文同目录）；**本文为项目实现规范的单一事实来源**。
>
> 使用前请填写下方「项目配置」表格；`page-spec-loader` 优先读取本文，再从 `{WORKSPACE_PATH}/.agents/knowledge/` 加载通用与 UI 库规范；**冲突时以本文为准**。

## 项目配置（必填）

| 配置项 | 填写示例 | 你的值 |
|--------|---------|--------|
| 项目名称 | XX 管理后台 | |
| WORKSPACE_PATH | 仓库根（含 `.agents/`） | |
| PROJECT_PATH | 本子项目目录（含 `package.json`） | |
| UI 组件库 | element-plus / vant / ant-design-vue | |
| 导航方式 | 侧边栏 / 顶部栏 / 底部 Tabbar | |
| 路由注册方式 | `src/router/modules/` + `routeModules` | |
| 菜单来源 | 路由 meta 自动生成 / 独立菜单配置 | |
| 布局壳组件 | `@/views/index/index.vue`（无则填实际路径） | |
| Mock 模式 | 手动 Mock + `VITE_USE_MOCK` / vite-plugin-mock / 无 Mock | |
| API 前缀 | `/admin` / `/api` | |
| 默认登录账号（Mock） | admin / 123456 | |
| 开发端口 | 3006 | |

## 技术栈

<!-- 按实际填写 -->

- **框架**:
- **构建工具**:
- **语言**:
- **UI 组件库**:
- **状态管理**:
- **路由**:
- **HTTP 客户端**:

## 工作区目录

```
{WORKSPACE_PATH}/
├── .agents/
├── AGENTS.md
├── docs/
├── {PROJECT_PATH}/          # 本子项目
│   ├── README-DEV.md        # 本文件
│   ├── package.json
│   ├── src/
│   └── ...
└── ...                      # 其他子项目（如有）
```

## 规范加载顺序

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 1 | 本文件 `README-DEV.md` | 路由、布局、Mock、项目约定 |
| 2 | `.agents/knowledge/conventions/project.md` | 通用目录与命名 |
| 3 | `.agents/knowledge/conventions/mock.md` | Mock 通用规则 |
| 4 | `.agents/knowledge/ui-libs/{UI库}/` | 组件与页面写法 |

## 环境要求

- **Node.js**: >= 20.19.0（建议）
- **包管理器**: pnpm >= 8.8.0（建议）

## 快速开始

```bash
cd {PROJECT_PATH}
pnpm install
pnpm dev
pnpm build
```

## 项目结构

以下路径均相对于 **PROJECT_PATH**：

```
src/
├── api/                 # 按模块拆分
├── mock/                # Mock 函数（若启用 Mock）
├── router/
│   ├── modules/         # 路由模块，在 index.ts 汇总为 routeModules
│   ├── routes/          # 静态/异步路由（按项目实际）
│   └── guards/
├── types/
├── utils/
│   └── http/            # HTTP 客户端
├── locales/             # 若有多语言菜单
│   └── langs/
├── components/
└── views/               # 页面，按模块分子目录
```

## 核心开发规范

### 通用

- 使用 `<script setup>` + `defineOptions({ name: 'XxxPage' })`
- 新建页面后：**路由模块** → **`router/modules/index.ts` 注册** → **菜单翻译**（若适用）
- Mock 数据使用**固定数据**，不用随机数
- 开发完成后执行 `pnpm build` 验证，不由 AI 长期占用 dev 进程
- AI 对话使用中文

### 路由与菜单

<!-- 按项目实际填写；以下为常见后台模式示例，可删改 -->

- 路由模块放在 `src/router/modules/`，在 `src/router/modules/index.ts` 的 `routeModules` 数组中注册
- 菜单 `meta.title` 使用翻译键（如 `menus.example.title`），页面文案直接用中文
- 多子菜单模块：父路由 `path` + `children`；隐藏子路由 `meta.isHide: true`
- 隐藏子路由的 `path` 须包含 `/`（如 `detail/:id`、`edit/:id`），避免菜单构建异常
- 二级页菜单高亮：子路由 `meta.activePath` 指向父菜单 path

**路由模块示例**：

```typescript
// src/router/modules/example.ts
export const exampleRoutes = {
  path: '/example',
  name: 'Example',
  component: () => import('@/views/index/index.vue'), // 或你的布局壳
  meta: { title: 'menus.example.title', isFirstLevel: true },
  children: [
    {
      path: '',
      name: 'ExampleList',
      component: () => import('@/views/example/index.vue'),
      meta: { title: 'menus.example.title', keepAlive: true, isHide: true }
    }
  ]
}
```

### 国际化

- **页面内容**：直接使用中文，不用 `$t()` / `t()`
- **菜单名称**：`meta.title` 用翻译键，同步更新 `locales/langs/zh.json` 与 `en.json`

### 布局与组件

- 列表页推荐结构：**筛选卡片** + **数据卡片**（flex 纵向布局，`gap: 16px`）
- 卡片：`border: none`、`box-shadow: none`、`border-radius: 12px`
- 表格：默认不加 `border`；需要固定表头时容器 `flex: 1`，表格 `height="100%"`
- 表格操作列按钮：使用 UI 库 link 风格按钮，不加过小 size
- 可滚动区域：优先使用 UI 库 Scrollbar 组件，避免裸 `overflow-y: auto`
- **组件库细节**以 `.agents/knowledge/ui-libs/{UI库}/` 为准，本文未写明的从知识库补充

### API 规范

- 使用 `request.get()`、`request.post()`、`request.put()`、`request.del()`，不用裸 `request({ method })`
- 函数命名：`getList`、`getDetail`、`addItem`、`updateItem`、`deleteItem`
- 类型定义放在 `src/types/`，查询参数的状态字段支持 `number | string | null`

### Mock 规范（手动 Mock 模式）

适用于 `VITE_USE_MOCK = true` 且 API 层手动调用 Mock 函数的项目：

- **不使用** vite-plugin-mock 自动拦截（若你选用该方案，在本节改写并删除此条）
- Mock 文件导出具名函数；数据用模块级 `let` 存储以支持增删改
- API 文件判断 `import.meta.env.VITE_USE_MOCK === 'true'` 后调用 Mock
- Mock 延迟约 300ms；返回 `{ code: 200, message: 'success', data }`

```typescript
// src/api/example.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function getList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ code: 200, message: 'success', data: getListMock(params) }), 300)
    })
  }
  return request.get({ url: '{API_PREFIX}/list', params })
}
```

## 页面开发流程（page-generator 对齐）

1. `src/types/xxx.ts` — 类型
2. `src/mock/xxx.ts` — Mock 函数（若启用）
3. `src/api/xxx.ts` — API
4. `src/views/xxx/index.vue` — 页面
5. `src/router/modules/xxx.ts` — 路由模块
6. `src/router/modules/index.ts` — 注册到 `routeModules`
7. `locales/langs/zh.json` + `en.json` — 菜单翻译（若适用）
8. `pnpm build` — 验证

## 参考页面

<!-- 填写项目中已有的标准列表页/表单页路径，供 page-generator 风格对齐 -->

- 列表页参考：`src/views/___/index.vue`
- 表单页参考：`src/views/___/index.vue`

## 项目特有约定

<!-- 在此补充 Starter 未覆盖的约定：权限指令、特殊布局、业务组件路径等 -->

-
