/**
 * 全局类型定义
 * 用于存放项目中使用的通用类型定义
 */

/**
 * API 响应基础接口
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

/**
 * 分页数据接口
 */
export interface PaginationData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  meta?: MenuItemMeta
}

/**
 * 菜单项元数据接口
 */
export interface MenuItemMeta {
  title: string
  icon?: string
  description?: string
  keywords?: string[]
  category?: string
  priority?: number
  showInMenu?: boolean
  requireAuth?: boolean
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  nickname?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

/**
 * 通用表单验证规则类型
 */
export type ValidationRule = (value: any) => boolean | string

/**
 * 组件尺寸类型
 */
export type ComponentSize = 'small' | 'default' | 'large'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 响应式断点类型
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * 通用状态类型
 */
export type Status = 'success' | 'error' | 'warning' | 'info'

/**
 * 异步状态接口
 */
export interface AsyncState<T = any> {
  loading: boolean
  data: T | null
  error: Error | null
}
