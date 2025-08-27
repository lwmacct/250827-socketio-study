/**
 * 仪表盘快速操作 Mock 数据
 */

import type { QuickAction } from '../types'

/**
 * 快速操作处理函数映射
 */
const actionHandlers: Record<string, () => void> = {
  'add-user': () => {
    console.log('🔧 执行添加用户操作')
    // TODO: 实际的添加用户逻辑
  },
  'view-reports': () => {
    console.log('📊 打开报告页面')
    // TODO: 跳转到报告页面
  },
  'system-settings': () => {
    console.log('⚙️ 打开系统设置')
    // TODO: 跳转到设置页面
  },
  'help-docs': () => {
    console.log('📖 打开帮助文档')
    // TODO: 打开帮助文档
  },
  'backup-data': () => {
    console.log('💾 开始数据备份')
    // TODO: 执行数据备份
  },
  'monitor-system': () => {
    console.log('📈 打开系统监控')
    // TODO: 跳转到监控页面
  },
  'security-scan': () => {
    console.log('🔒 开始安全扫描')
    // TODO: 执行安全扫描
  },
  'export-data': () => {
    console.log('📤 导出数据')
    // TODO: 执行数据导出
  },
}

/**
 * 快速操作 Mock 数据
 */
export const mockQuickActions: Omit<QuickAction, 'onClick'>[] = [
  {
    id: 'add-user',
    title: '添加用户',
    icon: 'mdi-account-plus',
    color: 'primary',
    variant: 'outlined',
  },
  {
    id: 'view-reports',
    title: '查看报告',
    icon: 'mdi-file-chart',
    color: 'success',
    variant: 'outlined',
  },
  {
    id: 'system-settings',
    title: '系统设置',
    icon: 'mdi-cog',
    color: 'info',
    variant: 'outlined',
  },
  {
    id: 'help-docs',
    title: '帮助文档',
    icon: 'mdi-help-circle',
    color: 'grey',
    variant: 'outlined',
  },
  {
    id: 'backup-data',
    title: '数据备份',
    icon: 'mdi-backup-restore',
    color: 'warning',
    variant: 'outlined',
  },
  {
    id: 'monitor-system',
    title: '系统监控',
    icon: 'mdi-monitor',
    color: 'purple',
    variant: 'outlined',
  },
  {
    id: 'security-scan',
    title: '安全扫描',
    icon: 'mdi-shield-check',
    color: 'red',
    variant: 'outlined',
  },
  {
    id: 'export-data',
    title: '导出数据',
    icon: 'mdi-download',
    color: 'teal',
    variant: 'outlined',
  },
]

/**
 * 创建带有处理函数的快速操作
 */
export const createQuickActions = (): QuickAction[] => {
  return mockQuickActions.map((action) => ({
    ...action,
    onClick: actionHandlers[action.id] || (() => console.log(`未实现的操作: ${action.title}`)),
  }))
}

/**
 * 获取默认的快速操作（前4个）
 */
export const getDefaultQuickActions = (): QuickAction[] => {
  return createQuickActions().slice(0, 4)
}

/**
 * 获取所有快速操作
 */
export const getAllQuickActions = (): QuickAction[] => {
  return createQuickActions()
}
