<template>
  <v-card :elevation="elevation" class="quick-actions">
    <!-- 标题栏 -->
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div class="d-flex align-center">
        <v-icon :color="titleColor" class="mr-2">{{ titleIcon }}</v-icon>
        <span>{{ title }}</span>
      </div>

      <!-- 视图切换 -->
      <v-btn-toggle v-model="viewMode" mandatory variant="text" density="compact">
        <v-btn value="grid" icon="mdi-view-grid" size="small" />
        <v-btn value="list" icon="mdi-view-list" size="small" />
      </v-btn-toggle>
    </v-card-title>

    <v-divider />

    <!-- 快速操作内容 -->
    <v-card-text class="quick-actions__content">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="quick-actions__grid">
        <div v-for="action in visibleActions" :key="action.id" class="quick-actions__grid-item">
          <v-btn
            :color="action.color"
            :variant="(action.variant as any) || 'elevated'"
            :size="buttonSize"
            :loading="actionLoading[action.id]"
            class="quick-actions__button"
            @click="handleAction(action)"
          >
            <template v-slot:prepend>
              <v-icon :size="iconSize">{{ action.icon }}</v-icon>
            </template>

            <span class="quick-actions__button-text">
              {{ action.title }}
            </span>
          </v-btn>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="quick-actions__list">
        <v-list density="comfortable">
          <v-list-item
            v-for="action in visibleActions"
            :key="action.id"
            :title="action.title"
            :subtitle="getActionDescription(action)"
            class="quick-actions__list-item"
            :class="{ 'quick-actions__list-item--loading': actionLoading[action.id] }"
            @click="handleAction(action)"
          >
            <template v-slot:prepend>
              <v-avatar :color="action.color" size="40">
                <v-icon color="white" size="20">
                  {{ action.icon }}
                </v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <div class="d-flex align-center">
                <v-progress-circular
                  v-if="actionLoading[action.id]"
                  indeterminate
                  size="20"
                  width="2"
                  :color="action.color"
                />
                <v-icon v-else color="grey-lighten-1"> mdi-chevron-right </v-icon>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- 展开/收起切换 -->
      <div v-if="actions.length > maxVisible" class="text-center mt-4">
        <v-btn
          variant="text"
          size="small"
          :prepend-icon="showAll ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="showAll = !showAll"
        >
          {{ showAll ? '收起' : `查看全部 (${actions.length - maxVisible} 个)` }}
        </v-btn>
      </div>
    </v-card-text>

    <!-- 自定义操作 -->
    <v-card-actions v-if="showCustomAction" class="justify-center">
      <v-btn variant="outlined" prepend-icon="mdi-plus" @click="$emit('customAction')">
        自定义操作
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- 操作结果提示 -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn icon="mdi-close" size="small" @click="snackbar.show = false" />
    </template>
  </v-snackbar>

  <!-- 确认对话框 -->
  <v-dialog v-model="confirmDialog.show" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon :color="confirmDialog.color" class="mr-2">
          {{ confirmDialog.icon }}
        </v-icon>
        {{ confirmDialog.title }}
      </v-card-title>

      <v-card-text>
        {{ confirmDialog.message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="confirmDialog.show = false"> 取消 </v-btn>
        <v-btn :color="confirmDialog.color" variant="elevated" @click="executeConfirmedAction">
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { QuickAction } from '../types'

interface Props {
  actions: QuickAction[]
  title?: string
  titleIcon?: string
  titleColor?: string
  elevation?: number | string
  maxVisible?: number
  buttonSize?: string
  iconSize?: string | number
  showCustomAction?: boolean
  requireConfirm?: string[]
}

interface Emits {
  actionClick: [action: QuickAction]
  customAction: []
}

const props = withDefaults(defineProps<Props>(), {
  title: '快速操作',
  titleIcon: 'mdi-lightning-bolt',
  titleColor: 'success',
  elevation: 2,
  maxVisible: 4,
  buttonSize: 'default',
  iconSize: 'default',
  showCustomAction: false,
  requireConfirm: () => ['backup-data', 'security-scan', 'export-data'],
})

const emit = defineEmits<Emits>()

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')
const showAll = ref(false)

// 加载状态
const actionLoading = reactive<Record<string, boolean>>({})

// 提示信息
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
})

