import { createCrudMock } from '@/utils/crud'

export interface AdminUser {
  id: number
  username: string
  realName: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  departmentId?: number
  departmentName?: string
  positionName?: string
  roles?: { id: number; name: string }[]
  createTime: string
  updateTime: string
}

const mockUsers: AdminUser[] = [
  {
    id: 1,
    username: 'admin',
    realName: '陈景远',
    email: 'chenjy@zhiguanyun.com',
    phone: '13733457890',
    status: 1,
    departmentId: 21,
    departmentName: '研发中心',
    positionName: '技术总监',
    roles: [{ id: 1, name: '系统管理员' }],
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 2,
    username: 'linxf',
    realName: '林晓峰',
    email: 'linxf@zhiguanyun.com',
    phone: '13844561234',
    status: 1,
    departmentId: 21,
    departmentName: '研发中心',
    positionName: '高级工程师',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-02 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 3,
    username: 'huangzm',
    realName: '黄子墨',
    email: 'huangzm@zhiguanyun.com',
    phone: '13655672345',
    status: 1,
    departmentId: 22,
    departmentName: '市场拓展部',
    positionName: '市场经理',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 4,
    username: 'zhouwn',
    realName: '周婉宁',
    email: 'zhouwn@zhiguanyun.com',
    phone: '13566783456',
    status: 0,
    departmentId: 31,
    departmentName: '财务管理部',
    positionName: '财务主管',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-04 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 5,
    username: 'xujy',
    realName: '徐嘉怡',
    email: 'xujy@zhiguanyun.com',
    phone: '13477894567',
    status: 1,
    departmentId: 32,
    departmentName: '人力资源部',
    positionName: 'HR专员',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-05 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  }
]

export const userMock = createCrudMock<AdminUser>(mockUsers, {
  searchFields: ['realName', 'username', 'phone']
})
