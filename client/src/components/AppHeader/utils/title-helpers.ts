/**
 * AppHeader 页面标题管理工具函数
 */

import type { TitleConfig } from '../types'

/**
 * 页面标题管理器
 */
export class PageTitleManager {
  private config: Required<TitleConfig>

  constructor(config: TitleConfig = {}) {
    this.config = {
      defaultTitle: 'Vue + Vuetify 演示应用',
      appName: 'Vue + Vuetify Console',
      separator: ' - ',
      showAppName: true,
      template: '{title}{separator}{appName}',
      ...config,
    }
  }

  /**
   * 设置页面标题
   * @param title - 页面标题
   * @param options - 临时配置选项
   */
  setTitle(title?: string, options: Partial<TitleConfig> = {}) {
    const finalTitle = title || this.config.defaultTitle
    const tempConfig = { ...this.config, ...options }

    if (!tempConfig.showAppName) {
      document.title = finalTitle
      return finalTitle
    }

    const formattedTitle = tempConfig.template
      .replace('{title}', finalTitle)
      .replace('{separator}', tempConfig.separator)
      .replace('{appName}', tempConfig.appName)

    document.title = formattedTitle
    return formattedTitle
  }

  /**
   * 更新配置
   * @param config - 新的配置
   */
  updateConfig(config: Partial<TitleConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<TitleConfig> {
    return { ...this.config }
  }

  /**
   * 重置为默认配置
   */
  resetConfig() {
    this.config = {
      defaultTitle: 'Vue + Vuetify 演示应用',
      appName: 'Vue + Vuetify Console',
      separator: ' - ',
      showAppName: true,
      template: '{title}{separator}{appName}',
    }
  }
}

// 创建默认的页面标题管理器实例
export const pageTitleManager = new PageTitleManager()

/**
 * 设置页面标题的快捷函数
 * @param title - 页面标题
 * @param options - 临时配置选项
 */
export const setPageTitle = (title?: string, options: Partial<TitleConfig> = {}) => {
  return pageTitleManager.setTitle(title, options)
}
