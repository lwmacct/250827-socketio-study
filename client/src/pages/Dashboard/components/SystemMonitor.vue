<template>
  <v-card :elevation="elevation" class="system-monitor">
    <!-- 标题栏 -->
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div class="d-flex align-center">
        <v-icon :color="titleColor" class="mr-2">{{ titleIcon }}</v-icon>
        <div>
          <div class="text-h6">{{ title }}</div>
          <div class="text-caption text-medium-emphasis">实时监控系统性能指标</div>
        </div>
      </div>

      <!-- 系统状态指示器 -->
      <v-chip
        :color="systemStatus.color"
        variant="flat"
        size="small"
        :prepend-icon="systemStatus.icon"
      >
        {{ systemStatus.text }}
      </v-chip>
    </v-card-title>

    <v-divider />

    <!-- 性能指标 -->
    <v-card-text class="system-monitor__content">
      <v-row dense>
        <!-- CPU 使用率 -->
        <v-col cols="12" sm="6" md="3">
          <div class="system-monitor__metric">
            <div class="system-monitor__metric-header">
              <v-icon color="primary" size="20">mdi-cpu-64-bit</v-icon>
              <span class="text-subtitle-2">CPU</span>
            </div>

            <v-progress-circular
              :model-value="metrics.cpu.usage"
              :color="getMetricColor(metrics.cpu.usage)"
              :size="80"
              :width="8"
              class="system-monitor__progress"
            >
              <span class="text-h6 font-weight-bold"> {{ metrics.cpu.usage }}% </span>
            </v-progress-circular>

            <div class="system-monitor__metric-details">
              <div class="text-caption text-medium-emphasis">负载: {{ metrics.cpu.load }}</div>
              <div class="text-caption text-medium-emphasis">
                温度: {{ metrics.cpu.temperature }}°C
              </div>
            </div>
          </div>
        </v-col>

        <!-- 内存使用率 -->
        <v-col cols="12" sm="6" md="3">
          <div class="system-monitor__metric">
            <div class="system-monitor__metric-header">
              <v-icon color="success" size="20">mdi-memory</v-icon>
              <span class="text-subtitle-2">内存</span>
            </div>

            <v-progress-circular
              :model-value="metrics.memory.usage"
              :color="getMetricColor(metrics.memory.usage)"
              :size="80"
              :width="8"
              class="system-monitor__progress"
            >
              <span class="text-h6 font-weight-bold"> {{ metrics.memory.usage }}% </span>
            </v-progress-circular>

            <div class="system-monitor__metric-details">
              <div class="text-caption text-medium-emphasis">已用: {{ metrics.memory.used }}GB</div>
              <div class="text-caption text-medium-emphasis">
                总计: {{ metrics.memory.total }}GB
              </div>
            </div>
          </div>
        </v-col>

        <!-- 磁盘使用率 -->
        <v-col cols="12" sm="6" md="3">
          <div class="system-monitor__metric">
            <div class="system-monitor__metric-header">
              <v-icon color="warning" size="20">mdi-harddisk</v-icon>
              <span class="text-subtitle-2">磁盘</span>
            </div>

            <v-progress-circular
              :model-value="metrics.disk.usage"
              :color="getMetricColor(metrics.disk.usage)"
              :size="80"
              :width="8"
              class="system-monitor__progress"
            >
              <span class="text-h6 font-weight-bold"> {{ metrics.disk.usage }}% </span>
            </v-progress-circular>

            <div class="system-monitor__metric-details">
              <div class="text-caption text-medium-emphasis">已用: {{ metrics.disk.used }}GB</div>
              <div class="text-caption text-medium-emphasis">可用: {{ metrics.disk.free }}GB</div>
            </div>
          </div>
        </v-col>

        <!-- 网络流量 -->
        <v-col cols="12" sm="6" md="3">
          <div class="system-monitor__metric">
            <div class="system-monitor__metric-header">
              <v-icon color="info" size="20">mdi-network</v-icon>
              <span class="text-subtitle-2">网络</span>
            </div>

            <div class="system-monitor__network">
              <div class="system-monitor__network-item">
                <v-icon size="16" color="success">mdi-arrow-down</v-icon>
                <span class="text-body-2">{{ metrics.network.download }}</span>
              </div>
              <div class="system-monitor__network-item">
                <v-icon size="16" color="error">mdi-arrow-up</v-icon>
                <span class="text-body-2">{{ metrics.network.upload }}</span>
              </div>
            </div>

            <div class="system-monitor__metric-details">
              <div class="text-caption text-medium-emphasis">
                延迟: {{ metrics.network.ping }}ms
              </div>
              <div class="text-caption text-medium-emphasis">
                连接: {{ metrics.network.connections }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 进程监控 -->
      <v-row class="mt-4">
        <v-col cols="12" lg="6">
          <div class="system-monitor__section">
            <div class="system-monitor__section-title">
              <v-icon color="purple" class="mr-2">mdi-format-list-bulleted</v-icon>
              <span class="text-subtitle-1">进程监控</span>
            </div>

            <v-list density="compact" class="system-monitor__process-list">
              <v-list-item
                v-for="process in topProcesses"
                :key="process.pid"
                class="system-monitor__process-item"
              >
                <template v-slot:prepend>
                  <v-avatar size="32" :color="process.status === 'running' ? 'success' : 'grey'">
                    <v-icon size="16" color="white">
                      {{ process.status === 'running' ? 'mdi-play' : 'mdi-pause' }}
                    </v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>
                  {{ process.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  PID: {{ process.pid }} | CPU: {{ process.cpu }}% | 内存: {{ process.memory }}MB
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-progress-linear
                    :model-value="process.cpu"
                    :color="getMetricColor(process.cpu)"
                    height="4"
                    style="width: 60px"
                  />
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <!-- 系统信息 -->
        <v-col cols="12" lg="6">
          <div class="system-monitor__section">
            <div class="system-monitor__section-title">
              <v-icon color="teal" class="mr-2">mdi-information</v-icon>
              <span class="text-subtitle-1">系统信息</span>
            </div>

            <div class="system-monitor__info-grid">
              <div v-for="info in systemInfo" :key="info.label" class="system-monitor__info-item">
                <div class="system-monitor__info-label">{{ info.label }}</div>
                <div class="system-monitor__info-value">{{ info.value }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 警告和提醒 -->
      <div v-if="alerts.length > 0" class="system-monitor__alerts mt-4">
        <v-alert
          v-for="alert in alerts"
          :key="alert.id"
          :type="alert.type"
          variant="tonal"
          closable
          class="mb-2"
          @click:close="dismissAlert(alert.id)"
        >
          <template v-slot:prepend>
            <v-icon>{{ alert.icon }}</v-icon>
          </template>

          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="font-weight-medium">{{ alert.title }}</div>
              <div class="text-body-2">{{ alert.message }}</div>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ formatTime(alert.timestamp) }}
            </div>
          </div>
        </v-alert>
      </div>
    </v-card-text>

    <!-- 操作栏 -->
    <v-card-actions class="justify-space-between">
      <div class="text-caption text-medium-emphasis">最后更新: {{ lastUpdateTime }}</div>

      <div class="d-flex gap-2">
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-refresh"
          :loading="refreshing"
          @click="refreshMetrics"
        >
          刷新
        </v-btn>

        <v-btn variant="text" size="small" prepend-icon="mdi-cog" @click="$emit('openSettings')">
          设置
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'

interface SystemMetrics {
  cpu: {
    usage: number
    load: number
    temperature: number
  }
  memory: {
    usage: number
    used: number
    total: number
  }
  disk: {
    usage: number
    used: number
    free: number
  }
  network: {
    download: string
    upload: string
    ping: number
    connections: number
  }
}

interface Process {
  pid: number
  name: string
  cpu: number
  memory: number
  status: 'running' | 'stopped'
}

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  icon: string
  timestamp: Date
}

interface Props {
  title?: string
  titleIcon?: string
  titleColor?: string
  elevation?: number | string
  autoRefresh?: boolean
  refreshInterval?: number
}

interface Emits {
  openSettings: []
  alertDismissed: [alertId: string]
}

const props = withDefaults(defineProps<Props>(), {
  title: '系统监控',
  titleIcon: 'mdi-monitor',
  titleColor: 'info',
  elevation: 2,
  autoRefresh: true,
  refreshInterval: 5000,
})

const emit = defineEmits<Emits>()

// 系统指标
const metrics = reactive<SystemMetrics>({
  cpu: {
    usage: 45,
    load: 2.1,
    temperature: 58,
  },
  memory: {
    usage: 67,
    used: 5.4,
    total: 8.0,
  },
  disk: {
    usage: 78,
    used: 234,
    free: 66,
  },
  network: {
    download: '15.2 MB/s',
    upload: '3.7 MB/s',
    ping: 12,
    connections: 156,
  },
})

// 进程信息
const topProcesses = ref<Process[]>([
  { pid: 1234, name: 'Chrome Browser', cpu: 15.2, memory: 512, status: 'running' },
  { pid: 5678, name: 'Node.js Server', cpu: 8.7, memory: 256, status: 'running' },
  { pid: 9012, name: 'VS Code', cpu: 5.3, memory: 128, status: 'running' },
  { pid: 3456, name: 'System Monitor', cpu: 2.1, memory: 64, status: 'running' },
  { pid: 7890, name: 'Database Service', cpu: 1.8, memory: 432, status: 'stopped' },
])

// 系统信息
const systemInfo = ref([
  { label: '操作系统', value: 'Ubuntu 22.04 LTS' },
  { label: '内核版本', value: '5.15.0-76-generic' },
  { label: '运行时间', value: '2天 14小时 32分钟' },
  { label: '用户数', value: '3 个活跃用户' },
  { label: 'CPU 架构', value: 'x86_64' },
  { label: '网络接口', value: 'eth0, wlan0' },
])

// 警告信息
const alerts = ref<Alert[]>([
  {
    id: '1',
    type: 'warning',
    title: '磁盘空间不足',
    message: '系统磁盘使用率超过75%，建议清理不必要的文件',
    icon: 'mdi-harddisk-remove',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'info',
    title: 'CPU 温度正常',
    message: 'CPU 温度已降至正常范围',
    icon: 'mdi-thermometer-check',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
])

// 状态
const refreshing = ref(false)
const lastUpdateTime = ref(new Date().toLocaleTimeString('zh-CN'))

// 自动刷新定时器
let refreshTimer: ReturnType<typeof setInterval> | null = null

// 计算系统整体状态
const systemStatus = computed(() => {
  const avgUsage = (metrics.cpu.usage + metrics.memory.usage + metrics.disk.usage) / 3

  if (avgUsage >= 80) {
    return { color: 'error', icon: 'mdi-alert-circle', text: '高负载' }
  } else if (avgUsage >= 60) {
    return { color: 'warning', icon: 'mdi-alert', text: '中负载' }
  } else {
    return { color: 'success', icon: 'mdi-check-circle', text: '正常' }
  }
})

// 获取指标颜色
const getMetricColor = (usage: number): string => {
  if (usage >= 80) return 'error'
  if (usage >= 60) return 'warning'
  return 'success'
}

// 格式化时间
const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  return timestamp.toLocaleString('zh-CN')
}

// 生成随机数据
const generateRandomMetrics = (): void => {
  // CPU
  metrics.cpu.usage = Math.floor(Math.random() * 30) + 30 // 30-60%
  metrics.cpu.load = Number((Math.random() * 2 + 1).toFixed(1)) // 1.0-3.0
  metrics.cpu.temperature = Math.floor(Math.random() * 20) + 50 // 50-70°C

  // 内存
  metrics.memory.usage = Math.floor(Math.random() * 40) + 40 // 40-80%
  metrics.memory.used = Number(((metrics.memory.usage / 100) * metrics.memory.total).toFixed(1))

  // 磁盘
  metrics.disk.usage = Math.floor(Math.random() * 30) + 60 // 60-90%
  metrics.disk.used = Math.floor((metrics.disk.usage / 100) * 300)
  metrics.disk.free = 300 - metrics.disk.used

  // 网络
  const downloadSpeed = (Math.random() * 20 + 5).toFixed(1)
  const uploadSpeed = (Math.random() * 10 + 2).toFixed(1)
  metrics.network.download = `${downloadSpeed} MB/s`
  metrics.network.upload = `${uploadSpeed} MB/s`
  metrics.network.ping = Math.floor(Math.random() * 20) + 8
  metrics.network.connections = Math.floor(Math.random() * 50) + 120

  // 更新进程信息
  topProcesses.value.forEach((process) => {
    process.cpu = Number((Math.random() * 20).toFixed(1))
    process.memory = Math.floor(Math.random() * 300) + 50
  })
}

// 刷新指标
const refreshMetrics = async (): Promise<void> => {
  refreshing.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    generateRandomMetrics()
    lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
  } finally {
    refreshing.value = false
  }
}