// 确认对话框
const confirmDialog = reactive({
  show: false,
  title: '',
  message: '',
  icon: 'mdi-help-circle',
  color: 'primary',
  action: null as QuickAction | null,
})

// 可见的操作
const visibleActions = computed(() => {
  const maxCount = showAll.value ? props.actions.length : props.maxVisible
  return props.actions.slice(0, maxCount)
})

// 获取操作描述
const getActionDescription = (action: QuickAction): string => {
  const descriptions: Record<string, string> = {
    'add-user': '快速添加新用户到系统',
    'view-reports': '查看系统统计报告',
    'system-settings': '配置系统参数设置',
    'help-docs': '查看帮助文档和指南',
    'backup-data': '备份重要系统数据',
    'monitor-system': '实时监控系统状态',
    'security-scan': '执行系统安全扫描',
    'export-data': '导出系统数据报表',
  }
  return descriptions[action.id] || '执行相关操作'
}

// 处理操作
const handleAction = async (action: QuickAction) => {
  // 检查是否需要确认
  if (props.requireConfirm.includes(action.id)) {
    showConfirmDialog(action)
    return
  }

  await executeAction(action)
}

// 显示确认对话框
const showConfirmDialog = (action: QuickAction) => {
  const confirmMessages: Record<
    string,
    { title: string; message: string; icon: string; color: string }
  > = {
    'backup-data': {
      title: '确认数据备份',
      message: '您确定要开始数据备份吗？此操作可能需要一段时间。',
      icon: 'mdi-backup-restore',
      color: 'warning',
    },
    'security-scan': {
      title: '确认安全扫描',
      message: '您确定要开始安全扫描吗？此操作会检查系统安全状态。',
      icon: 'mdi-shield-check',
      color: 'error',
    },
    'export-data': {
      title: '确认数据导出',
      message: '您确定要导出数据吗？这将生成包含敏感信息的文件。',
      icon: 'mdi-download',
      color: 'info',
    },
  }

  const config = confirmMessages[action.id] || {
    title: '确认操作',
    message: `您确定要执行 "${action.title}" 操作吗？`,
    icon: 'mdi-help-circle',
    color: 'primary',
  }

  Object.assign(confirmDialog, {
    show: true,
    action,
    ...config,
  })
}

// 执行确认后的操作
const executeConfirmedAction = async () => {
  confirmDialog.show = false
  if (confirmDialog.action) {
    await executeAction(confirmDialog.action)
  }
}

// 执行操作
const executeAction = async (action: QuickAction) => {
  actionLoading[action.id] = true

  try {
    // 模拟操作延时
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 执行原始操作
    action.onClick()

    // 触发事件
    emit('actionClick', action)

    // 显示成功提示
    showSnackbar(`${action.title} 执行成功`, 'success')
  } catch (error) {
    console.error('操作执行失败:', error)
    showSnackbar(`${action.title} 执行失败`, 'error')
  } finally {
    actionLoading[action.id] = false
  }
}

// 显示提示信息
const showSnackbar = (text: string, color: string = 'success') => {
  Object.assign(snackbar, {
    show: true,
    text,
    color,
    timeout: 3000,
  })
}

// 初始化加载状态
props.actions.forEach((action) => {
  actionLoading[action.id] = false
})
</script>

<style scoped>
.quick-actions {
  border-radius: 16px;
}

.quick-actions__content {
  min-height: 200px;
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.quick-actions__grid-item {
  display: flex;
  justify-content: center;
}

.quick-actions__button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.quick-actions__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.quick-actions__button-text {
  font-weight: 500;
}

.quick-actions__list {
  max-height: 400px;
  overflow-y: auto;
}

.quick-actions__list-item {
  border-radius: 12px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.quick-actions__list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
}

.quick-actions__list-item--loading {
  opacity: 0.7;
  pointer-events: none;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .quick-actions__grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .quick-actions__button {
    height: 48px;
  }
}

@media (min-width: 960px) {
  .quick-actions__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
