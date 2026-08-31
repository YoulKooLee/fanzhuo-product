# Element Plus 管理系统组件框架 - 开发文档

> **AI 协作说明**：技能触发与工作流见 [AGENTS.md](../AGENTS.md)；本文件为项目实现规范的单一事实来源。
> 
> **WORKSPACE_PATH**：仓库根目录（含 `.agents/`、`AGENTS.md`、`admin/`、`shadcn/`）。
> **PROJECT_PATH**：前端子项目目录（含 `package.json` 和 `src/`，即 `admin/`）。
> **规范加载**：`page-spec-loader` 优先读取本文（`admin/README-DEV.md`），再从 `{WORKSPACE_PATH}/.agents/knowledge/` 加载通用与 UI 库规范；冲突时以本文为准。

## 项目简介

这是一个基于 Vue 3 + Vite 开发的后台管理系统组件框架，使用 AI 根据框架快速生成页面和功能。

## 技术栈

- **框架**: Vue 3.5 + Composition API
- **构建工具**: Vite 7.1
- **语言**: TypeScript 5.6
- **UI 组件库**: Element Plus 2.11
- **状态管理**: Pinia 3.0 + pinia-plugin-persistedstate
- **路由**: Vue Router 4.x
- **HTTP 客户端**: Axios 1.12
- **图表库**: ECharts 5.6 + @antv/g2 5.4
- **富文本编辑器**: @wangeditor/editor 5.1
- **实时通信**: Socket.io-client 4.8
- **国际化**: Vue I18n 9.14
- **工具库**: @vueuse/core, dayjs, crypto-js

## 工作区目录

```
.
├── .agents/                # AI 技能与 Agent 配置
│   ├── agents/             # 子 Agent 定义（page-spec-loader、req-writer 等）
│   ├── knowledge/          # 规范知识库（通用规范、UI 库规范）
│   └── skills/             # 技能工作流（page-generator、req-doc 等）
├── AGENTS.md               # AI 技能触发与规范索引（细则见本文件）
├── CHANGELOG.md            # 版本变更记录
├── admin/                  # PC 端 Vue + Element Plus 子项目（PROJECT_PATH）
│   ├── src/
│   ├── package.json
│   └── README-DEV.md
├── shadcn/                 # PC 端 React + shadcn/ui 子项目（PROJECT_PATH）
│   ├── src/
│   ├── package.json
│   └── README-DEV.md
└── ...
```

## 规范知识库

本项目实现规范以 **本文** 为单一事实来源；`page-spec-loader` 加载顺序如下：

| 优先级 | 规范文件 | 路径 | 用途 |
| --- | --- | --- | --- |
| 1（最高） | **项目实现规范** | `admin/README-DEV.md`（本文） | 路由、布局、Mock、组件用法等 |
| 2 | 通用项目规范 | `{WORKSPACE_PATH}/.agents/knowledge/conventions/project.md` | 目录、命名补充 |
| 3 | Mock 通用规范 | `{WORKSPACE_PATH}/.agents/knowledge/conventions/mock.md` | Mock 持久化等 |
| 4 | Element Plus 组件 | `{WORKSPACE_PATH}/.agents/knowledge/ui-libs/element-plus/components.md` | 组件用法 |
| 4 | Element Plus 页面 | `{WORKSPACE_PATH}/.agents/knowledge/ui-libs/element-plus/pages.md` | 列表页/表单页流程 |

在本工作区使用 `page-generator` 时：

1. **WORKSPACE_PATH** 设为仓库根目录（含 `.agents/`、`AGENTS.md`）
2. **PROJECT_PATH** 设为 `admin/`
3. **项目规范** 从本文按需摘录（路由、布局、Mock、组件等章节）
4. **UI 库规范** 从 `{WORKSPACE_PATH}/.agents/knowledge/ui-libs/element-plus/` 加载
5. UI 库识别为 **Element Plus**

## 环境要求

- **Node.js**: >= 20.19.0
- **包管理器**: pnpm >= 8.8.0

## 快速开始

### 安装依赖

