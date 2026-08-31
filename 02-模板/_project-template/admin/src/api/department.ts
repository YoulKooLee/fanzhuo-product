import { createCrudApi } from '@/utils/crud'
import { departmentMock, type Department } from '@/mock/department'

export const departmentApi = createCrudApi<Department>({
  baseUrl: '/admin/organization/department',
  mockFns: departmentMock
})

export type { Department }
