/**
 * 页脚链接管理 Composable
 */

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { linkHelpers } from '../utils'
import type { FooterLink, FooterConfig } from '../types'

export function useFooterLinks(finalConfig: ComputedRef<FooterConfig>) {
  // === 计算属性 ===
  const footerLinks = computed(() => finalConfig.value.defaultLinks)
  const linkCount = computed(() => footerLinks.value.length)
  const hasLinks = computed(() => linkCount.value > 0)

  // === 链接管理方法 ===

  /**
   * 添加新链接
   * @param link - 要添加的链接
   * @param updateConfig - 更新配置的回调函数
   */
  const addLink = (link: FooterLink, updateConfig: (config: Partial<FooterConfig>) => void) => {
    if (linkHelpers.validateLink(link)) {
      const currentLinks = [...finalConfig.value.defaultLinks]
      const updatedLinks = linkHelpers.addLink(currentLinks, link)

      if (updatedLinks.length > currentLinks.length) {
        updateConfig({ defaultLinks: updatedLinks })
      }
    } else {
      console.warn('Invalid link provided:', link)
    }
  }

  /**
   * 移除链接
   * @param href - 要移除的链接 URL
   * @param updateConfig - 更新配置的回调函数
   */
  const removeLink = (href: string, updateConfig: (config: Partial<FooterConfig>) => void) => {
    const currentLinks = finalConfig.value.defaultLinks
    const updatedLinks = linkHelpers.removeLink(currentLinks, href)
    updateConfig({ defaultLinks: updatedLinks })
  }

  /**
   * 更新现有链接
   * @param href - 要更新的链接 URL
   * @param updatedLink - 更新的链接数据
   * @param updateConfig - 更新配置的回调函数
   */
  const updateLink = (
    href: string,
    updatedLink: Partial<FooterLink>,
    updateConfig: (config: Partial<FooterConfig>) => void,
  ) => {
    const currentLinks = finalConfig.value.defaultLinks
    const updatedLinks = linkHelpers.updateLink(currentLinks, href, updatedLink)
    updateConfig({ defaultLinks: updatedLinks })
  }

  /**
   * 排序链接
   * @param by - 排序字段
   * @param order - 排序顺序
   * @param updateConfig - 更新配置的回调函数
   */
  const sortLinks = (
    by: keyof FooterLink = 'text',
    order: 'asc' | 'desc' = 'asc',
    updateConfig: (config: Partial<FooterConfig>) => void,
  ) => {
    const currentLinks = finalConfig.value.defaultLinks
    const sortedLinks = linkHelpers.sortLinks(currentLinks, by, order)
    updateConfig({ defaultLinks: sortedLinks })
  }

  /**
   * 清空所有链接
   * @param updateConfig - 更新配置的回调函数
   */
  const clearAllLinks = (updateConfig: (config: Partial<FooterConfig>) => void) => {
    updateConfig({ defaultLinks: [] })
  }

  /**
   * 批量添加链接
   * @param links - 要添加的链接列表
   * @param updateConfig - 更新配置的回调函数
   */
  const batchAddLinks = (
    links: FooterLink[],
    updateConfig: (config: Partial<FooterConfig>) => void,
  ) => {
    const validLinks = links.filter((link) => linkHelpers.validateLink(link))
    if (validLinks.length > 0) {
      let currentLinks = [...finalConfig.value.defaultLinks]

      validLinks.forEach((link) => {
        currentLinks = linkHelpers.addLink(currentLinks, link)
      })

      updateConfig({ defaultLinks: currentLinks })
    }
  }

  /**
   * 获取指定链接
   * @param href - 链接 URL
   * @returns 找到的链接或 undefined
   */
  const findLink = (href: string): FooterLink | undefined => {
    return footerLinks.value.find((link) => link.href === href)
  }

  /**
   * 检查链接是否存在
   * @param href - 链接 URL
   * @returns 是否存在
   */
  const hasLink = (href: string): boolean => {
    return footerLinks.value.some((link) => link.href === href)
  }

  return {
    // 计算属性
    footerLinks,
    linkCount,
    hasLinks,

    // 方法
    addLink,
    removeLink,
    updateLink,
    sortLinks,
    clearAllLinks,
    batchAddLinks,
    findLink,
    hasLink,
  }
}
