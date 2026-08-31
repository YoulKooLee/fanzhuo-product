/**
 * 组织管理相关 API
 */

import request from '@/utils/http'
import type { Department, AdminUser, Position, Menu, Role } from '@/types/api'
import {
  getDepartmentListMock,
  addDepartmentMock,
  updateDepartmentMock,
  deleteDepartmentMock,
  updateDepartmentStatusMock,
  getUserListMock,
  addUserMock,
  updateUserMock,
  deleteUserMock,
  batchDeleteUsersMock,
  updateUserStatusMock,
  batchSetPositionMock,
  batchSetRoleMock,
  getRoleListMock,
  addRoleMock,
  updateRoleMock,
  deleteRoleMock,
  updateRoleStatusMock,
  assignRolePermissionsMock,
  getPositionListMock,
  addPositionMock,
  updatePositionMock,
  deletePositionMock,
  updatePositionStatusMock,
  getMenuListMock,
  addMenuMock,
  updateMenuMock,
  deleteMenuMock,
  updateMenuStatusMock
} from '@/mock/organization'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取部门列表
 */
export function getDepartmentList(params?: { name?: string; status?: number | string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getDepartmentListMock(params)
        resolve({
          code: 200,
          data,
          message: '获取部门列表成功'
        })
      }, 300)
    })
  }

  return request.get<Department[]>({
    url: '/admin/organization/department/list',
    params
  })
}

/**
 * 新增部门
 */
export function addDepartment(data: Partial<Department>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = addDepartmentMock(data)
          resolve({
            code: 200,
            data: result,
            message: '新增部门成功'
          })
        } catch (error: any) {
          reject(new Error(error.message || '新增部门失败'))
        }
      }, 300)
    })
  }

  return request.post<Department>({
    url: '/admin/organization/department/add',
    data
  })
}

/**
 * 更新部门
 */
export function updateDepartment(id: number, data: Partial<Department>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateDepartmentMock(id, data)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新部门成功'
            })
          } else {
            reject(new Error('部门不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新部门失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/department/${id}`,
    data
  })
}

/**
 * 删除部门
 */
export function deleteDepartment(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = deleteDepartmentMock(id)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '删除部门成功'
            })
          } else {
            reject(new Error('部门不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '删除部门失败'))
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/organization/department/${id}`
  })
}

/**
 * 更新部门状态
 */
export function updateDepartmentStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateDepartmentStatusMock(id, status)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新状态成功'
            })
          } else {
            reject(new Error('部门不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新状态失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/department/${id}/status`,
    data: { status }
  })
}

// ================================ 用户管理 API ================================

/**
 * 获取用户列表
 */
export function getUserList(params?: {
  keyword?: string
  departmentId?: number
  status?: number | string
  page?: number
  pageSize?: number
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getUserListMock(params)
        resolve({
          code: 200,
          data: result,
          message: '获取用户列表成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/organization/user/list',
    params
  })
}

/**
 * 新增用户
 */
export function addUser(data: Partial<AdminUser>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = addUserMock(data)
          resolve({
            code: 200,
            data: result,
            message: '新增用户成功'
          })
        } catch (error: any) {
          reject(new Error(error.message || '新增用户失败'))
        }
      }, 300)
    })
  }

  return request.post<AdminUser>({
    url: '/admin/organization/user/add',
    data
  })
}

/**
 * 更新用户
 */
export function updateUser(id: number, data: Partial<AdminUser>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateUserMock(id, data)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新用户成功'
            })
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新用户失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/user/${id}`,
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = deleteUserMock(id)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '删除用户成功'
            })
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '删除用户失败'))
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/organization/user/${id}`
  })
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = batchDeleteUsersMock(ids)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '批量删除成功'
            })
          } else {
            reject(new Error('批量删除失败'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '批量删除失败'))
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/organization/user/batch-delete',
    data: { ids }
  })
}

/**
 * 更新用户状态
 */
