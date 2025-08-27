/**
 * HeaderDemo 页面专用状态管理
 * 演示页面级 Store 的使用方式
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  DemoMode,
  HeaderStyleConfig,
  StyleTheme,
  HeaderDemoExample,
  UserInfo,
  HeaderAction,
} from '../types'

/**
 * HeaderDemo 页面 Store
 * 管理头部演示的状态和配置
 */
export const useHeaderDemoStore = defineStore('headerDemo', () => {
  // === 状态 ===
  const currentMode = ref<DemoMode>('slot')
  const useSlotContent = ref(false)
  const currentStyle = ref<HeaderStyleConfig>({
    color: 'primary',
    elevation: 4,
    height: undefined,
    navIconColor: 'white',
  })

  // 用户信息
  const userInfo = ref<UserInfo>({
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    role: '管理员',
  })

  // 演示示例数据
  const examples = ref<HeaderDemoExample[]>([
    {
      id: 'slot',
      title: '插槽方式演示',
      description: '使用插槽自定义头部内容，支持完整的 Vue 组件功能',
      icon: 'mdi-puzzle',
      color: 'primary',
      features: [
        '完整的 Vue 组件功能',
        '响应式数据绑定',
        '事件处理和状态管理',
        '高级组件支持',
        '复杂交互逻辑',
        '动态内容更新',
      ],
    },
    {
      id: 'styles',
      title: '样式控制演示',
      description: '演示头部组件的颜色、阴影、高度等样式控制',
      icon: 'mdi-palette',
      color: 'secondary',
      features: [
        '丰富的颜色选项',
        '灵活的阴影控制',
        '可调节的高度',
        '图标颜色自定义',
        '实时样式预览',
        '主题切换功能',
      ],
    },
  ])

  // 样式主题
  const styleThemes = ref<StyleTheme[]>([
    {
      name: '深色主题',
      color: 'grey-darken-4',
      elevation: 2,
      height: 50,
      navIconColor: 'white',
    },
    {
      name: '默认主题',
      color: 'primary',
      elevation: 4,
      height: undefined,
      navIconColor: 'white',
    },
    {
      name: '成功主题',
      color: 'success',
      elevation: 8,
      height: 80,
      navIconColor: 'white',
    },
    {
      name: '警告主题',
      color: 'warning',
      elevation: 6,
      height: 80,
      navIconColor: 'white',
    },
  ])

  // === 计算属性 ===
  const currentExample = computed(
    () => examples.value.find((ex) => ex.id === currentMode.value) || examples.value[0],
  )

  const modeDescription = computed(() => currentExample.value?.description || '')

  const headerActions = computed<HeaderAction[]>(() => [
    {
      icon: 'mdi-puzzle',
      text: '插槽模式',
      color: currentMode.value === 'slot' ? 'success' : 'grey',
      variant: 'text' as const,
      onClick: () => switchMode('slot'),
    },
    {
      icon: 'mdi-palette',
      text: '样式模式',
      color: currentMode.value === 'styles' ? 'success' : 'grey',
      variant: 'text' as const,
      onClick: () => switchMode('styles'),
    },
  ])

  // === 方法 ===
  const switchMode = (mode: DemoMode) => {
    currentMode.value = mode
    console.log(`切换到 ${mode} 演示模式`)
  }

  const toggleSlotContent = () => {
    useSlotContent.value = !useSlotContent.value
  }

  const switchTheme = (theme: StyleTheme) => {
    currentStyle.value = { ...theme }
    console.log(`切换主题: ${theme.name}`)
  }

  const updateUserInfo = (newInfo: Partial<UserInfo>) => {
    Object.assign(userInfo.value, newInfo)
  }

  // === 数据持久化 ===
  const saveToLocalStorage = () => {
    const data = {
      currentMode: currentMode.value,
      useSlotContent: useSlotContent.value,
      currentStyle: currentStyle.value,
    }
    localStorage.setItem('header-demo-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('header-demo-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.currentMode) currentMode.value = data.currentMode
        if (data.useSlotContent !== undefined) useSlotContent.value = data.useSlotContent
        if (data.currentStyle) Object.assign(currentStyle.value, data.currentStyle)
      } catch (error) {
        console.error('加载 HeaderDemo Store 数据失败:', error)
      }
    }
  }

  // === 初始化 ===
  const initialize = () => {
    loadFromLocalStorage()
    console.log('HeaderDemo Store 初始化完成')
  }

  return {
    // 状态
    currentMode: computed(() => currentMode.value),
    useSlotContent: computed(() => useSlotContent.value),
    currentStyle: computed(() => currentStyle.value),
    userInfo: computed(() => userInfo.value),
    examples: computed(() => examples.value),
    styleThemes: computed(() => styleThemes.value),

    // 计算属性
    currentExample,
    modeDescription,
    headerActions,

    // 方法
    switchMode,
    toggleSlotContent,
    switchTheme,
    updateUserInfo,
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
  }
})
