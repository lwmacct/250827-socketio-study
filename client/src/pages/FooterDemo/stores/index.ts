/**
 * FooterDemo 页面专用状态管理
 * 演示页面级 Store 的使用方式
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FooterMode, FooterConfig, DemoExample } from '../types'

/**
 * FooterDemo 页面 Store
 * 管理页脚演示的状态和配置
 */
export const useFooterDemoStore = defineStore('footerDemo', () => {
  // === 状态 ===
  const currentMode = ref<FooterMode>('default')
  const showLongContent = ref(false)
  const currentConfig = ref<FooterConfig>({
    fixed: false,
    showLinks: true,
    customText: undefined,
  })

  // 演示示例数据
  const examples = ref<DemoExample[]>([
    {
      id: 'default',
      title: '默认页脚',
      description: '使用默认配置的页脚，跟随内容自然流动',
      icon: 'mdi-arrow-down',
      color: 'info',
      config: { fixed: false, showLinks: true },
      codeExample: '<AppFooter />',
    },
    {
      id: 'fixed',
      title: '固定页脚',
      description: '固定在视口底部的页脚，始终可见',
      icon: 'mdi-pin',
      color: 'success',
      config: { fixed: true, showLinks: true },
      codeExample: '<AppFooter :fixed="true" />',
    },
    {
      id: 'custom',
      title: '自定义页脚',
      description: '自定义文本和链接显示的页脚',
      icon: 'mdi-cog',
      color: 'warning',
      config: { fixed: false, showLinks: true, customText: '© 2024 自定义页脚演示' },
      codeExample: '<AppFooter custom-text="© 2024 自定义页脚演示" :show-links="true" />',
    },
  ])

  // === 计算属性 ===
  const currentExample = computed(
    () => examples.value.find((ex) => ex.id === currentMode.value) || examples.value[0],
  )

  const modeDescription = computed(() => currentExample.value?.description || '')

  // === 方法 ===
  const switchMode = (mode: FooterMode) => {
    currentMode.value = mode
    const example = examples.value.find((ex) => ex.id === mode)
    if (example) {
      currentConfig.value = { ...example.config }
    }
    console.log(`切换到 ${mode} 模式`)
  }

  const toggleLongContent = () => {
    showLongContent.value = !showLongContent.value
  }

  const updateConfig = (newConfig: Partial<FooterConfig>) => {
    Object.assign(currentConfig.value, newConfig)
  }

  // === 数据持久化 ===
  const saveToLocalStorage = () => {
    const data = {
      currentMode: currentMode.value,
      showLongContent: showLongContent.value,
      currentConfig: currentConfig.value,
    }
    localStorage.setItem('footer-demo-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('footer-demo-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.currentMode) currentMode.value = data.currentMode
        if (data.showLongContent !== undefined) showLongContent.value = data.showLongContent
        if (data.currentConfig) Object.assign(currentConfig.value, data.currentConfig)
      } catch (error) {
        console.error('加载 FooterDemo Store 数据失败:', error)
      }
    }
  }

  // === 初始化 ===
  const initialize = () => {
    loadFromLocalStorage()
    console.log('FooterDemo Store 初始化完成')
  }

  return {
    // 状态
    currentMode: computed(() => currentMode.value),
    showLongContent: computed(() => showLongContent.value),
    currentConfig: computed(() => currentConfig.value),
    examples: computed(() => examples.value),

    // 计算属性
    currentExample,
    modeDescription,

    // 方法
    switchMode,
    toggleLongContent,
    updateConfig,
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
  }
})
