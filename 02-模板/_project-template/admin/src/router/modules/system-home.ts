import { AppRouteRecord } from '@/types/router'

/**
 * 系统首页（登录后默认入口）
 */
export const systemHomeRoutes: AppRouteRecord = {
  path: '/system-home',
  name: 'SystemHome',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.systemHome.title',
    icon: '&#xe6cc;', // 首页（iconfont: shouye）
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'SystemHomePage',
      component: () => import('@/views/system-home/index.vue'),
      meta: {
        title: 'menus.systemHome.title',
        keepAlive: true,
        isHide: true
      }
    }
  ]
}
