/**
 * 组织管理 Mock 数据
 */

import type { Department, AdminUser, Role, Position, Menu } from '@/types/api'

// 模拟部门数据
const mockDepartments: Department[] = [
  {
    id: 1,
    name: '集团总部',
    parentId: null,
    code: 'HQ',
    type: '省公司',
    leader: '刘承安',
    phone: '13911235678',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00',
    children: [
      {
        id: 2,
        name: '杭州分公司',
        parentId: 1,
        code: 'HZ',
        type: '分公司',
        leader: '沈嘉禾',
        phone: '13922346789',
        sort: 1,
        status: 1,
        createTime: '2024-01-02 10:00:00',
        updateTime: '2025-03-01 09:00:00',
        children: [
          {
            id: 21,
            name: '研发中心',
            parentId: 2,
            code: 'HZ-RD',
            type: '部门',
            leader: '陈景远',
            phone: '13733457890',
            sort: 1,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          },
          {
            id: 22,
            name: '市场拓展部',
            parentId: 2,
            code: 'HZ-MKT',
            type: '部门',
            leader: '黄子墨',
            phone: '13644568901',
            sort: 2,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          }
        ]
      },
      {
        id: 3,
        name: '成都分公司',
        parentId: 1,
        code: 'CD',
        type: '分公司',
        leader: '韩博文',
        phone: '13555679012',
        sort: 2,
        status: 1,
        createTime: '2024-01-02 10:00:00',
        updateTime: '2025-03-01 09:00:00',
        children: [
          {
            id: 31,
            name: '财务管理部',
            parentId: 3,
            code: 'CD-FIN',
            type: '部门',
            leader: '周婉宁',
            phone: '13466780123',
            sort: 1,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          },
          {
            id: 32,
            name: '人力资源部',
            parentId: 3,
            code: 'CD-HR',
            type: '部门',
            leader: '徐嘉怡',
            phone: '13377891234',
            sort: 2,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          }
        ]
      }
    ]
  }
]

let nextDepartmentId = 100

// 模拟用户数据
const mockUsers: AdminUser[] = [
  {
    id: 1,
    username: 'admin',
    realName: '刘承安',
    phone: '13911235678',
    email: 'liuca@zhiguanyun.com',
    departmentId: 1,
    departmentName: '集团总部',
    positionId: 1,
    positionName: '总经理',
    roles: [{ id: 1, name: '超级管理员', code: 'super_admin' }],
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 2,
    username: 'chenjy',
    realName: '陈景远',
    phone: '13733457890',
    email: 'chenjy@zhiguanyun.com',
    departmentId: 21,
    departmentName: '杭州分公司/研发中心',
    positionId: 3,
    positionName: '技术总监',
    roles: [{ id: 2, name: '管理员', code: 'admin' }],
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 3,
    username: 'shenjh',
    realName: '沈嘉禾',
    phone: '13922346789',
    email: 'shenjh@zhiguanyun.com',
    departmentId: 2,
    departmentName: '杭州分公司',
    positionId: 2,
    positionName: '分公司经理',
    roles: [{ id: 2, name: '管理员', code: 'admin' }],
    status: 1,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 4,
    username: 'linxf',
    realName: '林晓峰',
    phone: '13844561234',
    email: 'linxf@zhiguanyun.com',
    departmentId: 21,
    departmentName: '杭州分公司/研发中心',
    positionId: 4,
    positionName: '高级工程师',
    roles: [{ id: 3, name: '普通用户', code: 'user' }],
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 5,
    username: 'huangzm',
    realName: '黄子墨',
    phone: '13655672345',
    email: 'huangzm@zhiguanyun.com',
    departmentId: 22,
    departmentName: '杭州分公司/市场拓展部',
    positionId: 3,
    positionName: '市场经理',
    roles: [{ id: 3, name: '普通用户', code: 'user' }],
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 6,
    username: 'hanbw',
    realName: '韩博文',
    phone: '13555679012',
    email: 'hanbw@zhiguanyun.com',
    departmentId: 3,
    departmentName: '成都分公司',
    positionId: 2,
    positionName: '分公司经理',
    roles: [{ id: 2, name: '管理员', code: 'admin' }],
    status: 1,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 7,
    username: 'zhouwn',
    realName: '周婉宁',
    phone: '13466780123',
    email: 'zhouwn@zhiguanyun.com',
    departmentId: 31,
    departmentName: '成都分公司/财务管理部',
    positionId: 3,
    positionName: '财务主管',
    roles: [{ id: 3, name: '普通用户', code: 'user' }],
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 8,
    username: 'xujy',
    realName: '徐嘉怡',
    phone: '13377891234',
    email: 'xujy@zhiguanyun.com',
    departmentId: 32,
    departmentName: '成都分公司/人力资源部',
    positionId: 4,
    positionName: 'HR专员',
    roles: [{ id: 3, name: '普通用户', code: 'user' }],
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  }
]

