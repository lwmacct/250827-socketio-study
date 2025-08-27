/**
 * FooterDemo 页面相关的类型定义
 */

/**
 * 页脚模式类型
 */
export type FooterMode = 'default' | 'fixed' | 'custom'

/**
 * 页脚配置接口
 */
export interface FooterConfig {
  fixed: boolean
  showLinks: boolean
  customText?: string
}

/**
 * 演示示例接口
 */
export interface DemoExample {
  id: string
  title: string
  description: string
  icon: string
  color: string
  config: FooterConfig
  codeExample: string
}

/**
 * 页脚演示页面数据接口
 */
export interface FooterDemoData {
  currentMode: FooterMode
  showLongContent: boolean
  examples: DemoExample[]
}
