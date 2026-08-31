/**
 * namespace: Api
 *
 * 所有接口相关类型定义
 * 在.vue文件使用会报错，需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = any> {
      records: T[]
      current: number
      size: number
      total: number
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      userName: string
      password: string
      captchaCode: string
      captchaId: string
    }

    /** 角色信息 */
    interface Role {
      id: number
      createTime: string
      updateTime: string
      createBy: number | null
      updateBy: number | null
      name: string
      code: string
      description: string
      permissions: string | null
      status: number
      sort: number
      isSystem: number
    }

    /** 部门信息 */
    interface Department {
      id: number
      createTime: string
      updateTime: string
      createBy: number | null
      updateBy: number | null
      departmentName: string
      departmentCode: string
      parentId: number | null
      type: string
      companyId: number
      status: number
      sort: number
      managerId: number | null
      managerName: string | null
      phone: string | null
      email: string | null
    }

    /** 用户信息 */
    interface UserInfo {
      id: number
      createTime: string
      updateTime: string
      createBy: number | null
      updateBy: number | null
      username: string
      nickname: string
      email: string | null
      phone: string | null
      avatar: string | null
      status: number
      lastLoginTime: string
      lastLoginIp: string
      remark: string | null
      departmentId: number
      department: Department
      roles: Role[]
      // 按钮权限码（可选，后续实现）
      buttons?: string[]
    }

    /** 登录响应 */
    interface LoginResponse {
      token: string
      refreshToken: string
      user: UserInfo
    }

    /** 发送邮箱找回密码 */
    interface SendPasswordResetEmailParams {
      email: string
    }

    /** 发送邮箱找回密码响应数据 */
    interface SendPasswordResetEmailResponse {
      /** 找回标识（用于后续校验） */
      resetId: string
      /**
       * 演示用验证码（Mock 模式下返回；真实业务通常不直接返回）
       * 不返回时可为 undefined
       */
      code?: string
    }

    /** 重置密码（通过邮箱验证码） */
    interface ResetPasswordByEmailParams {
      resetId: string
      /** 邮箱验证码 */
      code: string
      /** 新密码 */
      newPassword: string
    }

    /** 重置密码响应数据 */
    interface ResetPasswordByEmailResponse {
      success: true
    }
  }

  /** 系统管理类型 */
  namespace SystemManage {
    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    interface UserListItem {
      id: number
      avatar: string
      status: string
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 用户搜索参数 */
    type UserSearchParams = Partial<
      Pick<UserListItem, 'id' | 'userName' | 'userGender' | 'userPhone' | 'userEmail' | 'status'> &
        Api.Common.CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    interface RoleListItem {
      roleId: number
      roleName: string
      roleCode: string
      description: string
      enabled: boolean
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'> &
        Api.Common.CommonSearchParams
    >
  }
}
