<template>
  <v-row>
    <v-col v-for="stat in stats" :key="stat.id" :cols="cols" :sm="sm" :md="md" :lg="lg" :xl="xl">
      <v-card
        class="stat-card mx-auto"
        :class="[`stat-card--${stat.color}`, { 'stat-card--animated': animated }]"
        :elevation="elevation"
        :height="height"
        @click="$emit('cardClick', stat)"
      >
        <v-card-text class="text-center pa-4">
          <!-- 图标 -->
          <div class="stat-card__icon-wrapper mb-3">
            <v-icon :size="iconSize" :color="stat.color" class="stat-card__icon">
              {{ stat.icon }}
            </v-icon>
          </div>

          <!-- 数值 -->
          <div class="stat-card__value mb-2">
            <span class="text-h4 font-weight-bold" :class="`text-${stat.color}`">
              <transition name="number-change" mode="out-in">
                <span :key="stat.value">
                  {{ formatValue(stat) }}
                </span>
              </transition>
            </span>
          </div>

          <!-- 标题 -->
          <div class="stat-card__title">
            <div class="text-subtitle-1 text-medium-emphasis font-weight-medium">
              {{ stat.title }}
            </div>
          </div>

          <!-- 趋势指示器 -->
          <div v-if="showTrend" class="stat-card__trend mt-2">
            <v-chip
              size="small"
              :color="getTrendColor(stat)"
              variant="tonal"
              :prepend-icon="getTrendIcon(stat)"
            >
              {{ getTrendText(stat) }}
            </v-chip>
          </div>
        </v-card-text>

        <!-- 悬停效果叠加 -->
        <v-overlay v-model="hovering[stat.id]" contained class="stat-card__overlay">
          <div class="text-center">
            <v-icon size="large" color="white" class="mb-2"> mdi-information-outline </v-icon>
            <div class="text-body-2">点击查看详情</div>
          </div>
        </v-overlay>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { StatCard } from '../types'

interface Props {
  stats: StatCard[]
  cols?: number | string
  sm?: number | string
  md?: number | string
  lg?: number | string
  xl?: number | string
  elevation?: number | string
  height?: number | string
  iconSize?: string | number
  animated?: boolean
  showTrend?: boolean
}

interface Emits {
  cardClick: [stat: StatCard]
}

const props = withDefaults(defineProps<Props>(), {
  cols: 12,
  sm: 6,
  md: 4,
  lg: 3,
  xl: 2,
  elevation: 3,
  height: 160,
  iconSize: 'x-large',
  animated: true,
  showTrend: false,
})

const emit = defineEmits<Emits>()

// 悬停状态
const hovering = ref<Record<string, boolean>>({})

// 动画状态
const animationTrigger = ref(0)

// 格式化数值显示
const formatValue = (stat: StatCard): string => {
  if (stat.format === 'number' && typeof stat.value === 'number') {
    return stat.value.toLocaleString()
  }
  return String(stat.value)
}

// 获取趋势颜色
const getTrendColor = (stat: StatCard): string => {
  // 这里可以根据实际需求实现趋势逻辑
  const trendTypes = ['success', 'warning', 'error']
  return trendTypes[Math.floor(Math.random() * trendTypes.length)] || 'success'
}

// 获取趋势图标
const getTrendIcon = (stat: StatCard): string => {
  const color = getTrendColor(stat)
  return color === 'success'
    ? 'mdi-trending-up'
    : color === 'warning'
      ? 'mdi-trending-neutral'
      : 'mdi-trending-down'
}

// 获取趋势文本
const getTrendText = (stat: StatCard): string => {
  const trends = ['+12%', '+5%', '-2%', '+8%', '+15%']
  return trends[Math.floor(Math.random() * trends.length)] || '+5%'
}

// 初始化悬停状态
onMounted(() => {
  props.stats.forEach((stat) => {
    hovering.value[stat.id] = false
  })
})

// 监听stats变化，触发动画
watch(
  () => props.stats,
  () => {
    if (props.animated) {
      animationTrigger.value++
    }
  },
  { deep: true },
)
</script>

<style scoped>
.stat-card {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.stat-card--animated {
  animation: slideInUp 0.6s ease-out;
}

.stat-card__icon-wrapper {
  position: relative;
}

.stat-card__icon {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-card__icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-card__value {
  line-height: 1.2;
}

.stat-card__title {
  min-height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__trend {
  opacity: 0;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-card__trend {
  opacity: 1;
}

.stat-card__overlay {
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

/* 颜色主题 */
.stat-card--primary {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.stat-card--success {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.stat-card--warning {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

.stat-card--error {
  border-left: 4px solid rgb(var(--v-theme-error));
}

.stat-card--info {
  border-left: 4px solid rgb(var(--v-theme-info));
}

.stat-card--orange {
  border-left: 4px solid #ff9800;
}

/* 动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.number-change-enter-active,
.number-change-leave-active {
  transition: all 0.3s ease;
}

.number-change-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.number-change-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .stat-card {
    border-radius: 16px;
  }

  .stat-card:hover {
    transform: translateY(-4px) scale(1.01);
  }
}
</style>
