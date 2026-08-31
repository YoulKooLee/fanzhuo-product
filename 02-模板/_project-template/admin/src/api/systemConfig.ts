/**
 * 系统配置模块 API
 * 包含：基础配置、问题类型、视频监控配置、通知公告、制度文档
 */

import { createCrudApi } from '@/utils/crud'
import request from '@/utils/http'
import {
  basicConfigData,
  issueTypeMock,
  videoMonitorMock,
  announcementMock,
  documentMock,
  type BasicConfig,
  type IssueType,
  type VideoMonitor,
  type Announcement,
  type PolicyDocument
} from '@/mock/systemConfig'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// ─── 基础配置 ───────────────────────────────────────────────────────────────

/** 获取基础配置 */
export function getBasicConfig(): Promise<any> {
  if (USE_MOCK) {
    return delay().then(() => ({ code: 200, data: { ...basicConfigData }, message: '获取成功' }))
  }
  return request.get({ url: '/admin/system-config/basic' })
}

/** 保存基础配置 */
export function saveBasicConfig(data: BasicConfig): Promise<any> {
  if (USE_MOCK) {
    return delay().then(() => {
      Object.assign(basicConfigData, data)
      return { code: 200, data: null, message: '配置已保存，刷新页面后生效' }
    })
  }
  return request.put({ url: '/admin/system-config/basic', data })
}

// ─── 问题类型 ───────────────────────────────────────────────────────────────

export const issueTypeApi = createCrudApi<IssueType>({
  baseUrl: '/admin/system-config/issue-type',
  mockFns: issueTypeMock
})

/** 获取业务主管人员列表（用于默认审核人下拉） */
export function getReviewerOptions(): Promise<any> {
  if (USE_MOCK) {
    return delay().then(() => ({
      code: 200,
      data: [
        { id: 1, name: '陈明' },
        { id: 2, name: '刘芳' },
        { id: 3, name: '周杰' },
        { id: 4, name: '吴敏' }
      ],
      message: '获取成功'
    }))
  }
  return request.get({ url: '/admin/organization/user/list', params: { role: 'business_manager' } })
}

// ─── 视频监控配置 ────────────────────────────────────────────────────────────

export const videoMonitorApi = createCrudApi<VideoMonitor>({
  baseUrl: '/admin/system-config/video-monitor',
  mockFns: videoMonitorMock
})

/** 连接测试 */
export function testVideoConnection(id: number): Promise<any> {
  if (USE_MOCK) {
    return delay(800).then(() => ({
      code: 200,
      data: null,
      message: '连接成功'
    }))
  }
  return request.post({ url: `/admin/system-config/video-monitor/test/${id}` })
}

// ─── 通知公告 ───────────────────────────────────────────────────────────────

export const announcementApi = createCrudApi<Announcement>({
  baseUrl: '/admin/system-config/announcement',
  mockFns: announcementMock
})

/** 发布公告 */
export function publishAnnouncement(id: number): Promise<any> {
  if (USE_MOCK) {
    return delay().then(() => {
      announcementMock.update({
        id,
        status: 'published',
        publishTime: new Date().toLocaleString('zh-CN', { hour12: false })
      } as any)
      return { code: 200, data: null, message: '发布成功' }
    })
  }
  return request.put({ url: `/admin/system-config/announcement/publish/${id}` })
}

/** 撤回公告 */
export function recallAnnouncement(id: number): Promise<any> {
  if (USE_MOCK) {
    return delay().then(() => {
      announcementMock.update({ id, status: 'recalled' } as any)
      return { code: 200, data: null, message: '公告已撤回' }
    })
  }
  return request.put({ url: `/admin/system-config/announcement/recall/${id}` })
}

// ─── 制度文档 ───────────────────────────────────────────────────────────────

export const documentApi = createCrudApi<PolicyDocument>({
  baseUrl: '/admin/system-config/document',
  mockFns: documentMock
})

export type { BasicConfig, IssueType, VideoMonitor, Announcement, PolicyDocument }
