/**
 * API 响应统一类型定义
 * @description 定义后端API返回的标准格式
 */

/**
 * API响应基础接口
 * @template T data字段的类型
 */
export interface ApiResponse<T = any> {
  /** 状态码（200表示成功） */
  code: number
  /** 消息文本 */
  message: string
  /** 数据载荷 */
  data: T
  /** 成功标志 */
  success: boolean
  /** 时间戳 */
  timestamp: number
}

/**
 * 分页响应接口
 * @template T 列表项的类型
 */
export interface PaginationResponse<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
  /** 总页数（可选） */
  totalPages?: number
}

/**
 * 管理员用户接口
 */
export interface AdminUser {
  /** 用户ID */
  id: number
  /** 用户名（登录账号） */
  username: string
  /** 昵称 */
  nickname?: string
  /** 真实姓名 */
  realName?: string
  /** 头像URL */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 状态（1启用 0禁用） */
  status: number
  /** 部门ID */
  departmentId?: number
  /** 部门名称 */
  departmentName?: string
  /** 岗位 */
  position?: string
  /** 岗位ID */
  positionId?: number
  /** 岗位名称 */
  positionName?: string
  /** 部门全路径（用于显示） */
  departmentPath?: string
  /** 角色列表 */
  roles?: Role[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 最后登录IP */
  lastLoginIp?: string
  /** 备注 */
  remark?: string
}

/**
 * 注册用户接口
 */
export interface RegisteredUser {
  /** 用户ID */
  id: number
  /** 昵称 */
  nickname: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email?: string
  /** 头像URL */
  avatar?: string
  /** 状态（1启用 0禁用） */
  status: number
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 最后登录IP */
  lastLoginIp?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark?: string
}

/**
 * 角色接口
 */
export interface Role {
  /** 角色ID */
  id: number
  /** 角色代码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 菜单权限ID列表 */
  menuIds?: number[]
  /** 授权人数 */
  userCount?: number
  /** 排序 */
  sort?: number
  /** 状态（1启用 0禁用） */
  status?: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 菜单接口
 */
export interface Menu {
  /** 菜单ID */
  id: number
  /** 父级菜单ID */
  parentId?: number
  /** 菜单名称 */
  name: string
  /** 菜单标题 */
  title: string
  /** 菜单类型（directory=目录 menu=菜单 button=按钮） */
  type?: 'directory' | 'menu' | 'button'
  /** 菜单图标 */
  icon?: string
  /** 路由路径 */
  path?: string
  /** 组件路径 */
  component?: string
  /** 权限标识 */
  permission?: string
  /** 排序 */
  sort?: number
  /** 状态（1显示 0隐藏） */
  status?: number
  /** 子菜单 */
  children?: Menu[]
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 部门接口
 */
export interface Department {
  /** 部门ID */
  id: number
  /** 父级部门ID */
  parentId?: number | null
  /** 部门名称 */
  name: string
  /** 部门代码 */
  code?: string
  /** 部门类型 */
  type?: string
  /** 负责人 */
  leader?: string
  /** 联系电话 */
  phone?: string
  /** 排序 */
  sort?: number
  /** 状态（1启用 0禁用） */
  status?: number
  /** 子部门 */
  children?: Department[]
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 岗位接口
 */
export interface Position {
  /** 岗位ID */
  id: number
  /** 岗位编码 */
  code: string
  /** 岗位名称 */
  name: string
  /** 备注 */
  description?: string
  /** 排序 */
  sort?: number
  /** 状态（1启用 0禁用） */
  status?: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码（可选） */
  captcha?: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  /** 访问令牌 */
  token: string
  /** 刷新令牌 */
  refreshToken: string
  /** 用户信息 */
  user: AdminUser
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  /** 关键词（昵称/手机号） */
  keyword?: string
  /** 状态 */
  status?: number
  /** 页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 上传文件响应数据
 */
export interface UploadResponse {
  /** 文件URL（只上传文件，不更新数据库） */
  url: string
}

/**
 * 地图 GeoJSON 响应数据
 */
export interface MapGeoJsonResponse {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      name: string
      adcode: string
      center: [number, number]
      centroid: [number, number]
      childrenNum: number
      level: string
      parent: {
        adcode: string
      }
      subFeatureIndex: number
      acroutes: number[]
    }
    geometry: {
      type: 'MultiPolygon' | 'Polygon'
      coordinates: number[][][] | number[][][][]
    }
  }>
}

/**
 * 题库接口
 */
export interface QuestionBank {
  /** 题库ID */
  id: number
  /** 题库名称 */
  name: string
  /** 题库编码 */
  code?: string
  /** 题库描述 */
  description?: string
  /** 题目数量 */
  questionCount: number
  /** 排序号 */
  sort: number
  /** 状态（1启用 0停用） */
  status: number
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 题库查询参数
 */
export interface QuestionBankQueryParams {
  /** 题库名称 */
  name?: string
  /** 状态 */
  status?: number
  /** 创建时间范围 - 开始 */
  createTimeStart?: string
  /** 创建时间范围 - 结束 */
  createTimeEnd?: string
  /** 页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 题库表单数据
 */
export interface QuestionBankFormData {
  /** 题库ID（编辑时） */
  id?: number
  /** 题库名称 */
  name: string
  /** 题库编码 */
  code?: string
  /** 题库描述 */
  description?: string
  /** 排序号 */
  sort: number
  /** 状态（1启用 0停用） */
  status: number
}

/**
 * 题型枚举
 */
export enum QuestionType {
  /** 单选题 */
  SINGLE_CHOICE = 1,
  /** 多选题 */
  MULTIPLE_CHOICE = 2,
  /** 判断题 */
  TRUE_FALSE = 3,
  /** 填空题 */
  FILL_BLANK = 4,
  /** 简答题 */
  SHORT_ANSWER = 5
}

/**
 * 难度枚举
 */
export enum QuestionDifficulty {
  /** 简单 */
  EASY = 1,
  /** 中等 */
  MEDIUM = 2,
  /** 困难 */
  HARD = 3
}

/**
 * 题目接口
 */
export interface Question {
  /** 题目ID */
  id: number
  /** 所属题库ID */
  bankId: number
  /** 题型 */
  type: QuestionType
  /** 题干 */
  content: string
  /** 选项A */
  optionA?: string
  /** 选项B */
  optionB?: string
  /** 选项C */
  optionC?: string
  /** 选项D */
  optionD?: string
  /** 选项E */
  optionE?: string
  /** 选项F */
  optionF?: string
  /** 正确答案 */
  answer: string | string[]
  /** 答案解析 */
  analysis?: string
  /** 难度 */
  difficulty: QuestionDifficulty
  /** 分值 */
  score: number
  /** 标签 */
  tags?: string
  /** 知识点 */
  knowledge?: string
  /** 引用次数 */
  refCount: number
  /** 状态（1启用 0停用） */
  status: number
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 题目查询参数
 */
export interface QuestionQueryParams {
  /** 所属题库ID */
  bankId: number
  /** 关键词（题干） */
  keyword?: string
  /** 题型 */
  type?: QuestionType
  /** 难度 */
  difficulty?: QuestionDifficulty
  /** 状态 */
  status?: number
  /** 页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 题目表单数据
 */
export interface QuestionFormData {
  /** 题目ID（编辑时） */
  id?: number
  /** 所属题库ID */
  bankId: number
  /** 题型 */
  type: QuestionType
  /** 题干 */
  content: string
  /** 选项A */
  optionA?: string
  /** 选项B */
  optionB?: string
  /** 选项C */
  optionC?: string
  /** 选项D */
  optionD?: string
  /** 选项E */
  optionE?: string
  /** 选项F */
  optionF?: string
  /** 正确答案 */
  answer: string | string[]
  /** 答案解析 */
  analysis?: string
  /** 难度 */
  difficulty: QuestionDifficulty
  /** 分值 */
  score: number
  /** 标签 */
  tags?: string
  /** 知识点 */
  knowledge?: string
  /** 状态（1启用 0停用） */
  status: number
}
