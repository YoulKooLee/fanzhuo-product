import avatar1 from '@/assets/img/avatar/avatar1.webp'

/**
 * Mock 登录数据
 * 用于前端原型演示，无需后端 API
 */

// Mock 用户数据
export const MOCK_USERS = [
  {
    username: 'admin',
    password: '123456',
    userInfo: {
      id: 1,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: null,
      updateBy: null,
      username: 'admin',
      nickname: '超级管理员',
      email: '20841030@qq.com',
      phone: '13800138000',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '系统超级管理员',
      departmentId: 1,
      department: {
        id: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: null,
        updateBy: null,
        departmentName: '总经办',
        departmentCode: 'CEO_OFFICE',
        parentId: null,
        type: 'company',
        companyId: 1,
        status: 1,
        sort: 1,
        managerId: 1,
        managerName: '超级管理员',
        phone: '13800138000',
        email: '20841030@qq.com'
      },
      roles: [
        {
          id: 1,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: null,
          updateBy: null,
          name: '超级管理员',
          code: 'R_SUPER',
          description: '拥有系统全部权限',
          permissions: null,
          status: 1,
          sort: 1,
          isSystem: 1
        }
      ],
      buttons: ['user:add', 'user:edit', 'user:delete', 'role:add', 'role:edit', 'role:delete']
    }
  },
  {
    username: 'user',
    password: '123456',
    userInfo: {
      id: 2,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'user',
      nickname: '普通用户',
      email: 'user@example.com',
      phone: '13800138001',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '普通用户账号',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '产品部',
        departmentCode: 'PRODUCT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 2,
        managerId: 2,
        managerName: '普通用户',
        phone: '13800138001',
        email: 'user@example.com'
      },
      roles: [
        {
          id: 3,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '普通用户',
          code: 'R_USER',
          description: '拥有系统普通权限',
          permissions: null,
          status: 1,
          sort: 3,
          isSystem: 0
        }
      ],
      buttons: ['user:view']
    }
  }
]

/**
 * Mock 登录函数
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据
 */
export function mockLogin(username: string, password: string): Api.Auth.LoginResponse | null {
  const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

  if (!user) {
    return null
  }

  // 生成 Mock Token
  const token = `mock_token_${username}_${Date.now()}`
  const refreshToken = `mock_refresh_token_${username}_${Date.now()}`

  return {
    token,
    refreshToken,
    user: user.userInfo
  }
}

/**
 * Mock 获取用户信息
 * @param token Token
 * @returns 用户信息
 */
export function mockGetUserInfo(token: string): Api.Auth.UserInfo | null {
  // 从 token 中提取用户名
  const match = token.match(/mock_token_(\w+)_/)
  if (!match) {
    return null
  }

  const username = match[1]
  const user = MOCK_USERS.find((u) => u.username === username)

  return user ? user.userInfo : null
}

/**
 * ======================= 密码找回（邮箱）Mock =======================
 */

type PasswordResetRecord = {
  email: string
  resetId: string
  code: string
  used: boolean
}

// Mock 数据：重置记录（仅前端内存态）
let passwordResetRecords: Record<string, PasswordResetRecord> = {}

// Mock 数据：重置标识自增，避免 Date.now 造成“随机”感知
let nextResetId = 1

/**
 * 发送邮箱找回密码 Mock
 */
export function mockSendPasswordResetEmail(email: string): Api.Auth.SendPasswordResetEmailResponse {
  const user = MOCK_USERS.find((u) => u.userInfo.email === email)
  if (!user) {
    throw new Error('该邮箱未绑定任何账号')
  }

  const resetId = `mock_reset_${nextResetId++}`

  // Mock 统一验证码，避免随机数据
  const code = '123456'

  passwordResetRecords[resetId] = {
    email,
    resetId,
    code,
    used: false
  }

  return {
    resetId,
    code
  }
}

/**
 * 通过邮箱验证码重置密码 Mock
 */
