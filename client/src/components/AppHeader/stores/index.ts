/**
 * AppHeader Stores 主模块
 * 组合各功能模块，统一导出
 */

import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useDrawer } from './useDrawer'
import { useRouteMenu } from './useRouteMenu'
import { useRouteHelpers } from './useRouteHelpers'
import type { TitleConfig } from '../types'

// 主 Store - 组合各个功能模块
export const useAppHeaderStore = defineStore('appHeader', () => {
  const router = useRouter()

  // 组合各个功能模块
  const drawer = useDrawer()
  const routeMenu = useRouteMenu()
  const routeHelpers = useRouteHelpers()

  // === 导航方法 ===
  const handleNavigation = (path: string) => {
    drawer.closeDrawer()
    routeMenu.recordAccess(path) // 记录访问时间
    router.push(path)
  }

  /**
   * 根据路由路径设置页面标题
   * @param path - 路由路径
   * @param options - 临时配置选项
   */
  const setPageTitleByPath = (path: string, options?: Partial<TitleConfig>) => {
    const menuItem = routeMenu.getMenuItemByPath(path)
    if (menuItem) {
      return routeHelpers.setCurrentPageTitle(menuItem.title, options)
    }
    return routeHelpers.setCurrentPageTitle(undefined, options)
  }

  return {
    // 抽屉状态和方法
    ...drawer,

    // 路由菜单数据和方法
    ...routeMenu,

    // 路由工具函数
    ...routeHelpers,

    // 组合方法
    handleNavigation,
    setPageTitleByPath,
  }
})

// 导出各个功能模块 Composables（可按需使用）
export { useDrawer } from './useDrawer'
export { useRouteMenu } from './useRouteMenu'
export { useRouteHelpers } from './useRouteHelpers'