// 关闭警告
const dismissAlert = (alertId: string): void => {
  const index = alerts.value.findIndex((alert) => alert.id === alertId)
  if (index !== -1) {
    alerts.value.splice(index, 1)
    emit('alertDismissed', alertId)
  }
}

// 启动自动刷新
const startAutoRefresh = (): void => {
  if (props.autoRefresh) {
    refreshTimer = setInterval(refreshMetrics, props.refreshInterval)
  }
}

// 停止自动刷新
const stopAutoRefresh = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 组件生命周期
onMounted(() => {
  generateRandomMetrics()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.system-monitor {
  border-radius: 16px;
}

.system-monitor__content {
  min-height: 400px;
}

.system-monitor__metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  height: 100%;
}

.system-monitor__metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.system-monitor__progress {
  margin: 8px 0;
}

.system-monitor__metric-details {
  text-align: center;
  margin-top: 12px;
}

.system-monitor__network {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
}

.system-monitor__network-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.system-monitor__section {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border-radius: 12px;
  padding: 16px;
  height: 100%;
}

.system-monitor__section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.system-monitor__process-list {
  max-height: 240px;
  overflow-y: auto;
}

.system-monitor__process-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.system-monitor__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.system-monitor__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.04);
}

.system-monitor__info-label {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

.system-monitor__info-value {
  font-size: 14px;
  font-weight: 500;
}

.system-monitor__alerts {
  max-height: 200px;
  overflow-y: auto;
}

.gap-2 {
  gap: 8px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .system-monitor__metric {
    padding: 12px;
  }

  .system-monitor__progress {
    transform: scale(0.8);
  }

  .system-monitor__info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