export function mockResetPasswordByEmail(params: Api.Auth.ResetPasswordByEmailParams): Api.Auth.ResetPasswordByEmailResponse {
  const record = passwordResetRecords[params.resetId]
  if (!record) {
    throw new Error('重置标识无效')
  }
  if (record.used) {
    throw new Error('该重置已失效')
  }
  if (record.code !== params.code) {
    throw new Error('验证码错误')
  }

  const user = MOCK_USERS.find((u) => u.userInfo.email === record.email)
  if (!user) {
    throw new Error('该邮箱未绑定任何账号')
  }

  // 更新 Mock 用户密码（后续登录可用新密码）
  user.password = params.newPassword
  record.used = true

  return { success: true }
}

/**
 * Mock 菜单树数据（用于动态路由）
 */
export const MOCK_MENU_TREE = [
  {
    id: 100,
    name: 'SystemHome',
    path: '/system-home',
    component: 'index',
    meta: {
      title: '系统首页',
      icon: 'dashboard',
      isHideTab: false
    },
    children: [
      {
        id: 101,
        name: 'SystemHomePage',
        path: '/system-home',
        component: 'system-home/index',
        meta: {
          title: '系统首页',
          icon: 'dashboard',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: 'index',
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
      isHideTab: false
    },
    children: [
      {
        id: 11,
        name: 'DashboardConsole',
        path: '/dashboard/console',
        component: 'dashboard/console/index',
        meta: {
          title: '控制台',
          icon: 'console',
          isHideTab: false
        }
      },
      {
        id: 12,
        name: 'DashboardAnalysis',
        path: '/dashboard/analysis',
        component: 'dashboard/analysis/index',
        meta: {
          title: '分析页',
          icon: 'analysis',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Prototype',
    path: '/prototype',
    component: 'index',
    meta: {
      title: '原型中心',
      icon: 'prototype',
      isHideTab: false
    },
    children: [
      {
        id: 21,
        name: 'PrototypeList',
        path: '/prototype/list',
        component: 'prototype/list/index',
        meta: {
          title: '原型列表',
          icon: 'list',
          isHideTab: false
        }
      },
      {
        id: 22,
        name: 'PrototypeCategory',
        path: '/prototype/category',
        component: 'prototype/category/index',
        meta: {
          title: '原型分类',
          icon: 'category',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 3,
    name: 'ChartWorkshop',
    path: '/chart-workshop',
    component: 'index',
    meta: {
      title: '图表工作坊',
      icon: 'chart',
      isHideTab: false
    },
    children: [
      {
        id: 31,
        name: 'UserCharts',
        path: '/chart-workshop/user-charts',
        component: 'chart-workshop/user-charts/index',
        meta: {
          title: '我的图表',
          icon: 'user-chart',
          isHideTab: false
        }
      },
      {
        id: 32,
        name: 'ChartGallery',
        path: '/chart-workshop/gallery',
        component: 'chart-workshop/gallery/index',
        meta: {
          title: '图表画廊',
          icon: 'gallery',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 4,
    name: 'Template',
    path: '/template',
    component: 'index',
    meta: {
      title: '模板展示',
      icon: 'template',
      isHideTab: false
    },
    children: [
      {
        id: 41,
        name: 'TemplateCards',
        path: '/template/cards',
        component: 'template/cards/index',
        meta: {
          title: '卡片',
          icon: 'card',
          isHideTab: false
        }
      },
      {
        id: 42,
        name: 'TemplateCharts',
        path: '/template/charts',
        component: 'template/charts/index',
        meta: {
          title: '图表',
          icon: 'chart',
          isHideTab: false
        }
      }
    ]
  }
]

/**
 * Mock 获取用户菜单树
 * @returns 菜单树数据
 */
export function mockGetUserMenuTree() {
  return MOCK_MENU_TREE
}

/**
 * Mock 获取验证码
 * @returns 验证码数据
 */
export function mockGetCaptcha() {
  // 生成一个简单的 Mock 验证码 ID
  const captchaId = `mock_captcha_${Date.now()}`

  // 返回一个简单的 Base64 图片（1x1 透明像素）
  // 在 Mock 模式下，验证码不做实际验证
  const captchaImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Nb2NrIOmqjOivgTwvdGV4dD48L3N2Zz4='

  return {
    captchaId,
    captchaImage
  }
}
