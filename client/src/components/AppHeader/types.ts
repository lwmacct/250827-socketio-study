/**
 * AppHeader 组件相关的类型定义
 */

// 扩展Vue Router的RouteMeta接口
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    icon?: string
    // 自定义字段
    description?: string
    keywords?: string[]
    category?: string
    priority?: number
    showInMenu?: boolean
    requireAuth?: boolean
    [key: string]: any
  }
}

/**
 * 头部组件属性接口
 */
export interface Props {
  // 标题相关
  title?: string
  titleIcon?: string
  showTitle?: boolean

  // 导航图标相关
  showNavIcon?: boolean
  navIcon?: string
  navIconColor?: string
  onNavIconClick?: () => void

  // 抽屉菜单相关
  showDrawer?: boolean
  drawerWidth?: number | string

  // 其他
  elevation?: number | string
  color?: string
  height?: number | string

  // 自定义内容相关
  useCustomContent?: boolean
}

/**
 * 基础菜单项接口
 */
export interface MenuItem {
  id: string
  title: string
  icon: string
  path: string
  category?: string
  isFavorite?: boolean
}

/**
 * 路由菜单项接口（完整版本）
 */
export interface RouteMenuItem {
  title: string
  path: string
  icon: string
  description?: string
  category?: string
  priority?: number
  showInMenu?: boolean
  requireAuth?: boolean
  isFavorite?: boolean
  lastAccessed?: number
  children?: RouteMenuItem[]
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
 * 抽屉菜单配置接口
 */
export interface DrawerConfig {
  width: number | string
  temporary: boolean
  color: string
  dark: boolean
}

/**
 * 悬停面板配置接口
 */
export interface HoverPanelConfig {
  minWidth: number
  maxWidth: number
  backgroundColor: string
  borderColor: string
  showAnimation: boolean
}

/**
 * 页面标题管理配置接口
 */
export interface TitleConfig {
  /** 默认标题 */
  defaultTitle?: string
  /** 应用名称后缀 */
  appName?: string
  /** 标题分隔符 */
  separator?: string
  /** 是否显示应用名称 */
  showAppName?: boolean
  /** 标题模板，{title} 和 {appName} 会被替换 */
  template?: string
}