let nextUserId = 100

// 模拟岗位数据
const mockPositions: Position[] = [
  {
    id: 1,
    name: '总经理',
    code: 'CEO',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 2,
    name: '分公司经理',
    code: 'BRANCH_MANAGER',
    sort: 2,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 3,
    name: '部门经理',
    code: 'DEPT_MANAGER',
    sort: 3,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 4,
    name: '员工',
    code: 'STAFF',
    sort: 4,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  }
]

let nextPositionId = 10

// 模拟菜单数据（与左侧实际路由菜单一致）
const mockMenuData: Menu[] = [
  {
    id: 1,
    parentId: 0,
    name: 'SystemHome',
    title: '系统首页',
    type: 'menu',
    icon: '&#xe6cc;',
    path: '/system-home',
    component: '@/views/system-home/index.vue',
    permission: 'systemHome:view',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    parentId: 0,
    name: 'OrganizationTemplate',
    title: '企业管理',
    type: 'directory',
    icon: '&#xe831;',
    path: '/organization-template',
    sort: 2,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    children: [
      {
        id: 21,
        parentId: 2,
        name: 'OrganizationTemplateUser',
        title: '用户管理',
        type: 'menu',
        path: '/organization-template/user',
        component: '@/views/organization/user/index.vue',
        permission: 'organization:user:view',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 22,
        parentId: 2,
        name: 'OrganizationTemplateDepartment',
        title: '部门管理',
        type: 'menu',
        path: '/organization-template/department',
        component: '@/views/organization/department/index.vue',
        permission: 'organization:department:view',
        sort: 2,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      }
    ]
  },
  {
    id: 3,
    parentId: 0,
    name: 'PermissionTemplate',
    title: '权限管理',
    type: 'directory',
    icon: '&#xe75d;',
    path: '/permission-template',
    sort: 3,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    children: [
      {
        id: 31,
        parentId: 3,
        name: 'PermissionTemplateRole',
        title: '角色管理',
        type: 'menu',
        path: '/permission-template/role',
        component: '@/views/permission/role/index.vue',
        permission: 'permission:role:view',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 32,
        parentId: 3,
        name: 'PermissionTemplateMenu',
        title: '菜单管理',
        type: 'menu',
        path: '/permission-template/menu',
        component: '@/views/permission/menu/index.vue',
        permission: 'permission:menu:view',
        sort: 2,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      }
    ]
  },
  {
    id: 4,
    parentId: 0,
    name: 'SystemConfig',
    title: '系统配置',
    type: 'directory',
    icon: '&#xe7b9;',
    path: '/system-config',
    sort: 4,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    children: [
      {
        id: 41,
        parentId: 4,
        name: 'SystemConfigBasic',
        title: '平台参数',
        type: 'menu',
        path: '/system-config/basic',
        component: '@/views/SystemConfig/Basic/index.vue',
        permission: 'systemConfig:basic:view',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 42,
        parentId: 4,
        name: 'SystemConfigIssueType',
        title: '事项分类',
        type: 'menu',
        path: '/system-config/issue-type',
        component: '@/views/SystemConfig/IssueType/index.vue',
        permission: 'systemConfig:issueType:view',
        sort: 2,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 43,
        parentId: 4,
        name: 'SystemConfigVideoMonitor',
        title: '监控设备',
        type: 'menu',
        path: '/system-config/video-monitor',
        component: '@/views/SystemConfig/VideoMonitor/index.vue',
        permission: 'systemConfig:videoMonitor:view',
        sort: 3,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 44,
        parentId: 4,
        name: 'SystemConfigAnnouncement',
        title: '消息通知',
        type: 'menu',
        path: '/system-config/announcement',
        component: '@/views/SystemConfig/Announcement/index.vue',
        permission: 'systemConfig:announcement:view',
        sort: 4,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: 45,
        parentId: 4,
        name: 'SystemConfigDocument',
        title: '资料中心',
        type: 'menu',
        path: '/system-config/document',
        component: '@/views/SystemConfig/Document/index.vue',
        permission: 'systemConfig:document:view',
        sort: 5,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      }
    ]
  }
]

