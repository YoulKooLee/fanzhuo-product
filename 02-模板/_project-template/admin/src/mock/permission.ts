/**
 * 权限管理 Mock 数据
 */

import type { Role, Menu } from '@/types/api'

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    code: 'sys_admin',
    name: '系统管理员',
    description: '系统技术管理人员，拥有全量数据及系统管理功能权限',
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    userCount: 2,
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-01-07 10:00:00'
  },
  {
    id: 2,
    code: 'province_admin',
    name: '省公司管理员',
    description: '省公司级别的管理人员，可查看全省所有组织的风险数据',
    menuIds: [1, 2, 3, 4],
    userCount: 8,
    sort: 2,
    status: 1,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2025-01-06 15:30:00'
  },
  {
    id: 3,
    code: 'branch_admin',
    name: '分公司管理员',
    description: '分公司级别的管理人员，可查看本分公司及下属区/片公司、库站的风险数据',
    menuIds: [1, 2, 3, 4],
    userCount: 14,
    sort: 3,
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-01-05 09:20:00'
  },
  {
    id: 4,
    code: 'district_admin',
    name: '区/片公司管理员',
    description: '区/片公司级别的管理人员，可查看本区/片公司及下属库站的风险数据',
    menuIds: [1, 2, 3],
    userCount: 36,
    sort: 4,
    status: 1,
    createTime: '2024-01-04 10:00:00',
    updateTime: '2025-01-04 14:10:00'
  },
  {
    id: 5,
    code: 'station_admin',
    name: '库站管理员',
    description: '库站级别的管理人员，可查看和维护本库站的风险数据',
    menuIds: [1, 2, 3],
    userCount: 120,
    sort: 5,
    status: 1,
    createTime: '2024-01-05 10:00:00',
    updateTime: '2025-01-03 11:45:00'
  }
]

let nextRoleId = 6

// 模拟菜单数据（简化版，实际应该从菜单管理获取）
const mockMenus: Menu[] = [
  {
    id: 2,
    parentId: 0,
    name: 'report',
    title: '报表中心',
    type: 'directory',
    icon: '&#xe601;',
    sort: 2,
    status: 1,
    children: [
      {
        id: 21,
        parentId: 2,
        name: 'inspectionStatistics',
        title: '巡检统计',
        type: 'menu',
        path: '/report/inspection-statistics',
        sort: 1,
        status: 1
      },
      {
        id: 22,
        parentId: 2,
        name: 'equipmentStatistics',
        title: '设备统计',
        type: 'menu',
        path: '/report/equipment-statistics',
        sort: 2,
        status: 1
      }
    ]
  },
  {
    id: 3,
    parentId: 0,
    name: 'equipment',
    title: '设备管理',
    type: 'menu',
    icon: '&#xe602;',
    path: '/equipment',
    sort: 3,
    status: 1
  },
  {
    id: 4,
    parentId: 0,
    name: 'inspectionPoint',
    title: '巡检点管理',
    type: 'menu',
    icon: '&#xe603;',
    path: '/inspection-point',
    sort: 4,
    status: 1
  },
  {
    id: 5,
    parentId: 0,
    name: 'inspection',
    title: '巡检管理',
    type: 'directory',
    icon: '&#xe604;',
    sort: 5,
    status: 1,
    children: [
      {
        id: 51,
        parentId: 5,
        name: 'plan',
        title: '巡检计划',
        type: 'menu',
        path: '/inspection/plan',
        sort: 1,
        status: 1
      },
      {
        id: 52,
        parentId: 5,
        name: 'task',
        title: '任务管理',
        type: 'menu',
        path: '/inspection/task',
        sort: 2,
        status: 1
      }
    ]
  },
  {
    id: 6,
    parentId: 0,
    name: 'workOrder',
    title: '工单管理',
    type: 'menu',
    icon: '&#xe605;',
    path: '/work-order',
    sort: 6,
    status: 1
  },
  {
    id: 7,
    parentId: 0,
    name: 'basic',
    title: '基础管理',
    type: 'directory',
    icon: '&#xe606;',
    sort: 7,
    status: 1,
    children: [
      {
        id: 71,
        parentId: 7,
        name: 'equipmentCategory',
        title: '设备分类管理',
        type: 'menu',
        path: '/basic/equipment-category',
        sort: 1,
        status: 1
      },
      {
        id: 72,
        parentId: 7,
        name: 'equipmentLevel',
        title: '设备分级管理',
        type: 'menu',
        path: '/basic/equipment-level',
        sort: 2,
        status: 1
      },
      {
        id: 73,
        parentId: 7,
        name: 'inspectionChecklist',
        title: '检查项清单',
        type: 'menu',
        path: '/basic/inspection-checklist',
        sort: 3,
        status: 1
      }
    ]
  },
  {
    id: 8,
    parentId: 0,
    name: 'organization',
    title: '组织管理',
    type: 'directory',
    icon: '&#xe813;',
    sort: 8,
    status: 1,
    children: [
      {
        id: 81,
        parentId: 8,
        name: 'department',
        title: '部门管理',
        type: 'menu',
        path: '/organization/department',
        sort: 1,
        status: 1
      },
      {
        id: 82,
        parentId: 8,
        name: 'user',
        title: '用户管理',
        type: 'menu',
        path: '/organization/user',
        sort: 2,
        status: 1
      },
      {
        id: 83,
        parentId: 8,
        name: 'position',
        title: '岗位管理',
        type: 'menu',
        path: '/organization/position',
        sort: 3,
        status: 1
      }
    ]
  },
  {
    id: 9,
    parentId: 0,
    name: 'permission',
    title: '权限管理',
    type: 'directory',
    icon: '&#xe607;',
    sort: 9,
    status: 1,
    children: [
      {
        id: 91,
        parentId: 9,
        name: 'role',
        title: '角色管理',
        type: 'menu',
        path: '/permission/role',
        sort: 1,
        status: 1
      },
      {
        id: 92,
        parentId: 9,
        name: 'menu',
        title: '菜单管理',
        type: 'menu',
        path: '/permission/menu',
        sort: 2,
        status: 1
      }
    ]
  }
]

