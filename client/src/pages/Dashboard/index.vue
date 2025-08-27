<script setup lang="ts">
// 仪表盘页面组件
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import StatCards from './components/StatCards.vue'
import ActivityList from './components/ActivityList.vue'
import QuickActions from './components/QuickActions.vue'
import ChartWidget from './components/ChartWidget.vue'
import SystemMonitor from './components/SystemMonitor.vue'
import NotificationCenter from './components/NotificationCenter.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'
import { useDashboardStore } from './stores/index'

const routeMenuStore = useAppHeaderStore()
const dashboardStore = useDashboardStore()

// 从路由meta中获取信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-view-dashboard')
const pageTitle = routeMenuStore.useRouteTitle('仪表盘')

// 页面生命周期
onMounted(() => {
  dashboardStore.initialize()
})

onUnmounted(() => {
  dashboardStore.saveToLocalStorage()
})

// 事件处理函数
const handleStatCardClick = (stat: any) => {
  console.log('统计卡片点击:', stat)
  dashboardStore.addActivity({
    title: '查看统计',
    description: `查看了 ${stat.title} 的详细信息`,
    timestamp: new Date(),
    icon: 'mdi-chart-line',
  })
}

const handleActivityRefresh = () => {
  dashboardStore.refreshData()
}

const handleActivityClear = () => {
  console.log('清空活动记录')
}

const handleActivityExport = () => {
  console.log('导出活动记录')
}

const handleActivityDelete = (activity: any) => {
  const index = dashboardStore.activities.findIndex((a: any) => a.id === activity.id)
  if (index !== -1) {
    console.log('删除活动:', activity)
  }
}

const handleQuickActionClick = (action: any) => {
  console.log('快速操作点击:', action)
  dashboardStore.addActivity({
    title: '执行操作',
    description: `执行了 ${action.title} 操作`,
    timestamp: new Date(),
    icon: action.icon,
  })
}

const handleChartRefresh = () => {
  // 生成随机图表数据
  const newData = [
    { label: '1月', value: Math.floor(Math.random() * 50) + 40, color: '#1976D2' },
    { label: '2月', value: Math.floor(Math.random() * 50) + 40, color: '#388E3C' },
    { label: '3月', value: Math.floor(Math.random() * 50) + 40, color: '#F57C00' },
    { label: '4月', value: Math.floor(Math.random() * 50) + 40, color: '#D32F2F' },
    { label: '5月', value: Math.floor(Math.random() * 50) + 40, color: '#7B1FA2' },
    { label: '6月', value: Math.floor(Math.random() * 50) + 40, color: '#00796B' },
  ]
  dashboardStore.updateChartData(newData)
}

const handleChartPeriodChange = (period: string) => {
  console.log('图表时间段变更:', period)
  dashboardStore.addActivity({
    title: '图表设置',
    description: `切换图表时间段为 ${period}`,
    timestamp: new Date(),
    icon: 'mdi-calendar',
  })
}

const handleNotificationClick = (notification: any) => {
  console.log('通知点击:', notification)
  if (!notification.isRead) {
    dashboardStore.markNotificationAsRead(notification.id)
  }
}

const handleNotificationMarkAsRead = (notification: any) => {
  dashboardStore.markNotificationAsRead(notification.id)
}

const handleNotificationMarkAsUnread = (notification: any) => {
  dashboardStore.markNotificationAsUnread(notification.id)
}

const handleNotificationDelete = (notification: any) => {
  dashboardStore.deleteNotification(notification.id)
}

const handleNotificationAction = (notification: any) => {
  console.log('通知操作:', notification)
  if (notification.actionUrl) {
    // 这里可以添加路由跳转逻辑
    console.log('跳转到:', notification.actionUrl)
  }
}

const handleNotificationClearAll = () => {
  dashboardStore.clearAllNotifications()
}

const handleNotificationMarkAllAsRead = () => {
  dashboardStore.markAllNotificationsAsRead()
}

const handleSystemMonitorOpenSettings = () => {
  console.log('打开系统监控设置')
  dashboardStore.addActivity({
    title: '系统设置',
    description: '打开了系统监控设置页面',
    timestamp: new Date(),
    icon: 'mdi-cog',
  })
}

const handleSystemMonitorAlertDismissed = (alertId: string) => {
  console.log('关闭系统警告:', alertId)
}
</script>

