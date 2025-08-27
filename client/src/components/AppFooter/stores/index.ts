/**
 * AppFooter Stores 主模块
 * 组合各功能模块，统一导出
 */

import { defineStore } from 'pinia'
import { useFooterConfig } from './useFooterConfig'
import { useFooterLinks } from './useFooterLinks'

// 主 Store - 组合各个功能模块
export const useAppFooterStore = defineStore('appFooter', () => {
  // 组合各个功能模块
  const footerConfig = useFooterConfig()
  const footerLinks = useFooterLinks(footerConfig.finalConfig)

  return {
    // 配置管理状态和方法
    ...footerConfig,

    // 链接管理方法
    ...footerLinks,
  }
})

// 导出各个功能模块 Composables（可按需使用）
export { useFooterConfig } from './useFooterConfig'
export { useFooterLinks } from './useFooterLinks'
