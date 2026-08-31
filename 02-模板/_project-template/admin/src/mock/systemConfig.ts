/**
 * 系统配置模块 Mock 数据
 * 包含：基础配置、问题类型、视频监控配置、通知公告、制度文档
 */

import { createCrudMock } from '@/utils/crud'

// ─── 基础配置 ───────────────────────────────────────────────────────────────

export interface BasicConfig {
  systemName: string
  systemLogo: string
  systemDesc: string
  timezone: string
  dateFormat: string
}

/** 平台参数数据（单条记录，不需要 CRUD） */
export const basicConfigData: BasicConfig = {
  systemName: '智管云运营平台',
  systemLogo: '/assets/logo-demo.png',
  systemDesc: '面向中小企业的统一后台管理与业务协同平台',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
}

// ─── 问题类型 ───────────────────────────────────────────────────────────────

export interface IssueType {
  id: number
  name: string
  defaultReviewer: string
  defaultReviewerId: number | null
  sort: number
  status: number
  createTime: string
}

const initialIssueTypes: IssueType[] = [
  {
    id: 1,
    name: '采购申请',
    defaultReviewer: '陈明',
    defaultReviewerId: 1,
    sort: 1,
    status: 1,
    createTime: '2026-02-10 09:00:00'
  },
  {
    id: 2,
    name: '费用报销',
    defaultReviewer: '刘芳',
    defaultReviewerId: 2,
    sort: 2,
    status: 1,
    createTime: '2026-02-11 09:00:00'
  },
  {
    id: 3,
    name: '客户投诉',
    defaultReviewer: '周杰',
    defaultReviewerId: 3,
    sort: 3,
    status: 1,
    createTime: '2026-02-12 09:00:00'
  },
  {
    id: 4,
    name: '权限变更',
    defaultReviewer: '陈明',
    defaultReviewerId: 1,
    sort: 4,
    status: 1,
    createTime: '2026-02-13 09:00:00'
  },
  {
    id: 5,
    name: '数据导出',
    defaultReviewer: '',
    defaultReviewerId: null,
    sort: 5,
    status: 0,
    createTime: '2026-02-14 09:00:00'
  }
]

export const issueTypeMock = createCrudMock<IssueType>(initialIssueTypes, {
  searchFields: ['name']
})

// ─── 视频监控配置 ────────────────────────────────────────────────────────────

export interface VideoMonitor {
  id: number
  deviceName: string
  ipAddress: string
  port: number
  username: string
  password: string
  brand: string
  createTime: string
}

const initialVideoMonitors: VideoMonitor[] = [
  {
    id: 1,
    deviceName: '前台大厅摄像头',
    ipAddress: '10.0.12.101',
    port: 554,
    username: 'operator',
    password: '******',
    brand: '宇视 IPC-B312',
    createTime: '2026-03-01 09:00:00'
  },
  {
    id: 2,
    deviceName: '办公区A通道',
    ipAddress: '10.0.12.102',
    port: 554,
    username: 'operator',
    password: '******',
    brand: '天地伟业 TC-C32XN',
    createTime: '2026-03-02 09:00:00'
  },
  {
    id: 3,
    deviceName: '停车场入口',
    ipAddress: '10.0.12.103',
    port: 554,
    username: 'operator',
    password: '******',
    brand: '宇视 IPC-B312',
    createTime: '2026-03-03 09:00:00'
  }
]

export const videoMonitorMock = createCrudMock<VideoMonitor>(initialVideoMonitors, {
  searchFields: ['deviceName']
})

// ─── 通知公告 ───────────────────────────────────────────────────────────────

export interface Announcement {
  id: number
  title: string
  content: string
  attachments: { name: string; url: string }[]
  status: 'draft' | 'published' | 'recalled'
  publishTime: string | null
  createTime: string
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '关于本周末系统升级维护的通知',
    content:
      '<p>各位同事：平台将于本周六 22:00 至周日 02:00 进行版本升级，期间部分功能暂不可用，请提前安排工作。</p>',
    attachments: [{ name: '升级说明.pdf', url: '/files/upgrade-guide.pdf' }],
    status: 'published',
    publishTime: '2026-06-20 09:00:00',
    createTime: '2026-06-19 14:00:00'
  },
  {
    id: 2,
    title: '审批流程优化功能已上线',
    content: '<p>消息通知模块已支持草稿与发布状态，欢迎各部门试用并反馈建议。</p>',
    attachments: [],
    status: 'published',
    publishTime: '2026-06-25 10:00:00',
    createTime: '2026-06-24 16:00:00'
  },
  {
    id: 3,
    title: '三季度运营数据汇总（草稿）',
    content: '<p>三季度数据汇总材料整理中，正式发布时间另行通知。</p>',
    attachments: [],
    status: 'draft',
    publishTime: null,
    createTime: '2026-07-01 11:00:00'
  }
]

export const announcementMock = createCrudMock<Announcement>(initialAnnouncements, {
  searchFields: ['title']
})

// ─── 制度文档 ───────────────────────────────────────────────────────────────

export interface PolicyDocument {
  id: number
  name: string
  category: string
  fileUrl: string
  fileType: string
  createTime: string
}

const initialDocuments: PolicyDocument[] = [
  {
    id: 1,
    name: '员工手册2026版',
    category: '规范制度',
    fileUrl: '/files/employee-handbook.pdf',
    fileType: 'pdf',
    createTime: '2026-04-10 09:00:00'
  },
  {
    id: 2,
    name: '信息安全管理规范',
    category: '规范制度',
    fileUrl: '/files/info-security.pdf',
    fileType: 'pdf',
    createTime: '2026-04-15 09:00:00'
  },
  {
    id: 3,
    name: '请假申请模板',
    category: '表单范本',
    fileUrl: '/files/leave-template.docx',
    fileType: 'docx',
    createTime: '2026-05-01 09:00:00'
  },
  {
    id: 4,
    name: '项目立项操作指引',
    category: '操作指引',
    fileUrl: '/files/project-guide.xlsx',
    fileType: 'xlsx',
    createTime: '2026-05-10 09:00:00'
  }
]

export const documentMock = createCrudMock<PolicyDocument>(initialDocuments, {
  searchFields: ['name', 'category']
})

/** 文档分类枚举 */
export const documentCategories = ['规范制度', '操作指引', '表单范本', '应急方案', '培训材料']
