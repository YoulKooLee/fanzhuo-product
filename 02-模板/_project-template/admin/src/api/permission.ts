/**
 * 权限管理相关 API
 */

import request from '@/utils/http'
import type { Role, Menu } from '@/types/api'
import {
  getRoleListMock,
  addRoleMock,
  updateRoleMock,
  deleteRoleMock,
  updateRoleStatusMock,
  getRoleMenusMock,
  updateRoleMenusMock,
  getMenuListMock
} from '@/mock/permission'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取角色列表
 */
export function getRoleList(params?: {
  keyword?: string
  status?: number | string
  page?: number
  pageSize?: number
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getRoleListMock(params)
        resolve({
          code: 200,
          data: result,
          message: '获取角色列表成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/permission/role/list',
    params
  })
}

/**
 * 新增角色
 */
export function addRole(data: Partial<Role>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = addRoleMock(data)
          resolve({
            code: 200,
            data: result,
            message: '新增角色成功'
          })
        } catch (error: any) {
          reject(new Error(error.message || '新增角色失败'))
        }
      }, 300)
    })
  }

  return request.post<Role>({
    url: '/admin/permission/role/add',
    data
  })
}

/**
 * 更新角色
 */
export function updateRole(id: number, data: Partial<Role>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateRoleMock(id, data)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新角色成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新角色失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/role/${id}`,
    data
  })
}

/**
 * 删除角色
 */
export function deleteRole(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = deleteRoleMock(id)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '删除角色成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '删除角色失败'))
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/permission/role/${id}`
  })
}

/**
 * 更新角色状态
 */
export function updateRoleStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateRoleStatusMock(id, status)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新状态成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新状态失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/role/${id}/status`,
    data: { status }
  })
}

/**
 * 获取角色的菜单权限
 */
export function getRoleMenus(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const menuIds = getRoleMenusMock(id)
        resolve({
          code: 200,
          data: menuIds,
          message: '获取角色菜单权限成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: `/admin/permission/role/${id}/menus`
  })
}

/**
 * 更新角色的菜单权限
 */
export function updateRoleMenus(id: number, menuIds: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateRoleMenusMock(id, menuIds)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新菜单权限成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新菜单权限失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/role/${id}/menus`,
    data: { menuIds }
  })
}

/**
 * 获取菜单列表（树形结构）
 */
export function getMenuList() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const menus = getMenuListMock()
        resolve({
          code: 200,
          data: menus,
          message: '获取菜单列表成功'
        })
      }, 300)
    })
  }

  return request.get<Menu[]>({
    url: '/admin/permission/menu/list'
  })
}
