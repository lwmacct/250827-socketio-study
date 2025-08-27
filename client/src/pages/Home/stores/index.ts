/**
 * Home 页面专用状态管理
 * 演示页面级 Store 的使用方式
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface HomeStats {
  visitCount: number
  lastVisitTime: Date | null
}

/**
 * Home 页面 Store
 * 管理首页的访问统计和简单状态
 */
export const useHomeStore = defineStore('home', () => {
  // === 状态 ===
  const stats = ref<HomeStats>({
    visitCount: 0,
    lastVisitTime: null,
  })

  const showStatistics = ref(true)
  const currentSessionStart = ref<Date>(new Date())

  // === 计算属性 ===
  const formattedLastVisit = computed(() => {
    if (!stats.value.lastVisitTime) return '首次访问'
    return stats.value.lastVisitTime.toLocaleString('zh-CN')
  })

  const sessionDuration = computed(() => {
    const now = new Date()
    const duration = Math.floor((now.getTime() - currentSessionStart.value.getTime()) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}分${seconds}秒`
  })

  // === 方法 ===
  const recordVisit = () => {
    stats.value.visitCount++
    stats.value.lastVisitTime = new Date()
    currentSessionStart.value = new Date()
    console.log(`首页访问次数: ${stats.value.visitCount}`)
  }

  const toggleStatistics = () => {
    showStatistics.value = !showStatistics.value
  }

  // === 数据持久化 ===
  const saveToLocalStorage = () => {
    const data = { stats: stats.value, showStatistics: showStatistics.value }
    localStorage.setItem('home-store-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('home-store-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.stats) {
          Object.assign(stats.value, data.stats)
          if (data.stats.lastVisitTime) {
            stats.value.lastVisitTime = new Date(data.stats.lastVisitTime)
          }
        }
        if (data.showStatistics !== undefined) {
          showStatistics.value = data.showStatistics
        }
      } catch (error) {
        console.error('加载 Home Store 数据失败:', error)
      }
    }
  }

  // === 初始化 ===
  const initialize = () => {
    loadFromLocalStorage()
    recordVisit()
  }

  return {
    // 状态
    stats: computed(() => stats.value),
    showStatistics: computed(() => showStatistics.value),

    // 计算属性
    formattedLastVisit,
    sessionDuration,

    // 方法
    recordVisit,
    toggleStatistics,
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
  }
})
