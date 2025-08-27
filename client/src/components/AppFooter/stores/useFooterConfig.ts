/**
 * 页脚配置管理 Composable
 */

import { ref, computed } from 'vue'
import { configHelpers } from '../utils'
import type { FooterConfig } from '../types'

export function useFooterConfig() {
  // === 状态 ===
  const config = ref<FooterConfig>(configHelpers.createDefaultConfig())
  const customConfig = ref<Partial<FooterConfig>>({})

  // === 计算属性 ===
  const finalConfig = computed(() => configHelpers.mergeConfig(config.value, customConfig.value))

  const footerText = computed(() => finalConfig.value.defaultText)
  const footerHeight = computed(() => finalConfig.value.defaultHeight)

  // === 配置管理方法 ===

  /**
   * 更新配置
   * @param newConfig - 新的配置对象
   */
  const updateConfig = (newConfig: Partial<FooterConfig>) => {
    if (configHelpers.validateConfig(newConfig)) {
      customConfig.value = { ...customConfig.value, ...newConfig }
    } else {
      console.warn('Invalid config provided:', newConfig)
    }
  }

  /**
   * 重置配置为默认值
   */
  const resetConfig = () => {
    customConfig.value = {}
  }

  /**
   * 完全重置配置（包括默认配置）
   */
  const resetToDefaults = () => {
    config.value = configHelpers.createDefaultConfig()
    customConfig.value = {}
  }

  /**
   * 获取当前完整配置的副本
   */
  const getConfigSnapshot = () => {
    return configHelpers.cloneConfig(finalConfig.value)
  }

  /**
   * 批量更新配置
   * @param updates - 配置更新对象
   */
  const batchUpdateConfig = (updates: Partial<FooterConfig>) => {
    if (configHelpers.validateConfig(updates)) {
      // 合并当前的完整配置和更新配置
      const updatedConfig = configHelpers.mergeConfig(finalConfig.value, updates)
      customConfig.value = { ...customConfig.value, ...updates }
    }
  }

  return {
    // 状态（只读）
    config: computed(() => config.value),
    customConfig: computed(() => customConfig.value),

    // 计算属性
    finalConfig,
    footerText,
    footerHeight,

    // 方法
    updateConfig,
    resetConfig,
    resetToDefaults,
    getConfigSnapshot,
    batchUpdateConfig,
  }
}
