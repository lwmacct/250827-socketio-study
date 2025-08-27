<template>
  <v-card :elevation="elevation" class="chart-widget">
    <!-- 标题栏 -->
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div class="d-flex align-center">
        <v-icon :color="titleColor" class="mr-2">{{ titleIcon }}</v-icon>
        <div>
          <div class="text-h6">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-medium-emphasis">
            {{ subtitle }}
          </div>
        </div>
      </div>

      <!-- 时间范围选择和操作 -->
      <div class="d-flex align-center gap-2">
        <v-select
          v-model="selectedPeriod"
          :items="periodOptions"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 100px"
          @update:modelValue="updateChart"
        />

        <v-tooltip text="刷新图表">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-refresh"
              size="small"
              variant="text"
              :loading="refreshing"
              @click="refreshChart"
            />
          </template>
        </v-tooltip>
      </div>
    </v-card-title>

    <v-divider />

    <!-- 图表内容 -->
    <v-card-text class="chart-widget__content">
      <div class="chart-widget__container" :style="{ height: `${height}px` }">
        <!-- 加载状态 -->
        <div v-if="loading" class="chart-widget__loading">
          <v-progress-circular indeterminate size="48" :color="titleColor" />
          <div class="text-body-2 mt-4 text-medium-emphasis">加载图表数据...</div>
        </div>

        <!-- 线形图 -->
        <div v-else-if="chartType === 'line'" class="chart-widget__chart">
          <canvas ref="lineChartRef" :width="chartWidth" :height="height" />
        </div>

        <!-- 柱状图 -->
        <div v-else-if="chartType === 'bar'" class="chart-widget__chart">
          <div class="chart-widget__bar-chart">
            <div
              v-for="(item, index) in chartData"
              :key="index"
              class="chart-widget__bar-item"
              :style="{
                '--bar-height': `${(item.value / maxValue) * 100}%`,
                '--bar-color': item.color || primaryColor,
              }"
            >
              <div class="chart-widget__bar" />
              <div class="chart-widget__bar-label">{{ item.label }}</div>
              <div class="chart-widget__bar-value">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <!-- 饼图 -->
        <div v-else-if="chartType === 'pie'" class="chart-widget__chart">
          <div class="chart-widget__pie-chart">
            <svg
              :width="pieSize"
              :height="pieSize"
              viewBox="0 0 100 100"
              class="chart-widget__pie-svg"
            >
              <circle
                v-for="(segment, index) in pieSegments"
                :key="index"
                cx="50"
                cy="50"
                r="25"
                fill="transparent"
                :stroke="segment.color"
                stroke-width="10"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.dashOffset"
                class="chart-widget__pie-segment"
                :class="{ 'chart-widget__pie-segment--hover': hoveredSegment === index }"
                @mouseenter="hoveredSegment = index"
                @mouseleave="hoveredSegment = -1"
              />
            </svg>

            <!-- 饼图中心数值 -->
            <div class="chart-widget__pie-center">
              <div class="text-h5 font-weight-bold">{{ totalValue }}</div>
              <div class="text-caption text-medium-emphasis">总计</div>
            </div>
          </div>

          <!-- 图例 -->
          <div class="chart-widget__legend mt-4">
            <div
              v-for="(item, index) in chartData"
              :key="index"
              class="chart-widget__legend-item"
              :class="{ 'chart-widget__legend-item--hover': hoveredSegment === index }"
              @mouseenter="hoveredSegment = index"
              @mouseleave="hoveredSegment = -1"
            >
              <div
                class="chart-widget__legend-color"
                :style="{ backgroundColor: item.color || colors[index % colors.length] }"
              />
              <span class="chart-widget__legend-label">{{ item.label }}</span>
              <span class="chart-widget__legend-value"
                >{{ item.value }} ({{ ((item.value / totalValue) * 100).toFixed(1) }}%)</span
              >
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!chartData.length" class="chart-widget__empty">
          <v-icon size="48" color="grey-lighten-2">mdi-chart-line</v-icon>
          <div class="text-body-1 text-medium-emphasis mt-2">暂无图表数据</div>
        </div>
      </div>
    </v-card-text>

    <!-- 图表统计信息 -->
    <v-card-actions v-if="showStats" class="justify-space-between">
      <div class="text-caption text-medium-emphasis">数据点: {{ chartData.length }}</div>
      <div class="text-caption text-medium-emphasis">更新时间: {{ lastUpdateTime }}</div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface ChartDataItem {
  label: string
  value: number
  color?: string
}

