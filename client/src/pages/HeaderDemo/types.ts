/**
 * HeaderDemo 页面相关的类型定义
 */

/**
 * 演示模式类型
 */
export type DemoMode = 'slot' | 'styles'

/**
 * 头部样式配置接口
 */
export interface HeaderStyleConfig {
  color: string
  elevation: number
  height?: number
  navIconColor: string
}

/**
 * 样式主题接口
 */
export interface StyleTheme {
  name: string
  color: string
  elevation: number
  height?: number
  navIconColor: string
}

/**
 * 头部操作按钮接口
 */
export interface HeaderAction {
  icon: string
  text: string
  color: string
  variant: 'text' | 'outlined' | 'flat' | 'elevated' | 'tonal' | 'plain'
  onClick: () => void
}

/**
 * 演示示例接口
 */
export interface HeaderDemoExample {
  id: string
  title: string
  description: string
  icon: string
  color: string
  features: string[]
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  name: string
  email: string
  avatar: string
  role: string
}

/**
 * 头部演示页面数据接口
 */
export interface HeaderDemoData {
  currentMode: DemoMode
  useSlotContent: boolean
  currentStyle: HeaderStyleConfig
  userInfo: UserInfo
  examples: HeaderDemoExample[]
}
