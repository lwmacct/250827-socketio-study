/**
 * Dashboard 页面专用状态管理
 * 管理仪表盘的统计数据和实时更新
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  StatCard,
  ActivityItem,
  QuickAction,
  Notification,
  ChartDataItem,
  DashboardLayout,
} from '../types'
import {
  mockStats,
  generateRandomStats,
  mockActivities,
  generateRandomActivity,
  getDefaultQuickActions,
  getAllQuickActions,
  mockNotifications,
  mockChartData,
  mockConfig,
} from '../mock'

/**
 * Dashboard 页面 Store
 * 管理仪表盘数据、实时更新和用户操作
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // === 状态 ===
  const stats = ref<StatCard[]>([...mockStats])
  const activities = ref<ActivityItem[]>([...mockActivities])
  const notifications = ref<Notification[]>([...mockNotifications])
  const chartData = ref<ChartDataItem[]>([...mockChartData])

  const isAutoRefresh = ref(mockConfig.autoRefreshDefault)
  const refreshInterval = ref(mockConfig.refreshInterval)
  const lastRefreshTime = ref<Date>(new Date())

  // 布局配置
  const layout = ref<DashboardLayout>({
    showStats: true,
    showChart: true,
    showSystemMonitor: true,
    showNotifications: true,
    showActivities: true,
    showQuickActions: true,
    gridLayout: {
      stats: { cols: 12, order: 1 },
      chart: { cols: 8, order: 2 },
      systemMonitor: { cols: 12, order: 3 },
      notifications: { cols: 6, order: 4 },
      activities: { cols: 6, order: 5 },
      quickActions: { cols: 6, order: 6 },
    },
  })

  // === 计算属性 ===
  const totalUsers = computed(() => {
    const userStat = stats.value.find((s) => s.id === 'total-users')
    return userStat ? userStat.value : 0
  })

  const activeUsers = computed(() => {
    const activeStat = stats.value.find((s) => s.id === 'active-users')
    return activeStat ? activeStat.value : 0
  })

  const formattedLastRefresh = computed(() => {
    return lastRefreshTime.value.toLocaleTimeString('zh-CN')
  })

  const recentActivities = computed(() => {
    return activities.value.slice(0, 5)
  })

  // === 通知相关 ===
  const unreadNotifications = computed(() => {
    return notifications.value.filter((n) => !n.isRead)
  })

  const unreadCount = computed(() => {
    return unreadNotifications.value.length
  })

  const recentNotifications = computed(() => {
    return notifications.value.slice(0, 3)
  })

  // === 图表相关 ===
  const chartSummary = computed(() => {
    const total = chartData.value.reduce((sum, item) => sum + item.value, 0)
    const maxItem =
      chartData.value.length > 0
        ? chartData.value.reduce(
            (max, item) => (item.value > (max?.value || 0) ? item : max),
            chartData.value[0],
          )
        : null
    return {
      total,
      count: chartData.value.length,
      maxItem,
    }
  })

  // === 快速操作 ===
  const quickActions = computed<QuickAction[]>(() => getDefaultQuickActions())
  const allQuickActions = computed<QuickAction[]>(() => getAllQuickActions())

  // === 方法 ===
  const refreshData = async () => {
    console.log('刷新仪表盘数据...')

    if (mockConfig.enableRandomGeneration) {
      const randomData = generateRandomStats()

      // 更新统计数据
      stats.value.forEach((stat) => {
        if (randomData[stat.id] !== undefined) {
          stat.value = randomData[stat.id]!
        }
      })

      // 添加随机活动记录
      if (Math.random() < 0.3) {
        // 30% 概率添加新活动
        const newActivity = generateRandomActivity()
        activities.value.unshift(newActivity)

        // 保持最大数量限制
        if (activities.value.length > mockConfig.maxActivities) {
          activities.value = activities.value.slice(0, mockConfig.maxActivities)
        }
      }
    }

    lastRefreshTime.value = new Date()
    console.log(`仪表盘数据已更新 - ${formattedLastRefresh.value}`)
  }

  const toggleAutoRefresh = () => {
    isAutoRefresh.value = !isAutoRefresh.value
    console.log(`自动刷新 ${isAutoRefresh.value ? '开启' : '关闭'}`)
  }

  const addActivity = (activity: Omit<ActivityItem, 'id'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
    }
    activities.value.unshift(newActivity)

    // 保持最大数量限制
    if (activities.value.length > mockConfig.maxActivities) {
      activities.value = activities.value.slice(0, mockConfig.maxActivities)
    }
  }

  // === 通知管理 ===
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }
    notifications.value.unshift(newNotification)

    // 保持最大数量限制
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  const markNotificationAsUnread = (notificationId: string) => {
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = false
    }
  }

  const deleteNotification = (notificationId: string) => {
    const index = notifications.value.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach((notification) => {
      notification.isRead = true
    })
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  // === 图表数据管理 ===
  const updateChartData = (newData: ChartDataItem[]) => {
    chartData.value = [...newData]
  }

  const addChartDataPoint = (dataPoint: ChartDataItem) => {
    const existing = chartData.value.find((item) => item.label === dataPoint.label)
    if (existing) {
      existing.value = dataPoint.value
      existing.color = dataPoint.color || existing.color
    } else {
      chartData.value.push(dataPoint)
    }
  }

  // === 布局管理 ===
  const updateLayout = (newLayout: Partial<DashboardLayout>) => {
    layout.value = { ...layout.value, ...newLayout }
  }

  const toggleWidget = (widgetName: keyof DashboardLayout) => {
    if (typeof layout.value[widgetName] === 'boolean') {
      ;(layout.value[widgetName] as boolean) = !(layout.value[widgetName] as boolean)
    }
  }

  const reorderWidget = (widgetName: string, newOrder: number) => {
    const gridWidget = layout.value.gridLayout[widgetName as keyof typeof layout.value.gridLayout]
    if (gridWidget) {
      gridWidget.order = newOrder
    }
  }

  // === 数据持久化 ===
  const saveToLocalStorage = () => {
    const data = {
      stats: stats.value,
      activities: activities.value,
      notifications: notifications.value,
      chartData: chartData.value,
      isAutoRefresh: isAutoRefresh.value,
      refreshInterval: refreshInterval.value,
      lastRefreshTime: lastRefreshTime.value,
      layout: layout.value,
    }
    localStorage.setItem('dashboard-store-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('dashboard-store-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.stats) stats.value = data.stats
        if (data.activities)
          activities.value = data.activities.map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          }))
        if (data.notifications)
          notifications.value = data.notifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        if (data.chartData) chartData.value = data.chartData
        if (data.layout) layout.value = { ...layout.value, ...data.layout }
        if (data.isAutoRefresh !== undefined) isAutoRefresh.value = data.isAutoRefresh
        if (data.refreshInterval) refreshInterval.value = data.refreshInterval
        if (data.lastRefreshTime) {
          lastRefreshTime.value = new Date(data.lastRefreshTime)
        }
      } catch (error) {
        console.error('加载 Dashboard Store 数据失败:', error)
      }
    }
  }

  // === 初始化 ===
  const initialize = () => {
    loadFromLocalStorage()
    refreshData()

    // 初始化通知数据（如果为空）
    if (notifications.value.length === 0) {
      notifications.value = [...mockNotifications]
    }

    // 初始化图表数据（如果为空）
    if (chartData.value.length === 0) {
      chartData.value = [...mockChartData]
    }

    // 添加初始化活动记录
    addActivity({
      title: '仪表盘初始化',
      description: '仪表盘页面加载完成',
      timestamp: new Date(),
      icon: 'mdi-view-dashboard',
    })

    // 添加初始化通知
    addNotification({
      title: '欢迎使用仪表盘',
      message: '仪表盘已加载完成，所有功能模块就绪',
      type: 'system',
      priority: 'low',
      icon: 'mdi-view-dashboard',
      timestamp: new Date(),
      isRead: false,
    })
  }

  return {
    // 状态
    stats: computed(() => stats.value),
    activities: computed(() => activities.value),
    notifications: computed(() => notifications.value),
    chartData: computed(() => chartData.value),
    layout: computed(() => layout.value),
    isAutoRefresh: computed(() => isAutoRefresh.value),
    refreshInterval: computed(() => refreshInterval.value),
    lastRefreshTime: computed(() => lastRefreshTime.value),

    // 计算属性
    totalUsers,
    activeUsers,
    formattedLastRefresh,
    recentActivities,
    unreadNotifications,
    unreadCount,
    recentNotifications,
    chartSummary,
    quickActions,
    allQuickActions,

    // 活动管理方法
    refreshData,
    toggleAutoRefresh,
    addActivity,

    // 通知管理方法
    addNotification,
    markNotificationAsRead,
    markNotificationAsUnread,
    deleteNotification,
    markAllNotificationsAsRead,
    clearAllNotifications,

    // 图表数据管理方法
    updateChartData,
    addChartDataPoint,

    // 布局管理方法
    updateLayout,
    toggleWidget,
    reorderWidget,

    // 数据持久化方法
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
  }
})