```bash
# 进入前端子项目（以下命令均在 admin/ 目录执行）
cd admin
pnpm install
```

### Mock 模式（原型演示模式）

**本项目默认启用 Mock 模式，无需后端 API 即可运行！**

Mock 模式适用于：
- 快速演示后台管理系统
- 前端开发独立调试
- 功能预览和测试

**默认登录账号**：
- 管理员账号：`admin` / `123456`
- 普通用户：`user` / `123456`

**切换 Mock 模式**：
- mock模式不要修改

在 `.env` 文件中修改：
```bash
# 开启 Mock 模式（默认）
VITE_USE_MOCK = true

# 关闭 Mock 模式，使用真实后端 API
VITE_USE_MOCK = false
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器将在 `http://localhost:3006` 启动（端口可在 `.env` 中配置）

**首次启动提示**：
- Mock 模式下，直接使用上述账号登录即可
- 验证码可随意输入（Mock 模式不验证）

### 构建生产版本

```bash
pnpm build
```

构建前会自动执行 TypeScript 类型检查

### 预览生产构建

```bash
pnpm serve
```

## 代码规范

### 代码检查和格式化

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm fix

# Prettier 格式化
pnpm lint:prettier

# Stylelint 格式化
pnpm lint:stylelint

# Lint-staged（Git 提交前自动执行）
pnpm lint:lint-staged
```




## 项目结构

以下路径均相对于前端子项目目录 `admin/`（即 **PROJECT_PATH**）：

```
src/
├── api/                    # API 服务层
│   ├── auth.ts            # 认证相关
│   ├── organization.ts    # 组织管理
│   └── systemConfig.ts    # 系统配置
├── assets/                # 静态资源
│   ├── img/              # 图片资源
│   ├── icons/            # 图标资源
│   └── styles/           # 全局样式
├── components/            # 组件库
│   ├── core/             # 核心组件（art-* 前缀）
│   ├── business/         # 业务组件
│   └── custom/           # 自定义组件
├── composables/           # 组合式函数
├── config/                # 配置文件
├── directives/            # 自定义指令
├── enums/                 # 枚举定义
├── locales/               # 国际化
│   └── langs/            # 语言文件（zh.json, en.json）
├── mock/                  # Mock 数据与函数
├── router/                # 路由配置
│   ├── guards/           # 路由守卫
│   ├── modules/          # 路由模块（system-home、organization、permission、system-config、report）
│   ├── routes/           # 路由定义
│   └── utils/            # 路由工具
├── store/                 # Pinia 状态管理
│   └── modules/          # Store 模块
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
│   ├── http/             # HTTP 客户端
│   ├── storage/          # 存储管理
│   └── ...
└── views/                 # 页面组件
    ├── auth/             # 认证页面（登录、注册、忘记密码）
    ├── exception/        # 异常页（403/404/500）
    ├── organization/     # 企业管理（用户、部门、岗位）
    ├── permission/       # 权限管理（角色、菜单）
    ├── report/           # 报表中心（数据报表）
    ├── system-home/      # 系统首页
    └── SystemConfig/     # 系统配置（基础、问题类型、监控、公告、文档）
```

## 核心开发规范

### 开发规范
- 组件都是自动导入，无需手动导入
- 开发完不要npm run dev，由用户自行dev，但是需要build一下验证代码是否合规，没有报错
- 创建页面需在 `src/router/modules/` 添加路由配置并在 `index.ts` 注册
- 页面组件放在 `src/views/` 对应目录，使用 `<script setup>` 和 `defineOptions`
- 菜单翻译需同时更新 `zh.json` 和 `en.json`
- 一级菜单 component 固定为 `() => import('@/views/index/index.vue')`
- mock数据需要mock固定的数据，不要mock随机的数据
- **Mock模式必须保持启用**：`.env` 中 `VITE_USE_MOCK = true` 不要关闭，框架始终使用Mock模式运行
- Ai对话需永远中文回复我

#### 国际化规范
- **页面内容统一使用中文**：页面中的所有文本内容（标签、按钮、提示信息等）直接使用中文，不使用 `$t()` 或 `t()` 函数进行国际化
- **只有菜单名称需要多语言**：路由配置中的 `meta.title` 使用翻译键（如 `menus.example.title`），以支持菜单的中英文切换
- **不要导入 useI18n**：页面组件中不需要 `import { useI18n } from 'vue-i18n'` 和 `const { t } = useI18n()`
- **参考示例**：查看 `src/views/permission/role/index.vue` 等现有页面的实现方式
- **示例对比**：
```vue
<!-- ❌ 错误：使用国际化函数 -->
<el-form-item :label="$t('user.name')">
<el-input :placeholder="$t('user.enterName')" />
</el-form-item>
<el-button>{{ $t('common.save') }}</el-button>

