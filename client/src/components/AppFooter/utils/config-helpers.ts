/**
 * AppFooter 配置管理工具函数
 */

import type { FooterConfig, FooterLink } from '../types'

/**
 * 页脚配置管理器
 */
export class FooterConfigManager {
  /**
   * 合并配置对象
   * @param defaultConfig - 默认配置
   * @param customConfig - 自定义配置
   * @returns 合并后的配置
   */
  static mergeConfig(
    defaultConfig: FooterConfig,
    customConfig: Partial<FooterConfig>,
  ): FooterConfig {
    return {
      ...defaultConfig,
      ...customConfig,
      // 确保 defaultLinks 数组正确合并
      defaultLinks: customConfig.defaultLinks || defaultConfig.defaultLinks,
    }
  }

  /**
   * 验证配置对象
   * @param config - 要验证的配置
   * @returns 是否有效
   */
  static validateConfig(config: Partial<FooterConfig>): boolean {
    // 基本验证逻辑
    if (config.defaultHeight && (config.defaultHeight < 0 || config.defaultHeight > 200)) {
      return false
    }

    if (config.defaultLinks) {
      return config.defaultLinks.every(
        (link) =>
          link.href && link.text && (link.href.startsWith('http') || link.href.startsWith('/')),
      )
    }

    return true
  }

  /**
   * 创建默认配置
   * @returns 默认配置对象
   */
  static createDefaultConfig(): FooterConfig {
    return {
      defaultText: '© 2024 Vue + Vuetify 演示应用',
      defaultLinks: [
        {
          href: 'https://vuejs.org/',
          text: 'Vue.js',
          target: '_blank',
        },
        {
          href: 'https://vuetifyjs.com/',
          text: 'Vuetify',
          target: '_blank',
        },
      ],
      defaultHeight: 48,
    }
  }

  /**
   * 深度克隆配置对象
   * @param config - 要克隆的配置
   * @returns 克隆的配置
   */
  static cloneConfig(config: FooterConfig): FooterConfig {
    return {
      ...config,
      defaultLinks: config.defaultLinks.map((link) => ({ ...link })),
    }
  }
}

/**
 * 链接管理工具函数
 */
export class FooterLinkManager {
  /**
   * 添加链接到链接列表
   * @param links - 当前链接列表
   * @param newLink - 新链接
   * @returns 更新后的链接列表
   */
  static addLink(links: FooterLink[], newLink: FooterLink): FooterLink[] {
    // 检查是否已存在相同的链接
    const exists = links.some((link) => link.href === newLink.href)
    if (exists) {
      return links
    }

    return [...links, newLink]
  }

  /**
   * 从链接列表中移除指定链接
   * @param links - 当前链接列表
   * @param href - 要移除的链接 URL
   * @returns 更新后的链接列表
   */
  static removeLink(links: FooterLink[], href: string): FooterLink[] {
    return links.filter((link) => link.href !== href)
  }

  /**
   * 更新链接列表中的指定链接
   * @param links - 当前链接列表
   * @param href - 要更新的链接 URL
   * @param updatedLink - 更新后的链接数据
   * @returns 更新后的链接列表
   */
  static updateLink(
    links: FooterLink[],
    href: string,
    updatedLink: Partial<FooterLink>,
  ): FooterLink[] {
    return links.map((link) => (link.href === href ? { ...link, ...updatedLink } : link))
  }

  /**
   * 验证单个链接
   * @param link - 要验证的链接
   * @returns 是否有效
   */
  static validateLink(link: FooterLink): boolean {
    return !!(link.href && link.text && (link.href.startsWith('http') || link.href.startsWith('/')))
  }

  /**
   * 排序链接列表
   * @param links - 链接列表
   * @param by - 排序字段
   * @param order - 排序顺序
   * @returns 排序后的链接列表
   */
  static sortLinks(
    links: FooterLink[],
    by: keyof FooterLink = 'text',
    order: 'asc' | 'desc' = 'asc',
  ): FooterLink[] {
    return [...links].sort((a, b) => {
      const aValue = a[by] || ''
      const bValue = b[by] || ''

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }
}

/**
 * 配置工具函数的快捷导出
 */
export const configHelpers = FooterConfigManager
export const linkHelpers = FooterLinkManager