/**
 * 获取部门列表 Mock 函数
 */
export function getDepartmentListMock(params: any = {}) {
  const { name, status } = params || {}
  let filteredData = [...mockDepartments]

  // 筛选
  if (name) {
    filteredData = filterDepartmentsByName(filteredData, name)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filterDepartmentsByStatus(filteredData, statusValue)
  }

  return filteredData
}

/**
 * 递归筛选部门（按名称）
 */
function filterDepartmentsByName(departments: Department[], name: string): Department[] {
  return departments
    .map((dept) => {
      const matchesName = dept.name.includes(name)
      const filteredChildren = dept.children ? filterDepartmentsByName(dept.children, name) : []

      if (matchesName || filteredChildren.length > 0) {
        return {
          ...dept,
          children: filteredChildren.length > 0 ? filteredChildren : dept.children
        }
      }
      return null
    })
    .filter(Boolean) as Department[]
}

/**
 * 递归筛选部门（按状态）
 */
function filterDepartmentsByStatus(departments: Department[], status: number): Department[] {
  return departments
    .filter((dept) => dept.status === status)
    .map((dept) => ({
      ...dept,
      children: dept.children ? filterDepartmentsByStatus(dept.children, status) : []
    }))
}

/**
 * 添加部门 Mock 函数
 */
export function addDepartmentMock(data: Partial<Department>) {
  const newDepartment: Department = {
    id: nextDepartmentId++,
    name: data.name || '',
    parentId: data.parentId || null,
    code: data.code || '',
    type: data.type || '部门',
    leader: data.leader || '',
    phone: data.phone || '',
    sort: data.sort || 1,
    status: data.status || 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }

  if (data.parentId) {
    // 添加到父部门的 children
    const addToParent = (departments: Department[]): boolean => {
      for (const dept of departments) {
        if (dept.id === data.parentId) {
          if (!dept.children) {
            dept.children = []
          }
          dept.children.push(newDepartment)
          return true
        }
        if (dept.children && addToParent(dept.children)) {
          return true
        }
      }
      return false
    }
    addToParent(mockDepartments)
  } else {
    mockDepartments.push(newDepartment)
  }

  return newDepartment
}

/**
 * 更新部门 Mock 函数
 */
export function updateDepartmentMock(id: number, data: Partial<Department>) {
  const updateInTree = (departments: Department[]): boolean => {
    for (let i = 0; i < departments.length; i++) {
      if (departments[i].id === id) {
        departments[i] = {
          ...departments[i],
          ...data,
          updateTime: new Date().toLocaleString('zh-CN')
        }
        return true
      }
      if (departments[i].children && updateInTree(departments[i].children!)) {
        return true
      }
    }
    return false
  }

  return updateInTree(mockDepartments)
}

/**
 * 更新部门状态 Mock 函数
 */
export function updateDepartmentStatusMock(id: number, status: number) {
  const updateInTree = (departments: Department[]): boolean => {
    for (let i = 0; i < departments.length; i++) {
      if (departments[i].id === id) {
        departments[i].status = status
        departments[i].updateTime = new Date().toLocaleString('zh-CN')
        return true
      }
      if (departments[i].children && updateInTree(departments[i].children!)) {
        return true
      }
    }
    return false
  }

  return updateInTree(mockDepartments)
}