<!-- ✅ 正确：直接使用中文 -->
<el-form-item label="用户名称">
<el-input placeholder="请输入用户名称" />
</el-form-item>
<el-button>保存</el-button>
```

#### 路由和菜单结构规范
- 一级菜单必须使用父子路由结构，父路由的 `component` 固定为 `() => import('@/views/index/index.vue')`
- 一级菜单的子路由才是实际的页面入口，`path` 为空字符串 `''`，`component` 指向实际页面
- 子路由需要在 `meta` 中添加 `isHide: true` 避免在菜单中重复显示
- 一级菜单需要在 `meta` 中添加 `isFirstLevel: true` 标识
- 新窗口打开页面：在父路由 `meta` 中添加 `openInNewWindow: true` 和 `newWindowPath`，并在静态路由中创建对应的全屏路由（设置 `isFullPage: true` 和 `isHide: true`）
- **⚠️ 重要：子路由路径必须包含 **`/`** 字符**
  - ❌ 错误：`path: 'create'` - 会导致父菜单被过滤掉
  - ✅ 正确：`path: 'create/new'` - 父菜单正常显示
  - **原因**：菜单构建器使用 `!relativePath.includes('/')` 判断是否为直接子路由。不包含 `/` 的路径会被识别为直接子路由，导致父菜单因所有子路由都隐藏而被过滤掉
  - **规则**：所有带 `isHide: true` 的子路由，路径必须包含 `/`（如 `detail/:id`、`edit/:id`、`create/new`）
- 路由结构示例：
```typescript
export const exampleRoutes: AppRouteRecord = {
path: '/example',
name: 'Example',
component: () => import('@/views/index/index.vue'),
meta: {
title: 'menus.example.title',
icon: '&#xe88a;',
isFirstLevel: true
},
children: [
{
path: '',
name: 'ExamplePage',
component: () => import('@/views/example/index.vue'),
meta: {
title: 'menus.example.title',
keepAlive: true,
isHide: true
}
},
// ✅ 正确：路径包含 /
{
path: 'create/new',
name: 'ExampleCreate',
component: () => import('@/views/example/create.vue'),
meta: {
title: 'menus.example.create',
keepAlive: false,
isHide: true,
activePath: '/example'
}
},
{
path: 'edit/:id',
name: 'ExampleEdit',
component: () => import('@/views/example/create.vue'),
meta: {
title: 'menus.example.edit',
keepAlive: false,
isHide: true,
activePath: '/example'
}
}
]
}
```
- 新窗口打开示例：
```typescript
export const exampleRoutes: AppRouteRecord = {
path: '/example',
name: 'Example',
component: () => import('@/views/index/index.vue'),
meta: {
title: 'menus.example.title',
icon: '&#xe88a;',
isFirstLevel: true,
openInNewWindow: true,
newWindowPath: '/example-full'
},
children: [
{
path: '',
name: 'ExamplePage',
component: () => import('@/views/example/index.vue'),
meta: {
title: 'menus.example.title',
keepAlive: true,
isHide: true
}
}
]
}
// 在 staticRoutes.ts 中添加全屏路由
{
path: '/example-full',
name: 'ExampleFull',
component: () => import('@views/example/index.vue'),
meta: { title: 'menus.example.title', isHideTab: true, isFullPage: true, isHide: true }
}
```
- 二级页面菜单高亮示例：
```typescript
// 当访问二级页面时，需要高亮显示对应的一级菜单
export const exampleRoutes: AppRouteRecord = {
path: '/example',
name: 'Example',
component: () => import('@/views/index/index.vue'),
meta: {
title: 'menus.example.title',
icon: '&#xe88a;',
isFirstLevel: true
},
children: [
{
path: '',
name: 'ExampleList',
component: () => import('@/views/example/index.vue'),
meta: {
title: 'menus.example.title',
keepAlive: true,
isHide: true
}
},
{
path: 'detail/:id',
name: 'ExampleDetail',
component: () => import('@/views/example/detail.vue'),
meta: {
title: 'menus.example.detail',
keepAlive: true,
isHide: true,
activePath: '/example'  // 指定激活的菜单路径，使一级菜单高亮
}
}
]
}
```


### 布局规范

#### 卡片样式
- 无边框：`border: none !important;`
- 无阴影：`box-shadow: none !important;`
- 圆角：`border-radius: 12px`
- 筛选卡片padding：`12px 20px`（上下12px，左右20px）
- 卡片内表单项：`margin-bottom: 0`

#### 页面布局

**核心原则**：
- **纯 Flex 布局** - 不写死页面高度，完全使用 flex 自动计算
- **固定高度** - `.layout-content` 使用 `height: 100%` 确保页面不滚动，只有表格数据滚动
- **统一内边距** - `.layout-content` 使用 `padding: 0 20px 0`（左右20px），底部 padding 放在 `.art-page-view` 上
- **底部空隙** - `.art-page-view` 使用 `padding-bottom: 20px` 确保底部有空隙，分页器不被裁剪
- **高度继承** - 页面组件使用 `height: 100%` 继承父容器高度
- **自动撑满** - 数据卡片使用 `flex: 1` 自动占满剩余空间
- **框架二特殊处理** - 框架二的 `.art-page-view` 高度需要减去工作标签页的高度（60px）

**框架布局配置**（已在 `src/views/index/style.scss` 中配置）：

**框架一**：
```scss
.app-content {
  flex: 1;
  overflow: auto;

  :deep(.layout-content) {
    box-sizing: border-box;
    height: 100%;  // 固定高度，页面不滚动
    padding: 0 20px 0;  // 只设置左右 padding

    .art-page-view {
      box-sizing: border-box;
      height: 100%;
      padding-bottom: 20px;  // 底部 padding 在这里设置
    }
  }
}
```

**框架二**：
```scss
.app-content {
  flex: 1;
  overflow: auto;

  :deep(.layout-content) {
    box-sizing: border-box;
    height: 100%;
    padding: 0 20px 0;

    .art-page-view {
      box-sizing: border-box;
      height: calc(100% - 60px);  // 减去工作标签页的高度（含 margin）
      padding-bottom: 20px;
    }
  }
}
```

**页面组件布局规范**：
```scss
// 页面根容器
.page-container {
  height: 100%;  // 继承父容器高度
  display: flex;
  flex-direction: column;
  gap: 16px;  // 卡片间距
}