/**
 * 获取角色列表（支持分页）
 */
export function getRoleListMock(params?: {
  keyword?: string
  status?: number | string
  page?: number
  pageSize?: number
}) {
  let filteredRoles = [...mockRoles]

  // 关键词筛选
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredRoles = filteredRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) || role.code.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (params?.status !== undefined && params?.status !== '') {
    const status = Number(params.status)
    filteredRoles = filteredRoles.filter((role) => role.status === status)
  }

  const total = filteredRoles.length
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: filteredRoles.slice(start, end),
    total,
    page,
    pageSize
  }
}

/**
 * 新增角色
 */
export function addRoleMock(data: Partial<Role>) {
  const newRole: Role = {
    id: nextRoleId++,
    code: data.code || '',
    name: data.name || '',
    description: data.description,
    menuIds: data.menuIds || [],
    userCount: 0,
    sort: data.sort || 0,
    status: data.status ?? 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }

  mockRoles.unshift(newRole)
  return newRole
}

/**
 * 更新角色
 */
export function updateRoleMock(id: number, data: Partial<Role>) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index === -1) {
    return false
  }

  mockRoles[index] = {
    ...mockRoles[index],
    ...data,
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
  return true
}

/**
 * 删除角色
 */
export function deleteRoleMock(id: number) {
  const index = mockRoles.findIndex((role) => role.id === id)
  if (index === -1) {
    return false
  }

  mockRoles.splice(index, 1)
  return true
}

/**
 * 更新角色状态
 */
export function updateRoleStatusMock(id: number, status: number) {
  return updateRoleMock(id, { status })
}

/**
 * 获取角色的菜单权限
 */
export function getRoleMenusMock(id: number) {
  const role = mockRoles.find((role) => role.id === id)
  if (!role) {
    return []
  }
  return role.menuIds || []
}

/**
 * 更新角色的菜单权限
 */
export function updateRoleMenusMock(id: number, menuIds: number[]) {
  return updateRoleMock(id, { menuIds })
}

/**
 * 获取菜单列表（树形结构）
 */
export function getMenuListMock() {
  return mockMenus
}
