import { AppRouteRecord } from '@/types/router'

/**
 * 系统配置路由
 * 包含：平台参数、事项分类、监控设备、消息通知、资料中心
 */
export const systemConfigRoutes: AppRouteRecord = {
  path: '/system-config',
  name: 'SystemConfig',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.systemConfig.title',
    icon: '&#xe7b9;', // 设置图标
    isFirstLevel: true
  },
  children: [
    {
      path: 'basic',
      name: 'SystemConfigBasic',
      component: () => import('@/views/SystemConfig/Basic/index.vue'),
      meta: {
        title: 'menus.systemConfig.basic',
        keepAlive: true
      }
    },
    {
      path: 'issue-type',
      name: 'SystemConfigIssueType',
      component: () => import('@/views/SystemConfig/IssueType/index.vue'),
      meta: {
        title: 'menus.systemConfig.issueType',
        keepAlive: true
      }
    },
    {
      path: 'video-monitor',
      name: 'SystemConfigVideoMonitor',
      component: () => import('@/views/SystemConfig/VideoMonitor/index.vue'),
      meta: {
        title: 'menus.systemConfig.videoMonitor',
        keepAlive: true
      }
    },
    {
      path: 'announcement',
      name: 'SystemConfigAnnouncement',
      component: () => import('@/views/SystemConfig/Announcement/index.vue'),
      meta: {
        title: 'menus.systemConfig.announcement',
        keepAlive: true
      }
    },
    {
      path: 'document',
      name: 'SystemConfigDocument',
      component: () => import('@/views/SystemConfig/Document/index.vue'),
      meta: {
        title: 'menus.systemConfig.document',
        keepAlive: true
      }
    }
  ]
}
