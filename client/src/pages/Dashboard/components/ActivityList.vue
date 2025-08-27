<template>
  <v-card :elevation="elevation" class="activity-list">
    <!-- 标题栏 -->
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div class="d-flex align-center">
        <v-icon :color="titleColor" class="mr-2">{{ titleIcon }}</v-icon>
        <span>{{ title }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="d-flex align-center gap-2">
        <v-tooltip text="刷新活动">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-refresh"
              size="small"
              variant="text"
              :loading="refreshLoading"
              @click="handleRefresh"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="清空活动">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-delete-sweep"
              size="small"
              variant="text"
              @click="handleClear"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="导出活动">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-download"
              size="small"
              variant="text"
              @click="handleExport"
            />
          </template>
        </v-tooltip>
      </div>
    </v-card-title>

    <v-divider />

    <!-- 筛选和搜索 -->
    <v-card-text class="pb-0" v-if="showFilters">
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="searchQuery"
            placeholder="搜索活动..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="filterType"
            :items="filterOptions"
            placeholder="筛选类型"
            prepend-inner-icon="mdi-filter"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
      </v-row>
    </v-card-text>

    <!-- 活动列表 -->
    <v-card-text class="activity-list__content">
      <v-virtual-scroll
        v-if="filteredActivities.length > 0"
        :items="paginatedActivities"
        :height="listHeight"
        item-height="72"
        class="activity-list__scroll"
      >
        <template v-slot:default="{ item }">
          <v-list-item
            :key="item.id"
            :title="item.title"
            :subtitle="item.description"
            class="activity-list__item"
            :class="{ 'activity-list__item--new': isRecentActivity(item) }"
            @click="$emit('activityClick', item)"
          >
            <!-- 图标 -->
            <template v-slot:prepend>
              <v-avatar :color="getActivityColor(item)" size="40" class="activity-list__avatar">
                <v-icon color="white" size="20">
                  {{ item.icon || 'mdi-circle-small' }}
                </v-icon>
              </v-avatar>
            </template>

            <!-- 时间和操作 -->
            <template v-slot:append>
              <div class="text-right">
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ formatTime(item.timestamp) }}
                </div>
                <v-btn
                  icon="mdi-dots-vertical"
                  size="x-small"
                  variant="text"
                  @click.stop="showActionMenu(item, $event)"
                />
              </div>
            </template>

            <!-- 新活动指示器 -->
            <div v-if="isRecentActivity(item)" class="activity-list__new-indicator" />
          </v-list-item>

          <v-divider v-if="item !== paginatedActivities[paginatedActivities.length - 1]" />
        </template>
      </v-virtual-scroll>

      <!-- 空状态 -->
      <v-alert v-else type="info" variant="tonal" :text="emptyText" class="ma-0" />

      <!-- 加载更多 -->
      <div v-if="showLoadMore" class="text-center mt-4">
        <v-btn variant="outlined" :loading="loadingMore" @click="loadMore"> 加载更多 </v-btn>
      </div>
    </v-card-text>

    <!-- 统计信息 -->
    <v-card-actions v-if="showStats" class="justify-space-between">
      <div class="text-caption text-medium-emphasis">共 {{ filteredActivities.length }} 条活动</div>
      <div class="text-caption text-medium-emphasis">最后更新: {{ lastUpdateTime }}</div>
    </v-card-actions>
  </v-card>

  <!-- 操作菜单 -->
  <v-menu v-model="actionMenu.show" :activator="actionMenu.activator" location="bottom end">
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-information"
        title="查看详情"
        @click="viewActivityDetail(actionMenu.item)"
      />
      <v-list-item
        prepend-icon="mdi-content-copy"
        title="复制内容"
        @click="copyActivity(actionMenu.item)"
      />
      <v-list-item
        prepend-icon="mdi-delete"
        title="删除活动"
        @click="deleteActivity(actionMenu.item)"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ActivityItem } from '../types'

interface Props {
  activities: ActivityItem[]
  title?: string
  titleIcon?: string
  titleColor?: string
  elevation?: number | string
  listHeight?: number | string
  maxItems?: number
  showFilters?: boolean
  showStats?: boolean
  emptyText?: string
}

interface Emits {
  activityClick: [activity: ActivityItem]
  refresh: []
  clear: []
  export: []
  delete: [activity: ActivityItem]
}

const props = withDefaults(defineProps<Props>(), {
  title: '最近活动',
  titleIcon: 'mdi-history',
  titleColor: 'info',
  elevation: 2,
  listHeight: 400,
  maxItems: 10,
  showFilters: true,
  showStats: true,
  emptyText: '暂无活动记录',
})

const emit = defineEmits<Emits>()

