/**
 * Home 页面相关的类型定义
 */

/**
 * 功能特性项接口
 */
export interface FeatureItem {
  id: string
  title: string
  icon: string
  description: string[]
  color?: string
}

/**
 * 头部操作按钮接口
 */
export interface HeaderAction {
  icon: string
  text: string
  color: string
  variant: string
  onClick: () => void
}

/**
 * 首页数据接口
 */
export interface HomePageData {
  pageTitle: string
  pageIcon: string
  features: FeatureItem[]
  techStack: FeatureItem[]
  headerActions: HeaderAction[]
}
