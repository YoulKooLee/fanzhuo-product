import { createCrudApi } from '@/utils/crud'
import { userMock, type AdminUser } from '@/mock/user'

export const userApi = createCrudApi<AdminUser>({
  baseUrl: '/admin/organization/user',
  mockFns: userMock
})

// 批量设置岗位
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function batchSetPosition(ids: number[], positionName: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        ids.forEach((id) => userMock.update({ id, positionName } as any))
        resolve({ code: 200, data: null, message: '设置岗位成功' })
      }, 300)
    })
  }
  return import('@/utils/http').then(({ default: request }) =>
    request.post({ url: '/admin/organization/user/batch-position', data: { ids, positionName } })
  )
}

// 批量设置角色
export function batchSetRole(ids: number[], roleIds: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: null, message: '设置角色成功' })
      }, 300)
    })
  }
  return import('@/utils/http').then(({ default: request }) =>
    request.post({ url: '/admin/organization/user/batch-role', data: { ids, roleIds } })
  )
}

export type { AdminUser }