<template>
  <!-- 使用通用头部组件 -->
  <AppHeader
    :title="pageTitle"
    :titleIcon="pageIcon"
    :actions="[
      {
        icon: dashboardStore.isAutoRefresh ? 'mdi-pause' : 'mdi-play',
        text: dashboardStore.isAutoRefresh ? '暂停刷新' : '开始刷新',
        color: dashboardStore.isAutoRefresh ? 'warning' : 'success',
        variant: 'text',
        onClick: () => dashboardStore.toggleAutoRefresh(),
      },
      {
        icon: 'mdi-refresh',
        text: '手动刷新',
        color: 'primary',
        variant: 'text',
        onClick: () => dashboardStore.refreshData(),
      },
      {
        icon: 'mdi-bell',
        text: `通知 ${dashboardStore.unreadCount > 0 ? `(${dashboardStore.unreadCount})` : ''}`,
        color: dashboardStore.unreadCount > 0 ? 'error' : 'grey',
        variant: 'text',
        onClick: () => console.log('打开通知面板'),
      },
    ]"
  />

  <!-- 主要内容区域 -->
  <v-main>
    <v-container>
      <!-- 页面标题 -->
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <h1 class="text-h3">
              <v-icon size="large" color="primary" class="mr-3">{{ pageIcon }}</v-icon>
              仪表盘概览
            </h1>

            <!-- 实时信息 -->
            <div class="d-flex align-center gap-4">
              <v-chip
                :color="dashboardStore.isAutoRefresh ? 'success' : 'grey'"
                variant="flat"
                size="small"
                :prepend-icon="dashboardStore.isAutoRefresh ? 'mdi-autorenew' : 'mdi-pause'"
              >
                {{ dashboardStore.isAutoRefresh ? '自动刷新中' : '已暂停' }}
              </v-chip>

              <v-chip color="info" variant="tonal" size="small" prepend-icon="mdi-clock-outline">
                {{ dashboardStore.formattedLastRefresh }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 统计卡片区域 -->
      <v-row class="mb-6">
        <v-col cols="12">
          <StatCards
            :stats="dashboardStore.stats"
            :animated="true"
            :show-trend="true"
            @card-click="handleStatCardClick"
          />
        </v-col>
      </v-row>

      <!-- 图表和系统监控区域 -->
      <v-row class="mb-6">
        <v-col cols="12" lg="8">
          <ChartWidget
            title="数据趋势图"
            subtitle="近6个月数据变化"
            chart-type="line"
            :chart-data="dashboardStore.chartData"
            :height="350"
            :auto-refresh="true"
            @refresh="handleChartRefresh"
            @period-change="handleChartPeriodChange"
          />
        </v-col>

        <v-col cols="12" lg="4">
          <ChartWidget
            title="数据分布"
            subtitle="各类型占比"
            chart-type="pie"
            :chart-data="dashboardStore.chartData"
            :height="350"
            @refresh="handleChartRefresh"
          />
        </v-col>
      </v-row>

      <!-- 系统监控区域 -->
      <v-row class="mb-6">
        <v-col cols="12">
          <SystemMonitor
            @open-settings="handleSystemMonitorOpenSettings"
            @alert-dismissed="handleSystemMonitorAlertDismissed"
          />
        </v-col>
      </v-row>

      <!-- 活动、通知和快速操作区域 -->
      <v-row class="mb-6">
        <!-- 最近活动 -->
        <v-col cols="12" lg="6">
          <ActivityList
            :activities="dashboardStore.activities"
            :max-items="10"
            @activity-click="(activity) => console.log('活动点击:', activity)"
            @refresh="handleActivityRefresh"
            @clear="handleActivityClear"
            @export="handleActivityExport"
            @delete="handleActivityDelete"
          />
        </v-col>

        <!-- 通知中心 -->
        <v-col cols="12" lg="6">
          <NotificationCenter
            :notifications="dashboardStore.notifications"
            @notification-click="handleNotificationClick"
            @mark-as-read="handleNotificationMarkAsRead"
            @mark-as-unread="handleNotificationMarkAsUnread"
            @delete="handleNotificationDelete"
            @action="handleNotificationAction"
            @clear-all="handleNotificationClearAll"
            @mark-all-as-read="handleNotificationMarkAllAsRead"
          />
        </v-col>
      </v-row>

      <!-- 快速操作区域 -->
      <v-row class="mb-6">
        <v-col cols="12" lg="8">
          <QuickActions
            :actions="dashboardStore.allQuickActions"
            :max-visible="6"
            :show-custom-action="true"
            @action-click="handleQuickActionClick"
            @custom-action="() => console.log('自定义操作')"
          />
        </v-col>

        <!-- 柱状图 -->
        <v-col cols="12" lg="4">
          <ChartWidget
            title="活动统计"
            subtitle="各类型活动数量"
            chart-type="bar"
            :chart-data="[
              { label: '系统', value: 25, color: '#1976D2' },
              { label: '用户', value: 18, color: '#388E3C' },
              { label: '数据', value: 12, color: '#F57C00' },
              { label: '安全', value: 8, color: '#D32F2F' },
            ]"
            :height="280"
          />
        </v-col>
      </v-row>

      <!-- 系统状态信息 -->
      <v-row>
        <v-col cols="12">
          <v-alert type="info" variant="tonal" :elevation="1">
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <div class="text-body-2">
              <div class="d-flex flex-wrap gap-4">
                <div><strong>🏠 页面架构:</strong> 组件化设计 - 6个专用组件</div>
                <div><strong>📊 统计数据:</strong> {{ dashboardStore.stats.length }} 项指标</div>
                <div>
                  <strong>📝 活动记录:</strong> {{ dashboardStore.activities.length }} 条历史
                </div>
                <div>
                  <strong>📱 通知消息:</strong> {{ dashboardStore.notifications.length }} 条 ({{
                    dashboardStore.unreadCount
                  }}
                  未读)
                </div>
                <div>
                  <strong>📈 图表数据:</strong> {{ dashboardStore.chartData.length }} 个数据点
                </div>
                <div><strong>🔄 最后更新:</strong> {{ dashboardStore.formattedLastRefresh }}</div>
                <div>
                  <strong>⚡ 自动刷新:</strong>
                  <v-chip
                    size="small"
                    :color="dashboardStore.isAutoRefresh ? 'success' : 'grey'"
                    variant="flat"
                  >
                    {{ dashboardStore.isAutoRefresh ? '开启' : '关闭' }}
                  </v-chip>
                </div>
              </div>
              <div class="text-caption mt-2 text-medium-emphasis">
                💡
                这个仪表盘现在使用了专门的组件架构：StatCards、ActivityList、QuickActions、ChartWidget、SystemMonitor、NotificationCenter
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <!-- 使用通用页脚组件 -->
  <AppFooter />
</template>

<style scoped>
.v-container {
  max-width: 1440px;
}

.gap-4 {
  gap: 1rem;
}

/* 响应式调整 */
@media (max-width: 960px) {
  .text-h3 {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .d-flex.justify-space-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .gap-4 {
    gap: 8px;
    flex-wrap: wrap;
  }
}
</style>
