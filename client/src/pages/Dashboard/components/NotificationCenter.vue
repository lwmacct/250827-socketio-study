<template>
  <v-card :elevation="elevation" class="notification-center">
    <!-- 标题栏 -->
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div class="d-flex align-center">
        <v-icon :color="titleColor" class="mr-2">{{ titleIcon }}</v-icon>
        <div>
          <div class="text-h6">{{ title }}</div>
          <div class="text-caption text-medium-emphasis">{{ unreadCount }} 条未读消息</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="d-flex align-center gap-2">
        <v-btn
          icon="mdi-check-all"
          size="small"
          variant="text"
          :disabled="unreadCount === 0"
          @click="markAllAsRead"
        />
        <v-btn
          icon="mdi-delete-sweep"
          size="small"
          variant="text"
          :disabled="notifications.length === 0"
          @click="clearAll"
        />
      </div>
    </v-card-title>

    <v-divider />

    <!-- 筛选标签 -->
    <v-card-text class="pb-2" v-if="showFilters">
      <v-chip-group
        v-model="selectedFilter"
        selected-class="text-primary"
        variant="outlined"
        mandatory
      >
        <v-chip value="all" size="small"> 全部 ({{ notifications.length }}) </v-chip>
        <v-chip value="unread" size="small"> 未读 ({{ unreadCount }}) </v-chip>
        <v-chip value="system" size="small"> 系统 ({{ getTypeCount('system') }}) </v-chip>
        <v-chip value="user" size="small"> 用户 ({{ getTypeCount('user') }}) </v-chip>
        <v-chip value="alert" size="small"> 警告 ({{ getTypeCount('alert') }}) </v-chip>
      </v-chip-group>
    </v-card-text>

    <!-- 通知列表 -->
    <v-card-text class="notification-center__content">
      <v-virtual-scroll
        v-if="filteredNotifications.length > 0"
        :items="filteredNotifications"
        :height="listHeight"
        item-height="84"
      >
        <template v-slot:default="{ item }">
          <div
            :key="item.id"
            class="notification-center__item"
            :class="{
              'notification-center__item--unread': !item.isRead,
              'notification-center__item--priority': item.priority === 'high',
            }"
            @click="handleNotificationClick(item)"
          >
            <!-- 通知内容 -->
            <div class="notification-center__item-content">
              <!-- 图标 -->
              <v-avatar
                :color="getNotificationColor(item)"
                size="40"
                class="notification-center__avatar"
              >
                <v-icon color="white" size="20">
                  {{ item.icon }}
                </v-icon>
              </v-avatar>

              <!-- 主体内容 -->
              <div class="notification-center__main">
                <div class="notification-center__header">
                  <div class="notification-center__title">
                    {{ item.title }}
                  </div>
                  <div class="notification-center__time">
                    {{ formatTime(item.timestamp) }}
                  </div>
                </div>

                <div class="notification-center__message">
                  {{ item.message }}
                </div>

                <!-- 标签和动作 -->
                <div class="notification-center__footer">
                  <v-chip :color="getNotificationColor(item)" variant="tonal" size="x-small">
                    {{ getTypeLabel(item.type) }}
                  </v-chip>

                  <v-chip
                    v-if="item.priority === 'high'"
                    color="error"
                    variant="tonal"
                    size="x-small"
                    prepend-icon="mdi-alert"
                  >
                    高优先级
                  </v-chip>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="notification-center__actions">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                  @click.stop="showActionMenu(item, $event)"
                />

                <!-- 未读指示器 -->
                <div v-if="!item.isRead" class="notification-center__unread-dot" />
              </div>
            </div>

            <!-- 悬停工具栏 -->
            <div class="notification-center__toolbar">
              <v-btn
                v-if="!item.isRead"
                size="x-small"
                variant="text"
                prepend-icon="mdi-check"
                @click.stop="markAsRead(item)"
              >
                标记已读
              </v-btn>

              <v-btn
                v-if="item.actionUrl"
                size="x-small"
                variant="text"
                prepend-icon="mdi-open-in-new"
                @click.stop="handleAction(item)"
              >
                查看详情
              </v-btn>

              <v-btn
                size="x-small"
                variant="text"
                prepend-icon="mdi-delete"
                @click.stop="deleteNotification(item)"
              >
                删除
              </v-btn>
            </div>
          </div>

          <v-divider />
        </template>
      </v-virtual-scroll>

      <!-- 空状态 -->
      <div v-else class="notification-center__empty">
        <v-icon size="64" color="grey-lighten-2">
          {{ selectedFilter === 'unread' ? 'mdi-check-all' : 'mdi-bell-outline' }}
        </v-icon>
        <div class="text-h6 text-medium-emphasis mt-4">
          {{ selectedFilter === 'unread' ? '没有未读消息' : '暂无通知' }}
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ selectedFilter === 'unread' ? '所有消息都已阅读' : '当前没有任何通知消息' }}
        </div>
      </div>
    </v-card-text>

    <!-- 分页控制 -->
    <v-card-actions v-if="showPagination && filteredNotifications.length > 0">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        size="small"
        total-visible="5"
        class="ma-auto"
      />
    </v-card-actions>
  </v-card>

  <!-- 操作菜单 -->
  <v-menu v-model="actionMenu.show" :activator="actionMenu.activator" location="bottom end">
    <v-list density="compact">
      <v-list-item
        v-if="!actionMenu.item?.isRead"
        prepend-icon="mdi-check"
        title="标记为已读"
        @click="markAsRead(actionMenu.item!)"
      />
      <v-list-item
        v-else
        prepend-icon="mdi-check-outline"
        title="标记为未读"
        @click="markAsUnread(actionMenu.item!)"
      />
      <v-list-item
        prepend-icon="mdi-content-copy"
        title="复制内容"
        @click="copyNotification(actionMenu.item!)"
      />
      <v-list-item
        v-if="actionMenu.item?.actionUrl"
        prepend-icon="mdi-open-in-new"
        title="查看详情"
        @click="handleAction(actionMenu.item!)"
      />
      <v-divider />
      <v-list-item
        prepend-icon="mdi-delete"
        title="删除通知"
        @click="deleteNotification(actionMenu.item!)"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface Notification {
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

interface Props {
  notifications: Notification[]
  title?: string
  titleIcon?: string
  titleColor?: string
  elevation?: number | string
  listHeight?: number
  showFilters?: boolean
  showPagination?: boolean
  itemsPerPage?: number
}

interface Emits {
  notificationClick: [notification: Notification]
  markAsRead: [notification: Notification]
  markAsUnread: [notification: Notification]
  delete: [notification: Notification]
  action: [notification: Notification]
  clearAll: []
  markAllAsRead: []
}

const props = withDefaults(defineProps<Props>(), {
  title: '通知中心',
  titleIcon: 'mdi-bell',
  titleColor: 'info',
  elevation: 2,
  listHeight: 400,
  showFilters: true,
  showPagination: false,
  itemsPerPage: 10,
})

const emit = defineEmits<Emits>()

// 状态
const selectedFilter = ref('all')
const currentPage = ref(1)

// 操作菜单
const actionMenu = reactive({
  show: false,
  activator: null as any,
  item: null as Notification | null,
})

// 计算属性
const unreadCount = computed(() => {
  return props.notifications.filter((n) => !n.isRead).length
})

const filteredNotifications = computed(() => {
  let filtered = props.notifications

  switch (selectedFilter.value) {
    case 'unread':
      filtered = filtered.filter((n) => !n.isRead)
      break
    case 'system':
    case 'user':
    case 'alert':
      filtered = filtered.filter((n) => n.type === selectedFilter.value)
      break
  }

  // 分页
  if (props.showPagination) {
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filtered.slice(start, end)
  }

  return filtered
})

const totalPages = computed(() => {
  const total = props.notifications.length
  return Math.ceil(total / props.itemsPerPage)
})

// 方法
const getTypeCount = (type: string): number => {
  return props.notifications.filter((n) => n.type === type).length
}

const getNotificationColor = (notification: Notification): string => {
  const colorMap = {
    system: 'info',
    user: 'primary',
    alert: notification.priority === 'high' ? 'error' : 'warning',
  }
  return colorMap[notification.type]
}

const getTypeLabel = (type: string): string => {
  const labelMap = {
    system: '系统',
    user: '用户',
    alert: '警告',
  }
  return labelMap[type as keyof typeof labelMap] || type
}

const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return timestamp.toLocaleDateString('zh-CN')
}