// 筛选卡片
.filter-card {
  flex-shrink: 0;  // 不压缩
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

// 数据卡片
.data-card {
  flex: 1;  // 占据剩余空间
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-header {
    flex-shrink: 0;
  }

  .table-container {
    flex: 1;  // 表格占据剩余空间
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    margin-top: 16px;
  }
}
```

**关键点**：
- 不使用 `calc(100vh - XXpx)` 等固定高度计算
- 使用 `gap` 控制卡片间距，不使用 `margin-bottom`
- **按钮间距不使用 **`gap`：按钮本身有 `margin-left: 12px`，使用 `.el-button:not(:first-child) { margin-left: 12px; }` 控制间距
- `.layout-content` 使用 `height: 100%` 确保页面不滚动
- 底部 padding 设置在 `.art-page-view` 上，确保底部有空隙且分页器不被裁剪
- **框架二需要特殊处理**：`.art-page-view` 的高度使用 `calc(100% - 60px)` 减去工作标签页的高度（min-height: 40px + margin-bottom: 12px ≈ 60px）

#### 二级页面返回按钮布局

当页面是二级页面（从列表页进入详情页或管理页）时，需要在页面顶部添加面包屑卡片：

**结构：**
```vue
<el-card class="breadcrumb-card">
  <div class="breadcrumb-content">
    <el-button text @click="handleBack">
      <el-icon><ArrowLeft /></el-icon>
      返回上级页面
    </el-button>
    <span class="divider">|</span>
    <span class="page-info">页面信息：[名称] (共[数量]项)</span>
  </div>
</el-card>
```

**样式规范：**
```scss
.breadcrumb-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    height: 60px;

    .el-button {
      font-size: 14px;
      color: #606266;
      padding: 0;

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }

    .divider {
      color: #dcdfe6;
      font-size: 14px;
    }

    .page-info {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }
}
```

**功能实现：**
- 返回按钮使用 `router.push()` 返回上级页面
- 页面信息从 API 获取并显示
- 使用 ArrowLeft 图标

#### 筛选表单布局

筛选表单使用 flexbox 布局，不使用 Element Plus 的 inline 属性：

**结构：**
```vue
<el-card class="filter-card">
  <el-form :model="queryParams">
    <div class="filter-form-content">
      <el-form-item :label="$t('label1')">
        <el-input v-model="queryParams.field1" style="width: 250px" />
      </el-form-item>

      <el-form-item :label="$t('label2')">
        <el-select v-model="queryParams.field2" style="width: 150px">
          <el-option :label="$t('option1')" :value="1" />
          <el-option :label="$t('option2')" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <div class="filter-buttons">
          <el-button type="primary" @click="handleSearch">
            {{ $t('search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('reset') }}
          </el-button>
        </div>
      </el-form-item>
    </div>
  </el-form>
</el-card>
```

**样式规范：**
```scss
.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .filter-form-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .filter-buttons {
    display: flex;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}
```

**关键点：**
- 不使用 `inline` 属性，使用自定义 flexbox 布局
- 表单项容器使用 `gap: 16px` 控制间距（不使用 margin-bottom）
- 按钮间距使用 `.el-button:not(:first-child) { margin-left: 12px; }`（不使用 gap）
- 表单项 `margin-bottom: 0`
- 按钮的 form-item 使用 `label=" "` 确保对齐
- 支持多行自动换行（`flex-wrap: wrap`）


### API 和 Mock 规范

#### API 请求方法使用规范
- **正确使用方式**：使用 `request.get()`、`request.post()`、`request.put()`、`request.del()` 方法
- **错误使用方式**：不要使用 `request()` 直接调用或使用 `method` 参数
- 示例：
```typescript
// ✅ 正确
export function getList(params: ListParams) {
return request.get<{ list: Item[]; total: number }>({
url: '/admin/list',
params
})
}

export function addItem(data: Partial<Item>) {
return request.post({
url: '/admin/add',
data
})
}

// ❌ 错误
export function getList(params: ListParams) {
return request({
url: '/admin/list',
method: 'get',  // 不要使用 method 参数
params
})
}
```

#### Mock 数据处理规范
- **项目使用手动 Mock 模式**，不使用 vite-plugin-mock 自动拦截
- Mock 文件需要导出具体的 Mock 函数，而不是 MockMethod 数组
- API 文件中需要判断 `USE_MOCK` 环境变量，手动调用 Mock 函数
- Mock 数据使用固定数据，不使用随机数据
- Mock API 延迟 300ms 返回结果

**Mock 文件示例**：
```typescript
// src/mock/example.ts
import type { Item, ListParams } from '@/types/example'

// 数据存储（使用 let 而不是 const，允许修改）
let items: Item[] = [
  { id: 1, name: '示例1', status: 1 },
  { id: 2, name: '示例2', status: 0 }
]

let nextId = 3

/**
 * 获取列表 Mock 函数
 */
export function getListMock(params: ListParams) {
  const { name, status, page = 1, pageSize = 20 } = params
  let filteredData = [...items]

  // 筛选（注意类型转换）
  if (name) {
    filteredData = filteredData.filter(item => item.name.includes(name))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

// 其他 Mock 函数...
```

**API 文件示例**：
```typescript
// src/api/example.ts
import request from '@/utils/http'
import type { Item, ListParams } from '@/types/example'
import { getListMock, addItemMock } from '@/mock/example'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取列表
 */
export function getList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Item[]
    total: number
  }>({
    url: '/admin/list',
    params
  })
}
```

#### 类型定义规范
- 类型定义统一放在 `src/types/` 目录下，按模块分文件
- **查询参数类型定义**：状态、类型、难度等筛选字段需要支持 `number | string | null` 类型
  - 原因：从 URL 查询参数传过来的值可能是字符串类型
  - 在 Mock 函数中需要进行类型转换：`typeof value === 'string' ? parseInt(value) : value`
- 示例：
```typescript
// src/types/example.ts

/**
- 列表查询参数
*/
export interface ListParams {
/** 名称 */
name?: string
/** 状态 - 支持 number | string | null */
status?: number | string | null
/** 类型 - 支持 number | string | null */
type?: number | string | null
/** 当前页码 */
page: number
/** 每页大小 */
pageSize: number
}

/**
- 数据项
*/
export interface Item {
id: number
name: string
status: number  // 实际存储时是 number
type: number    // 实际存储时是 number
createTime: string
updateTime: string
}
```

#### API 函数命名规范
- 遵循 RESTful 风格：get/add/update/delete + 资源名称
- 批量操作：batch + 操作 + 资源名称（如 `batchDeleteItems`）
- 示例：
  - `getList` - 获取列表
  - `getDetail` - 获取详情
  - `addItem` - 添加
  - `updateItem` - 更新
  - `deleteItem` - 删除
  - `batchDeleteItems` - 批量删除

#### 清理脚本规范
- **清理脚本已固定**：`scripts/clean-demo-modules.js` 已配置好保留的模块列表
- **实现新功能时不需要更新清理脚本**
- 清理脚本会自动保留配置中指定的模块


### 组件使用规范

#### 滚动条组件
- **必须使用 Element Plus 的 **`el-scrollbar`** 组件**，不使用原生浏览器滚动条
- **适用场景**：所有需要滚动的内容区域（表单页面、详情页面、长列表等）
- **基本用法**：
```vue
<template>
<div class="page-container">
<!-- 固定内容（如面包屑）放在外面 -->
<el-card class="breadcrumb-card">
<!-- 面包屑内容 -->
</el-card>

<!-- 需要滚动的内容包裹在 el-scrollbar 中 -->
<el-scrollbar class="content-scrollbar">
<!-- 可滚动的内容 -->
</el-scrollbar>
</div>
</template>

<style scoped lang="scss">
.page-container {
height: 100%;
display: flex;
flex-direction: column;
gap: 16px;
}

.content-scrollbar {
flex: 1;
overflow: hidden;

:deep(.el-scrollbar__view) {
padding-bottom: 20px;  // 底部留白
}
}
</style>
```

**关键点**：
- 固定内容（如面包屑、顶部操作栏）放在 `el-scrollbar` 外面
- 可滚动内容包裹在 `el-scrollbar` 内
- 滚动容器使用 `flex: 1` 占据剩余空间
- 滚动视图底部添加 `padding-bottom: 20px` 确保底部有空隙
- ❌ 错误：使用 `overflow-y: auto` 创建原生滚动条
- ✅ 正确：使用 `<el-scrollbar>` 组件

#### 表格组件
- 使用 Element Plus 的 ElTable，不使用项目内 artTable 组件
- **表格边框**：默认不使用 `border` 属性，表格只有横向分隔线，没有竖边框
  - ✅ 正确：`<el-table :data="tableData" height="100%">`
  - ❌ 错误：`<el-table :data="tableData" height="100%" border>`
  - 除非特殊说明需要完整边框，否则都不添加 `border` 属性
- 表头固定：给 ElTable 添加 `height="100%"` 属性
- 表格容器：设置 `flex: 1; overflow: hidden;`
- 树形表格：使用 `row-key="id"` 和 `:tree-props="{ children: 'children' }"`
- 列宽建议：操作列 200px，状态列 100px，时间列 180px
- 表头不能滚动，数据滚动

#### 按钮规范

**按钮分类**：
- **操作按钮**：面包屑区域、卡片头部的功能按钮（如"保存草稿"、"发布考试"、"创建考试"）
- **表格按钮**：表格操作列中的按钮（如"编辑"、"删除"、"查看详情"）
- **返回按钮**：面包屑左侧的返回按钮

**按钮间距**：
- 按钮组使用 `.el-button:not(:first-child) { margin-left: 12px; }` 控制间距
- 不使用 `gap` 属性，因为按钮本身有 `margin-left: 12px`
- 示例：
```scss
.filter-buttons {
display: flex;

.el-button:not(:first-child) {
margin-left: 12px;
}
}
```

**按钮类型**：
- 主要操作：`type="primary"`（如"搜索"、"保存"、"确定"）
- 次要操作：不设置 type（如"重置"、"取消"）
- 危险操作：`type="danger"`（如"删除"）
- 成功操作：`type="success"`（如"发布"）
- 警告操作：`type="warning"`（如"警告"、"发布考试"）

**按钮尺寸**：
- 默认尺寸：不设置 size（用于表单、筛选区域、操作按钮）
- 小尺寸：`size="small"`（用于特殊场景）
- 大尺寸：`size="large"`（用于重要的主操作）

**按钮图标**：
- 使用 Element Plus 图标：`<el-icon><Plus /></el-icon>`
- 图标位置：图标在文字左侧
- 示例：
```vue
<el-button type="primary">
<el-icon><Plus /></el-icon>
新增
</el-button>
```

**⚠️ 操作按钮规范**（面包屑区域、卡片头部）：
- **保持 Element Plus 默认样式**，不添加自定义的 font-size、color、padding 等样式
- **不添加 **`size`** 属性**（保持默认尺寸）
- 根据操作性质设置 `type` 属性
- 可以添加图标使用 `:icon` 属性
- 示例：
```vue
<!-- 面包屑操作按钮 -->
<div class="breadcrumb-actions">
<el-button :icon="FolderOpened" @click="handleSaveDraft">保存草稿</el-button>
<el-button type="warning" :icon="Upload" @click="handleSubmit">发布考试</el-button>
</div>

<!-- 卡片头部操作按钮 -->
<div class="header-buttons">
<el-button type="primary" @click="handleCreate">
<el-icon><Plus /></el-icon>
创建考试
</el-button>
<el-button type="danger" @click="handleBatchDelete">
批量删除
</el-button>
</div>
```
- ❌ 错误：给操作按钮添加自定义样式
```scss
// ❌ 错误：不要这样写
.breadcrumb-content .el-button {
font-size: 14px;
color: #606266;
padding: 0;
}
```
- ✅ 正确：只给特定按钮（如返回按钮）添加样式
```scss
// ✅ 正确：使用精确的选择器
.breadcrumb-left .el-button {
font-size: 14px;
color: #606266;
padding: 0;
}
```

**⚠️ 表格操作列按钮规范**：
- **必须使用 **`link`** 类型**，不使用 `text` 类型
- **不添加 **`size`** 属性**（保持默认尺寸）
- 根据操作性质设置 `type` 属性
- Element Plus 的 `link` 类型按钮自带合适的间距
- 示例：
```vue
<el-table-column label="操作" width="200" fixed="right">
<template #default="{ row }">
<el-button link @click="handleEdit(row)">
编辑
</el-button>
<el-button link type="danger" @click="handleDelete(row)">
删除
</el-button>
<el-button link type="primary" @click="handleView(row)">
查看详情
</el-button>
</template>
</el-table-column>
```
- ❌ 错误：`<el-button text size="small">` 或 `<el-button link size="small">`
- ✅ 正确：`<el-button link>`

**返回按钮规范**（面包屑左侧）：
- 使用 `text` 类型
- 可以添加自定义样式，但 CSS 选择器必须精确，避免影响其他按钮
- 示例：
```vue
<div class="breadcrumb-left">
<el-button text @click="handleBack">
<el-icon><ArrowLeft /></el-icon>
返回考试列表
</el-button>
<span class="divider">|</span>
<span class="page-info">创建考试</span>
</div>
```
```scss
.breadcrumb-left {
display: flex;
align-items: center;
gap: 12px;

.el-button {
font-size: 14px;
color: #606266;
padding: 0;

&:hover {
color: var(--el-color-primary);
}

.el-icon {
font-size: 16px;
}
}
}
```

#### 拖动排序规范

使用 `vue-draggable-plus` 库实现拖动排序功能。

**安装依赖**：
```bash
pnpm add vue-draggable-plus
```

**基本用法**：
```vue
<template>
  <VueDraggable
    v-model="list"
    :animation="200"
    handle=".drag-handle"
    @end="handleDragEnd"
    class="draggable-container"
  >
    <el-card
      v-for="item in list"
      :key="item.id"
      class="draggable-item"
    >
      <span class="drag-handle" style="cursor: move; margin-right: 8px; color: #909399">
        ☰
      </span>
      <span>{{ item.name }}</span>
    </el-card>
  </VueDraggable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const list = ref([
  { id: 1, name: '项目1', order: 1 },
  { id: 2, name: '项目2', order: 2 },
  { id: 3, name: '项目3', order: 3 }
])

const handleDragEnd = () => {
  // 更新排序
  list.value.forEach((item, index) => {
    item.order = index + 1
  })
  // 调用 API 保存排序
  // updateOrder(list.value)
}
</script>
```

**关键配置**：
- `v-model`：绑定数据列表
- `:animation="200"`：拖动动画时长（毫秒）
- `handle=".drag-handle"`：指定拖动手柄的 CSS 选择器
- `@end`：拖动结束事件，用于保存排序
- `class="draggable-container"`：容器样式类

**拖动手柄样式**：
```scss
.drag-handle {
  cursor: move;
  margin-right: 8px;
  color: #909399;
  font-size: 16px;

  &:hover {
    color: #606266;
  }
}
```

**注意事项**：
- 必须为每个项目设置唯一的 `key`（通常使用 `id`）
- 拖动手柄使用 `☰` 符号（Unicode: U+2630）
- 拖动结束后需要更新每个项目的 `order` 字段
- 建议在拖动结束后调用 API 保存新的排序
- 容器需要设置合适的样式以确保拖动体验良好

**完整示例（带 API 调用）**：
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { updateOrder } from '@/api/example'

const list = ref([
  { id: 1, name: '项目1', order: 1 },
  { id: 2, name: '项目2', order: 2 },
  { id: 3, name: '项目3', order: 3 }
])

const handleDragEnd = async () => {
  // 更新排序
  list.value.forEach((item, index) => {
    item.order = index + 1
  })

  try {
    // 调用 API 保存排序
    await updateOrder(list.value.map(item => ({ id: item.id, order: item.order })))
    ElMessage.success('排序已保存')
  } catch (error) {
    ElMessage.error('保存排序失败')
    // 可以考虑重新加载数据恢复原始排序
  }
}
</script>
```

## 常见问题

**Q: page-generator 生成的代码不符合项目风格？**
A: 确认 AI 已读取本文 [核心开发规范](#核心开发规范) 与 [布局规范](#布局规范)，并加载 `.agents/knowledge/ui-libs/element-plus/pages.md`；参考模块可选 `src/views/permission/role/index.vue` 等同类型页面。

**Q: Mock 数据增删改后刷新又恢复？**
A: 确认 Mock 变量在模块顶层声明，参见本文 [Mock 数据处理规范](#mock-数据处理规范) 与 `.agents/knowledge/conventions/mock.md`。
