import { createCrudMock } from '@/utils/crud'

export interface Department {
  id: number
  parentId: number | null
  name: string
  code?: string
  type?: string
  leader?: string
  phone?: string
  sort?: number
  status?: number
  children?: Department[]
  createTime?: string
  updateTime?: string
}

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

export const departmentMock = createCrudMock<Department>(mockDepartments, {
  searchFields: ['name', 'code', 'leader'],
  isTree: true
})
