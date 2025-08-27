/**
 * 仪表盘统计数据 Mock
 */

import type { StatCard } from '../types'

/**
 * 统计卡片 Mock 数据
 */
export const mockStats: StatCard[] = [
  {
    id: 'total-users',
    title: '总用户数',
    value: 1234,
    icon: 'mdi-account-group',
    color: 'primary',
    format: 'number',
  },
  {
    id: 'active-users',
    title: '活跃用户',
    value: 567,
    icon: 'mdi-chart-line',
    color: 'success',
    format: 'number',
  },
  {
    id: 'daily-visits',
    title: '今日访问',
    value: 89,
    icon: 'mdi-clock',
    color: 'warning',
    format: 'number',
  },
  {
    id: 'data-records',
    title: '数据记录',
    value: 456,
    icon: 'mdi-database',
    color: 'info',
    format: 'number',
  },
  {
    id: 'system-status',
    title: '系统状态',
    value: '正常',
    icon: 'mdi-check-circle',
    color: 'success',
    format: 'text',
  },
  {
    id: 'disk-usage',
    title: '磁盘使用',
    value: '78%',
    icon: 'mdi-harddisk',
    color: 'orange',
    format: 'text',
  },
]

/**
 * 生成随机统计数据
 * 用于模拟实时数据更新
 */
export const generateRandomStats = (): Partial<Record<string, number | string>> => {
  return {
    'total-users': Math.floor(Math.random() * 100) + 1200,
    'active-users': Math.floor(Math.random() * 50) + 550,
    'daily-visits': Math.floor(Math.random() * 30) + 70,
    'data-records': Math.floor(Math.random() * 100) + 400,
    'disk-usage': `${Math.floor(Math.random() * 20) + 70}%`,
  }
}
