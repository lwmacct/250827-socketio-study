/**
 * 路由工具函数 Composable
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { setPageTitle } from '../utils'
import type { TitleConfig } from '../types'

export function useRouteHelpers() {
  const route = useRoute()

  // === 路由工具函数 ===

  /**
   * 获取当前路由的icon
   * @param defaultIcon 默认icon，如果路由meta中没有配置icon则使用此值
   * @returns 当前路由的icon
   */
  const useRouteIcon = (defaultIcon: string = 'mdi-help') => {
    return computed(() => {
      return (route.meta?.icon as string) || defaultIcon
    })
  }

  /**
   * 获取当前路由的title
   * @param defaultTitle 默认title，如果路由meta中没有配置title则使用此值
   * @returns 当前路由的title
   */
  const useRouteTitle = (defaultTitle: string = '页面') => {
    return computed(() => {
      return (route.meta?.title as string) || defaultTitle
    })
  }

  /**
   * 获取当前路由的description
   * @param defaultDescription 默认description，如果路由meta中没有配置description则使用此值
   * @returns 当前路由的description
   */
  const useRouteDescription = (defaultDescription: string = '') => {
    return computed(() => {
      return (route.meta?.description as string) || defaultDescription
    })
  }

  /**
   * 获取当前路由的category
   * @param defaultCategory 默认category，如果路由meta中没有配置category则使用此值
   * @returns 当前路由的category
   */
  const useRouteCategory = (defaultCategory: string = '') => {
    return computed(() => {
      return (route.meta?.category as string) || defaultCategory
    })
  }

  /**
   * 获取当前路由的所有meta信息
   * @returns 当前路由的完整meta对象
   */
  const useRouteMeta = () => {
    return computed(() => {
      return route.meta
    })
  }

  // === 页面标题管理方法 ===

  /**
   * 设置页面标题
   * @param title - 页面标题，如果不传则使用当前路由的标题
   * @param options - 临时配置选项
   */
  const setCurrentPageTitle = (title?: string, options?: Partial<TitleConfig>) => {
    const finalTitle = title || (route.meta?.title as string)
    return setPageTitle(finalTitle, options)
  }

  return {
    // 路由工具函数
    useRouteIcon,
    useRouteTitle,
    useRouteDescription,
    useRouteCategory,
    useRouteMeta,

    // 页面标题管理方法
    setCurrentPageTitle,
  }
}
