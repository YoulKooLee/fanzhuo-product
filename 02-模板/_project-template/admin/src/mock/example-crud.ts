/**
 * 示例：使用 CRUD 工具创建 Mock 数据
 * 这是一个完整的使用示例，展示如何用 3 行代码替代 100+ 行的传统写法
 */

import { createCrudMock } from '@/utils/crud'

// 定义数据类型
export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: number
  description?: string
  createTime: string
  updateTime: string
}

// 初始数据
const mockProducts: Product[] = [
  {
    id: 1,
    name: '笔记本电脑',
    category: '电子产品',
    price: 5999,
    stock: 50,
    status: 1,
    description: '高性能办公笔记本',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '无线鼠标',
    category: '电子产品',
    price: 99,
    stock: 200,
    status: 1,
    description: '人体工学设计',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '机械键盘',
    category: '电子产品',
    price: 399,
    stock: 100,
    status: 0,
    description: '青轴机械键盘',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    name: '显示器',
    category: '电子产品',
    price: 1299,
    stock: 30,
    status: 1,
    description: '27寸 4K 显示器',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00'
  },
  {
    id: 5,
    name: '办公椅',
    category: '办公家具',
    price: 899,
    stock: 20,
    status: 1,
    description: '人体工学办公椅',
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00'
  }
]

/**
 * 创建 CRUD Mock 函数
 * 只需 3 行代码，自动生成所有增删改查方法！
 */
export const productMock = createCrudMock<Product>(mockProducts, {
  searchFields: ['name', 'category', 'description'], // 可模糊搜索的字段
  sortField: 'createTime' // 默认排序字段
})

/**
 * 自动生成的方法：
 * - productMock.getList(params) - 获取列表（支持分页、筛选、搜索）
 * - productMock.add(data) - 添加数据
 * - productMock.update(data) - 更新数据
 * - productMock.delete(id) - 删除数据
 * - productMock.batchDelete(ids) - 批量删除
 * - productMock.updateStatus(id, status) - 更新状态
 * - productMock.getDetail(id) - 获取详情
 * - productMock.getData() - 获取原始数据（调试用）
 */

/**
 * 使用示例：
 *
 * // 获取列表（带分页和筛选）
 * const result = productMock.getList({
 *   name: '笔记本',      // 模糊搜索
 *   status: 1,          // 精确匹配
 *   category: '电子产品', // 精确匹配
 *   page: 1,
 *   pageSize: 20
 * })
 * // 返回：{ list: [...], total: 5 }
 *
 * // 添加数据
 * const newProduct = productMock.add({
 *   name: '新产品',
 *   category: '电子产品',
 *   price: 999,
 *   stock: 10,
 *   status: 1
 * })
 *
 * // 更新数据
 * productMock.update({
 *   id: 1,
 *   price: 6999,
 *   stock: 45
 * })
 *
 * // 删除数据
 * productMock.delete(1)
 *
 * // 批量删除
 * productMock.batchDelete([1, 2, 3])
 *
 * // 更新状态
 * productMock.updateStatus(1, 0)
 */
