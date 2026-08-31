import { AppRouteRecord } from '@/types/router'

/**
 * 企业管理模版路由
 * 包含：用户管理、部门管理、岗位管理
 */
export const organizationTemplateRoutes: AppRouteRecord = {
  path: '/organization-template',
  name: 'OrganizationTemplate',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.organizationTemplate.title',
    icon: '&#xe831;', // 团队/组织（iconfont: tuandui3）
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'OrganizationTemplateIndex',
      component: () => import('@/views/organization/user/index.vue'),
      meta: {
        title: 'menus.organizationTemplate.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'user',
      name: 'OrganizationTemplateUser',
      component: () => import('@/views/organization/user/index.vue'),
      meta: {
        title: 'menus.organizationTemplate.user',
        keepAlive: true
      }
    },
    {
      path: 'department',
      name: 'OrganizationTemplateDepartment',
      component: () => import('@/views/organization/department/index.vue'),
      meta: {
        title: 'menus.organizationTemplate.department',
        keepAlive: true
      }
    }
  ]
}
