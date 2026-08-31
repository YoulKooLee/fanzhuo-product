/**
 * 示例：使用 CRUD 工具创建 API 函数
 * 这是一个完整的使用示例，展示如何用 3 行代码替代 100+ 行的传统写法
 */

import { createCrudApi } from '@/utils/crud'
import { productMock, type Product } from '@/mock/example-crud'

/**
 * 创建 CRUD API 函数
 * 只需 3 行代码，自动生成所有增删改查 API！
 */
export const productApi = createCrudApi<Product>({
  baseUrl: '/admin/product',
  mockFns: productMock
})

/**
 * 自动生成的 API 方法：
 * - productApi.getList(params) - 获取列表
 * - productApi.add(data) - 添加数据
 * - productApi.update(data) - 更新数据
 * - productApi.delete(id) - 删除数据
 * - productApi.batchDelete(ids) - 批量删除
 * - productApi.updateStatus(id, status) - 更新状态
 * - productApi.getDetail(id) - 获取详情
 */

/**
 * 使用示例：
 *
 * // 在页面中使用
 * import { productApi } from '@/api/example-crud'
 *
 * // 获取列表
 * const res = await productApi.getList({
 *   name: '笔记本',
 *   status: 1,
 *   page: 1,
 *   pageSize: 20
 * })
 * console.log(res.data.list, res.data.total)
 *
 * // 添加
 * await productApi.add({
 *   name: '新产品',
 *   category: '电子产品',
 *   price: 999,
 *   stock: 10,
 *   status: 1
 * })
 *
 * // 更新
 * await productApi.update({
 *   id: 1,
 *   price: 6999
 * })
 *
 * // 删除
 * await productApi.delete(1)
 *
 * // 批量删除
 * await productApi.batchDelete([1, 2, 3])
 *
 * // 更新状态
 * await productApi.updateStatus(1, 0)
 */

/**
 * 如果需要添加自定义方法，可以这样扩展：
 */
export const productApiExtended = {
  ...productApi,

  // 自定义方法：导出产品
  exportProducts: (ids: number[]) => {
    // 这里可以调用真实的 API
    console.log('导出产品:', ids)
  },

  // 自定义方法：批量更新价格
  batchUpdatePrice: (ids: number[], price: number) => {
    // 这里可以调用真实的 API
    console.log('批量更新价格:', ids, price)
  }
}