/**
 * 删除部门 Mock 函数
 */
export function deleteDepartmentMock(id: number) {
  const deleteFromTree = (departments: Department[]): boolean => {
    for (let i = 0; i < departments.length; i++) {
      if (departments[i].id === id) {
        departments.splice(i, 1)
        return true
      }
      if (departments[i].children && deleteFromTree(departments[i].children!)) {
        return true
      }
    }
    return false
  }

  if (deleteFromTree(mockDepartments)) {
    return true
  }
  throw new Error('部门不存在')
}

/**
 * 获取用户列表 Mock 函数
 */
export function getUserListMock(params: any = {}) {
  const { realName, username, phone, departmentId, status, page = 1, pageSize = 20 } = params || {}
  let filteredData = [...mockUsers]

  // 筛选
  if (realName) {
    filteredData = filteredData.filter((user) => user.realName?.includes(realName))
  }
  if (username) {
    filteredData = filteredData.filter((user) => user.username.includes(username))
  }
  if (phone) {
    filteredData = filteredData.filter((user) => user.phone?.includes(phone))
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter((user) => user.departmentId === deptId)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter((user) => user.status === statusValue)
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

/**
 * 添加用户 Mock 函数
 */
export function addUserMock(data: Partial<AdminUser>) {
  const newUser: AdminUser = {
    id: nextUserId++,
    username: data.username || '',
    realName: data.realName || '',
    phone: data.phone || '',
    email: data.email || '',
    departmentId: data.departmentId || 1,
    departmentName: data.departmentName || '',
    positionId: data.positionId || 1,
    positionName: data.positionName || '',
    roles: data.roles || [],
    status: data.status || 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  mockUsers.push(newUser)
  return newUser
}

/**
 * 更新用户 Mock 函数
 */
export function updateUserMock(id: number, data: Partial<AdminUser>) {
  const index = mockUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return true
  }
  return false
}

/**
 * 批量删除用户 Mock 函数
 */
export function batchDeleteUsersMock(ids: number[]) {
  ids.forEach((id) => {
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      mockUsers.splice(index, 1)
    }
  })
  return true
}

/**
 * 更新用户状态 Mock 函数
 */
export function updateUserStatusMock(id: number, status: number) {
  const index = mockUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    mockUsers[index].status = status
    mockUsers[index].updateTime = new Date().toLocaleString('zh-CN')
    return true
  }
  return false
}

/**
 * 批量设置岗位 Mock 函数
 */
export function batchSetPositionMock(ids: number[], positionId: number) {
  ids.forEach((id) => {
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      const position = mockPositions.find((p) => p.id === positionId)
      if (position) {
        mockUsers[index].positionId = positionId
        mockUsers[index].positionName = position.name
        mockUsers[index].updateTime = new Date().toLocaleString('zh-CN')
      }
    }
  })
  return true
}

/**
 * 批量设置角色 Mock 函数
 */
export function batchSetRoleMock(ids: number[], roleIds: number[]) {
  ids.forEach((id) => {
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      // 这里简化处理，实际应该从角色列表中获取
      mockUsers[index].roles = roleIds.map((roleId) => ({
        id: roleId,
        name: '角色',
        code: 'role'
      }))
      mockUsers[index].updateTime = new Date().toLocaleString('zh-CN')
    }
  })
  return true
}

/**
 * 删除用户 Mock 函数
 */
export function deleteUserMock(id: number) {
  const index = mockUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    mockUsers.splice(index, 1)
    return true
  }
  throw new Error('用户不存在')
}

/**
 * 获取岗位列表 Mock 函数
 */