// 事件处理
const handleNotificationClick = (notification: Notification) => {
  if (!notification.isRead) {
    markAsRead(notification)
  }
  emit('notificationClick', notification)
}

const markAsRead = (notification: Notification) => {
  notification.isRead = true
  emit('markAsRead', notification)
  actionMenu.show = false
}

const markAsUnread = (notification: Notification) => {
  notification.isRead = false
  emit('markAsUnread', notification)
  actionMenu.show = false
}

const deleteNotification = (notification: Notification) => {
  emit('delete', notification)
  actionMenu.show = false
}

const handleAction = (notification: Notification) => {
  emit('action', notification)
  actionMenu.show = false
}

const markAllAsRead = () => {
  emit('markAllAsRead')
}

const clearAll = () => {
  emit('clearAll')
}

const showActionMenu = (item: Notification, event: Event) => {
  actionMenu.activator = event.target
  actionMenu.item = item
  actionMenu.show = true
}

const copyNotification = (notification: Notification) => {
  const text = `${notification.title}: ${notification.message}`
  navigator.clipboard.writeText(text)
  actionMenu.show = false
}

// 默认通知数据（如果没有传入数据）
const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: '系统更新',
    message: '系统已成功更新到最新版本，请重新启动以应用更改',
    type: 'system',
    priority: 'normal',
    icon: 'mdi-system-update',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
    actionUrl: '/system/updates',
  },
  {
    id: '2',
    title: '新用户注册',
    message: '用户 john.doe@example.com 已成功注册账户',
    type: 'user',
    priority: 'low',
    icon: 'mdi-account-plus',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
  },
  {
    id: '3',
    title: '磁盘空间警告',
    message: '系统磁盘使用率达到85%，请及时清理或扩容',
    type: 'alert',
    priority: 'high',
    icon: 'mdi-harddisk-remove',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: false,
    actionUrl: '/system/storage',
  },
]