export function updateUserStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updateUserStatusMock(id, status)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新状态成功'
            })
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新状态失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/user/${id}/status`,
    data: { status }
  })
}

/**
 * 批量设置岗位
 */
export function batchSetPosition(ids: number[], positionId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = batchSetPositionMock(ids, positionId)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '设置岗位成功'
            })
          } else {
            reject(new Error('设置岗位失败'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '设置岗位失败'))
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/organization/user/batch-set-position',
    data: { ids, positionId }
  })
}

/**
 * 批量设置角色
 */
export function batchSetRole(ids: number[], roleIds: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = batchSetRoleMock(ids, roleIds)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '设置角色成功'
            })
          } else {
            reject(new Error('设置角色失败'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '设置角色失败'))
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/organization/user/batch-set-role',
    data: { ids, roleIds }
  })
}

// ================================ 岗位管理 API ================================

/**
 * 获取岗位列表
 */
export function getPositionList(params?: {
  keyword?: string
  status?: number | string
  page?: number
  pageSize?: number
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getPositionListMock(params)
        resolve({
          code: 200,
          data: result,
          message: '获取岗位列表成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/organization/position/list',
    params
  })
}

/**
 * 新增岗位
 */
export function addPosition(data: Partial<Position>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = addPositionMock(data)
          resolve({
            code: 200,
            data: result,
            message: '新增岗位成功'
          })
        } catch (error: any) {
          reject(new Error(error.message || '新增岗位失败'))
        }
      }, 300)
    })
  }

  return request.post<Position>({
    url: '/admin/organization/position/add',
    data
  })
}

/**
 * 更新岗位
 */
export function updatePosition(id: number, data: Partial<Position>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updatePositionMock(id, data)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新岗位成功'
            })
          } else {
            reject(new Error('岗位不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新岗位失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/position/${id}`,
    data
  })
}

/**
 * 删除岗位
 */
export function deletePosition(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = deletePositionMock(id)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '删除岗位成功'
            })
          } else {
            reject(new Error('岗位不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '删除岗位失败'))
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/organization/position/${id}`
  })
}

/**
 * 更新岗位状态
 */
export function updatePositionStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = updatePositionStatusMock(id, status)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '更新状态成功'
            })
          } else {
            reject(new Error('岗位不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新状态失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/organization/position/${id}/status`,
    data: { status }
  })
}

// ==================== 菜单管理 ====================

/**
 * 获取菜单列表
 */
export function getMenuList(params?: { name?: string; status?: number }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getMenuListMock(params)
        resolve(result)
      }, 300)
    })
  }

  return request.get({
    url: '/admin/permission/menu/list',
    params
  })
}

/**
 * 新增菜单
 */
export function addMenu(data: Partial<Menu>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = addMenuMock(data)
          resolve(result)
        } catch (error: any) {
          reject(new Error(error.message || '新增失败'))
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/permission/menu',
    data
  })
}

/**
 * 更新菜单
 */
export function updateMenu(id: number, data: Partial<Menu>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateMenuMock(id, data)
          resolve(result)
        } catch (error: any) {
          reject(new Error(error.message || '更新失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/menu/${id}`,
    data
  })
}

/**
 * 删除菜单
 */
export function deleteMenu(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = deleteMenuMock(id)
          resolve(result)
        } catch (error: any) {
          reject(new Error(error.message || '删除失败'))
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/permission/menu/${id}`
  })
}

/**
 * 更新菜单状态
 */
export function updateMenuStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateMenuStatusMock(id, status)
          resolve(result)
        } catch (error: any) {
          reject(new Error(error.message || '更新状态失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/menu/${id}/status`,
    data: { status }
  })
}

// ==================== 角色管理 ====================

/**
 * 获取角色列表
 */
export function getRoleList(params?: {
  name?: string
  status?: number
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
          message: '获取成功'
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
            message: '新增成功'
          })
        } catch (error: any) {
          reject(new Error(error.message || '新增失败'))
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/permission/role',
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
              message: '更新成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '更新失败'))
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
              message: '删除成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '删除失败'))
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
 * 分配角色权限
 */
export function assignRolePermissions(id: number, menuIds: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const success = assignRolePermissionsMock(id, menuIds)
          if (success) {
            resolve({
              code: 200,
              data: null,
              message: '分配权限成功'
            })
          } else {
            reject(new Error('角色不存在'))
          }
        } catch (error: any) {
          reject(new Error(error.message || '分配权限失败'))
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/permission/role/${id}/permissions`,
    data: { menuIds }
  })
}
