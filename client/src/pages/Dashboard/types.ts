/**
 * Dashboard 页面相关的类型定义
 */

/**
 * 统计卡片接口
 */
export interface StatCard {
  id: string
  title: string
  value: number | string
  icon: string
  color: string
  format?: 'number' | 'text'
}

/**
 * 活动项接口
 */
export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: Date
  icon?: string
}

/**
 * 快速操作接口
 */
export interface QuickAction {
  id: string
  title: string
  icon: string
  color?: string
  variant?: string
  onClick: () => void
}

/**
 * 仪表盘数据接口
 */
export interface DashboardData {
  stats: StatCard[]
  activities: ActivityItem[]
  quickActions: QuickAction[]
  refreshInterval: number
}

/**
 * 头部操作按钮接口
 */
export interface HeaderAction {
  icon: string
  text: string
  color: string
  variant: string
  onClick: () => void
}

/**
 * 通知接口
 */
export interface Notification {
  id: string
  title: string
  message: string
  type: 'system' | 'user' | 'alert'
  priority: 'low' | 'normal' | 'high'
  icon: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
}

/**
 * 图表数据接口
 */
export interface ChartDataItem {
  label: string
  value: number
  color?: string
}

/**
 * 仪表盘布局配置接口
 */
export interface DashboardLayout {
  showStats: boolean
  showChart: boolean
  showSystemMonitor: boolean
  showNotifications: boolean
  showActivities: boolean
  showQuickActions: boolean
  gridLayout: {
    stats: { cols: number; order: number }
    chart: { cols: number; order: number }
    systemMonitor: { cols: number; order: number }
    notifications: { cols: number; order: number }
    activities: { cols: number; order: number }
    quickActions: { cols: number; order: number }
  }
}