export function getPositionListMock(params: any = {}) {
  const { name, status, page = 1, pageSize = 20 } = params || {}
  let filteredData = [...mockPositions]

  // 筛选
  if (name) {
    filteredData = filteredData.filter((position) => position.name.includes(name))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter((position) => position.status === statusValue)
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

/**
 * 添加岗位 Mock 函数
 */
export function addPositionMock(data: Partial<Position>) {
  const newPosition: Position = {
    id: nextPositionId++,
    name: data.name || '',
    code: data.code || '',
    sort: data.sort || 1,
    status: data.status || 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  mockPositions.push(newPosition)
  return newPosition
}

/**
 * 更新岗位 Mock 函数
 */
export function updatePositionMock(id: number, data: Partial<Position>) {
  const index = mockPositions.findIndex((position) => position.id === id)
  if (index !== -1) {
    mockPositions[index] = {
      ...mockPositions[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return true
  }
  return false
}

/**
 * 更新岗位状态 Mock 函数
 */
export function updatePositionStatusMock(id: number, status: number) {
  const index = mockPositions.findIndex((position) => position.id === id)
  if (index !== -1) {
    mockPositions[index].status = status
    mockPositions[index].updateTime = new Date().toLocaleString('zh-CN')
    return true
  }
  return false
}

/**
 * 删除岗位 Mock 函数
 */
export function deletePositionMock(id: number) {
  const index = mockPositions.findIndex((position) => position.id === id)
  if (index !== -1) {
    mockPositions.splice(index, 1)
    return true
  }
  throw new Error('岗位不存在')
}

// ==================== 角色管理 Mock 函数 ====================

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    description: '拥有大部分管理权限',
    sort: 2,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 3,
    name: '普通用户',
    code: 'user',
    description: '基础用户权限',
    sort: 3,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  }
]

let nextRoleId = 10

/**
 * 获取角色列表 Mock 函数
 */
export function getRoleListMock(params: any) {
  const { name, status, page = 1, pageSize = 20 } = params || {}
  let filteredData = [...mockRoles]

  // 筛选
  if (name) {
    filteredData = filteredData.filter((role) => role.name.includes(name))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter((role) => role.status === statusValue)
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

/**
 * 添加角色 Mock 函数
 */
export function addRoleMock(data: Partial<Role>) {
  const newRole: Role = {
    id: nextRoleId++,
    name: data.name || '',
    code: data.code || '',
    description: data.description || '',
    sort: data.sort || 1,
    status: data.status || 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  mockRoles.push(newRole)
  return newRole
}

/**
 * 更新角色 Mock 函数
 */
export function updateRoleMock(id: number, data: Partial<Role>) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index !== -1) {
    mockRoles[index] = {
      ...mockRoles[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return true
  }
  return false
}

/**
 * 删除角色 Mock 函数
 */
export function deleteRoleMock(id: number) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index !== -1) {
    mockRoles.splice(index, 1)
    return true
  }
  return false
}

/**
 * 更新角色状态 Mock 函数
 */
export function updateRoleStatusMock(id: number, status: number) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index !== -1) {
    mockRoles[index].status = status
    mockRoles[index].updateTime = new Date().toLocaleString('zh-CN')
    return true
  }
  return false
}

/**
 * 分配角色权限 Mock 函数
 */
export function assignRolePermissionsMock(id: number, menuIds: number[]) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index !== -1) {
    // 这里简化处理，实际应该存储角色和菜单的关联关系
    return true
  }
  return false
}

// ==================== 菜单管理 Mock 函数 ====================

/**
 * 获取菜单列表 Mock 函数
 */
export function getMenuListMock(params: any = {}) {
  return {
    code: 200,
    data: mockMenuData,
    message: '获取成功'
  }
}

/**
 * 添加菜单 Mock 函数
 */
export function addMenuMock(data: Partial<Menu>) {
  return {
    code: 200,
    data: { id: Date.now(), ...data },
    message: '添加成功'
  }
}

/**
 * 更新菜单 Mock 函数
 */
export function updateMenuMock(id: number, data: Partial<Menu>) {
  return {
    code: 200,
    data: null,
    message: '更新成功'
  }
}

/**
 * 删除菜单 Mock 函数
 */
export function deleteMenuMock(id: number) {
  return {
    code: 200,
    data: null,
    message: '删除成功'
  }
}

/**
 * 更新菜单状态 Mock 函数
 */
export function updateMenuStatusMock(id: number, status: number) {
  return {
    code: 200,
    data: null,
    message: '更新状态成功'
  }
}