// 搜索和筛选
const searchQuery = ref('')
const filterType = ref('')
const refreshLoading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// 操作菜单
const actionMenu = ref({
  show: false,
  activator: null as any,
  item: null as ActivityItem | null,
})

// 筛选选项
const filterOptions = [
  { title: '全部', value: '' },
  { title: '用户操作', value: 'user' },
  { title: '系统操作', value: 'system' },
  { title: '安全相关', value: 'security' },
  { title: '数据相关', value: 'data' },
]

// 筛选后的活动
const filteredActivities = computed(() => {
  let filtered = props.activities

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (activity) =>
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query),
    )
  }

  // 类型筛选
  if (filterType.value) {
    filtered = filtered.filter((activity) => {
      return getActivityType(activity) === filterType.value
    })
  }

  return filtered
})

// 分页后的活动
const paginatedActivities = computed(() => {
  const maxItems = props.maxItems || filteredActivities.value.length
  return filteredActivities.value.slice(0, maxItems)
})

// 是否显示加载更多
const showLoadMore = computed(() => {
  return (
    filteredActivities.value.length > (props.maxItems || 0) &&
    paginatedActivities.value.length < filteredActivities.value.length
  )
})

// 最后更新时间
const lastUpdateTime = computed(() => {
  if (props.activities.length === 0) return '--'
  const latest = Math.max(...props.activities.map((a) => a.timestamp.getTime()))
  return new Date(latest).toLocaleTimeString('zh-CN')
})

// 格式化时间显示
const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`

  return timestamp.toLocaleDateString('zh-CN')
}

// 判断是否为最近活动
const isRecentActivity = (activity: ActivityItem): boolean => {
  const now = new Date()
  const diff = now.getTime() - activity.timestamp.getTime()
  return diff < 5 * 60 * 1000 // 5分钟内
}

// 获取活动颜色
const getActivityColor = (activity: ActivityItem): string => {
  const type = getActivityType(activity)
  const colorMap: Record<string, string> = {
    user: 'primary',
    system: 'success',
    security: 'error',
    data: 'warning',
    default: 'grey',
  }
  return colorMap[type] || 'grey'
}

// 获取活动类型
const getActivityType = (activity: ActivityItem): string => {
  const title = activity.title.toLowerCase()
  if (title.includes('用户') || title.includes('登录') || title.includes('注册')) {
    return 'user'
  }
  if (title.includes('安全') || title.includes('扫描') || title.includes('防护')) {
    return 'security'
  }
  if (title.includes('数据') || title.includes('备份') || title.includes('同步')) {
    return 'data'
  }
  if (title.includes('系统') || title.includes('监控') || title.includes('配置')) {
    return 'system'
  }
  return 'default'
}

// 处理刷新
const handleRefresh = async () => {
  refreshLoading.value = true
  try {
    emit('refresh')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } finally {
    refreshLoading.value = false
  }
}

// 处理清空
const handleClear = () => {
  emit('clear')
}

// 处理导出
const handleExport = () => {
  emit('export')
}

// 加载更多
const loadMore = async () => {
  loadingMore.value = true
  try {
    currentPage.value++
    await new Promise((resolve) => setTimeout(resolve, 500))
  } finally {
    loadingMore.value = false
  }
}

// 显示操作菜单
const showActionMenu = (item: ActivityItem, event: Event) => {
  actionMenu.value = {
    show: true,
    activator: event.target,
    item,
  }
}

// 查看活动详情
const viewActivityDetail = (activity: ActivityItem | null) => {
  if (activity) {
    console.log('查看活动详情:', activity)
    // TODO: 实现活动详情弹窗
  }
  actionMenu.value.show = false
}

// 复制活动
const copyActivity = (activity: ActivityItem | null) => {
  if (activity) {
    const text = `${activity.title}: ${activity.description}`
    navigator.clipboard.writeText(text)
    console.log('已复制到剪贴板:', text)
  }
  actionMenu.value.show = false
}

// 删除活动
const deleteActivity = (activity: ActivityItem | null) => {
  if (activity) {
    emit('delete', activity)
  }
  actionMenu.value.show = false
}

// 重置搜索和筛选
watch([searchQuery, filterType], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.activity-list {
  border-radius: 16px;
}

.activity-list__content {
  position: relative;
}

.activity-list__scroll {
  border-radius: 8px;
}

.activity-list__item {
  border-radius: 12px;
  margin: 4px 0;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.activity-list__item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
}

.activity-list__item--new {
  background-color: rgba(var(--v-theme-success), 0.08);
  border-left: 3px solid rgb(var(--v-theme-success));
}

.activity-list__avatar {
  border: 2px solid rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease;
}

.activity-list__item:hover .activity-list__avatar {
  transform: scale(1.1);
}

.activity-list__new-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: rgb(var(--v-theme-success));
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.gap-2 {
  gap: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-success), 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0);
  }
}
</style>