interface Props {
  title: string
  subtitle?: string
  titleIcon?: string
  titleColor?: string
  chartType?: 'line' | 'bar' | 'pie'
  chartData: ChartDataItem[]
  height?: number
  elevation?: number | string
  showStats?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

interface Emits {
  refresh: []
  periodChange: [period: string]
}

const props = withDefaults(defineProps<Props>(), {
  titleIcon: 'mdi-chart-line',
  titleColor: 'primary',
  chartType: 'line',
  height: 300,
  elevation: 2,
  showStats: true,
  autoRefresh: false,
  refreshInterval: 30000,
})

const emit = defineEmits<Emits>()

// 图表配置
const lineChartRef = ref<HTMLCanvasElement>()
const selectedPeriod = ref('7d')
const refreshing = ref(false)
const loading = ref(false)
const hoveredSegment = ref(-1)

// 时间范围选项
const periodOptions = [
  { title: '24小时', value: '1d' },
  { title: '7天', value: '7d' },
  { title: '30天', value: '30d' },
  { title: '90天', value: '90d' },
]

// 颜色配置
const colors = [
  '#1976D2',
  '#388E3C',
  '#F57C00',
  '#D32F2F',
  '#7B1FA2',
  '#00796B',
  '#FBC02D',
  '#5D4037',
]

// 计算属性
const chartWidth = computed(() => {
  return Math.max(400, props.chartData.length * 50)
})

const maxValue = computed(() => {
  return Math.max(...props.chartData.map((item) => item.value), 1)
})

const totalValue = computed(() => {
  return props.chartData.reduce((sum, item) => sum + item.value, 0)
})

const pieSize = computed(() => {
  return Math.min(props.height - 40, 200)
})

const primaryColor = computed(() => {
  return `rgb(var(--v-theme-${props.titleColor}))`
})

const lastUpdateTime = computed(() => {
  return new Date().toLocaleTimeString('zh-CN')
})

// 饼图分段数据
const pieSegments = computed(() => {
  let cumulativePercentage = 0

  return props.chartData.map((item, index) => {
    const percentage = (item.value / totalValue.value) * 100
    const strokeDasharray = `${percentage} ${100 - percentage}`
    const strokeDashoffset = 25 - cumulativePercentage

    cumulativePercentage += percentage

    return {
      dashArray: strokeDasharray,
      dashOffset: strokeDashoffset,
      color: item.color || colors[index % colors.length],
    }
  })
})

// 自动刷新定时器
let refreshTimer: ReturnType<typeof setInterval> | null = null

// 绘制线形图
const drawLineChart = () => {
  if (!lineChartRef.value) return

  const canvas = lineChartRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { width, height } = canvas
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  if (props.chartData.length === 0) return

  // 设置样式
  ctx.strokeStyle = primaryColor.value
  ctx.fillStyle = primaryColor.value
  ctx.lineWidth = 2

  // 绘制网格线
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1

  // 垂直网格线
  for (let i = 0; i <= 5; i++) {
    const x = padding + (chartWidth / 5) * i
    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, height - padding)
    ctx.stroke()
  }

  // 水平网格线
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // 绘制折线
  ctx.strokeStyle = primaryColor.value
  ctx.lineWidth = 3
  ctx.beginPath()

  props.chartData.forEach((item, index) => {
    const x = padding + (chartWidth / (props.chartData.length - 1)) * index
    const y = height - padding - (item.value / maxValue.value) * chartHeight

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // 绘制数据点
  ctx.fillStyle = primaryColor.value
  props.chartData.forEach((item, index) => {
    const x = padding + (chartWidth / (props.chartData.length - 1)) * index
    const y = height - padding - (item.value / maxValue.value) * chartHeight

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // 绘制标签
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'

  props.chartData.forEach((item, index) => {
    const x = padding + (chartWidth / (props.chartData.length - 1)) * index
    ctx.fillText(item.label, x, height - 10)
  })
}

// 刷新图表
const refreshChart = async () => {
  refreshing.value = true
  try {
    emit('refresh')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (props.chartType === 'line') {
      await nextTick()
      drawLineChart()
    }
  } finally {
    refreshing.value = false
  }
}

// 更新图表
const updateChart = () => {
  emit('periodChange', selectedPeriod.value)

  if (props.chartType === 'line') {
    nextTick(() => {
      drawLineChart()
    })
  }
}

// 启动自动刷新
const startAutoRefresh = () => {
  if (props.autoRefresh) {
    refreshTimer = setInterval(refreshChart, props.refreshInterval)
  }
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 监听数据变化
watch(
  () => props.chartData,
  () => {
    if (props.chartType === 'line') {
      nextTick(() => {
        drawLineChart()
      })
    }
  },
  { deep: true },
)

// 组件生命周期
onMounted(() => {
  if (props.chartType === 'line') {
    nextTick(() => {
      drawLineChart()
    })
  }
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.chart-widget {
  border-radius: 16px;
}

.chart-widget__content {
  position: relative;
}

.chart-widget__container {
  position: relative;
  width: 100%;
}

.chart-widget__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chart-widget__chart {
  height: 100%;
  overflow-x: auto;
}

.chart-widget__bar-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 100%;
  padding: 20px;
  gap: 8px;
}

.chart-widget__bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.chart-widget__bar {
  width: 30px;
  height: var(--bar-height);
  background-color: var(--bar-color);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-widget__bar:hover {
  filter: brightness(1.1);
  transform: scaleY(1.05);
}

.chart-widget__bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  text-align: center;
}

.chart-widget__bar-value {
  font-size: 14px;
  font-weight: bold;
  color: rgb(var(--v-theme-on-surface));
  margin-top: 4px;
}

.chart-widget__pie-chart {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-widget__pie-svg {
  transform: rotate(-90deg);
}

.chart-widget__pie-segment {
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-widget__pie-segment--hover {
  stroke-width: 12;
  filter: brightness(1.1);
}

.chart-widget__pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.chart-widget__legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.chart-widget__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.chart-widget__legend-item:hover,
.chart-widget__legend-item--hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.chart-widget__legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.chart-widget__legend-label {
  flex: 1;
  font-size: 14px;
}

.chart-widget__legend-value {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

.chart-widget__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.gap-2 {
  gap: 8px;
}
</style>
