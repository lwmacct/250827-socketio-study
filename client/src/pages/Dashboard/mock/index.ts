/**
 * Dashboard Mock 数据统一导出
 */

import { mockStats, generateRandomStats } from './stats'
import { mockActivities, generateRandomActivity, generateActivities } from './activities'
import {
  mockQuickActions,
  createQuickActions,
  getDefaultQuickActions,
  getAllQuickActions,
} from './actions'

// 统计数据
export { mockStats, generateRandomStats } from './stats'

// 活动记录
export { mockActivities, generateRandomActivity, generateActivities } from './activities'

// 快速操作
export {
  mockQuickActions,
  createQuickActions,
  getDefaultQuickActions,
  getAllQuickActions,
} from './actions'

// 导出所有数据的聚合对象
export const mockDashboardData = {
  get stats() {
    return mockStats
  },
  get activities() {
    return mockActivities
  },
  get quickActions() {
    return getDefaultQuickActions()
  },
}

/**
 * 通知 Mock 数据
 */
export const mockNotifications = [
  {
    id: '1',
    title: '系统更新',
    message: '系统已成功更新到最新版本，请重新启动以应用更改',
    type: 'system' as const,
    priority: 'normal' as const,
    icon: 'mdi-system-update',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
    actionUrl: '/system/updates',
  },
  {
    id: '2',
    title: '新用户注册',
    message: '用户 john.doe@example.com 已成功注册账户',
    type: 'user' as const,
    priority: 'low' as const,
    icon: 'mdi-account-plus',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
  },
  {
    id: '3',
    title: '磁盘空间警告',
    message: '系统磁盘使用率达到85%，请及时清理或扩容',
    type: 'alert' as const,
    priority: 'high' as const,
    icon: 'mdi-harddisk-remove',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: false,
    actionUrl: '/system/storage',
  },
]

/**
 * 图表数据 Mock
 */
export const mockChartData = [
  { label: '1月', value: 65, color: '#1976D2' },
  { label: '2月', value: 78, color: '#388E3C' },
  { label: '3月', value: 52, color: '#F57C00' },
  { label: '4月', value: 85, color: '#D32F2F' },
  { label: '5月', value: 72, color: '#7B1FA2' },
  { label: '6月', value: 94, color: '#00796B' },
]

/**
 * Mock 数据配置
 */
export const mockConfig = {
  // 数据刷新间隔（秒）
  refreshInterval: 30,

  // 活动记录最大数量
  maxActivities: 20,

  // 是否启用随机数据生成
  enableRandomGeneration: true,

  // 自动刷新默认状态
  autoRefreshDefault: true,
}