// 如果没有传入通知数据，使用默认数据
if (props.notifications.length === 0) {
  // 这里可以触发获取通知数据的事件
  console.log('使用默认通知数据')
}
</script>

<style scoped>
.notification-center {
  border-radius: 16px;
}

.notification-center__content {
  position: relative;
}

.notification-center__item {
  position: relative;
  padding: 12px 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px 0;
}

.notification-center__item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.notification-center__item:hover .notification-center__toolbar {
  opacity: 1;
  visibility: visible;
}

.notification-center__item--unread {
  background-color: rgba(var(--v-theme-info), 0.08);
  border-left: 3px solid rgb(var(--v-theme-info));
}

.notification-center__item--priority {
  border-left-color: rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.05);
}

.notification-center__item-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.notification-center__avatar {
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.notification-center__main {
  flex: 1;
  min-width: 0;
}

.notification-center__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.notification-center__title {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
}

.notification-center__time {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  flex-shrink: 0;
  margin-left: 12px;
}

.notification-center__message {
  font-size: 13px;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  margin-bottom: 8px;
}

.notification-center__footer {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.notification-center__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
}

.notification-center__unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-info));
  animation: pulse 2s infinite;
}

.notification-center__toolbar {
  position: absolute;
  top: 0;
  right: 16px;
  display: flex;
  gap: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-center__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.gap-2 {
  gap: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-info), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0);
  }
}

/* 响应式调整 */
@media (max-width: 600px) {
  .notification-center__item {
    padding: 8px 12px;
  }

  .notification-center__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .notification-center__time {
    margin-left: 0;
  }

  .notification-center__toolbar {
    position: static;
    opacity: 1;
    visibility: visible;
    margin-top: 8px;
  }
}
</style>
