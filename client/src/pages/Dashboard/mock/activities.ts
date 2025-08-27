/**
 * 仪表盘活动记录 Mock 数据
 */

import type { ActivityItem } from '../types'

/**
 * 基础活动模板
 */
const activityTemplates = [
  {
    title: '用户登录',
    description: '{user} 用户成功登录系统',
    icon: 'mdi-login',
  },
  {
    title: '数据备份',
    description: '系统数据备份已完成',
    icon: 'mdi-backup-restore',
  },
  {
    title: '配置更新',
    description: '系统配置已更新',
    icon: 'mdi-cog',
  },
  {
    title: '安全扫描',
    description: '安全扫描已完成，{status}',
    icon: 'mdi-shield-check',
  },
  {
    title: '数据同步',
    description: '与外部系统数据同步完成',
    icon: 'mdi-sync',
  },
  {
    title: '报告生成',
    description: '{report} 报告已生成',
    icon: 'mdi-file-chart',
  },
  {
    title: '用户注册',
    description: '新用户 {user} 注册成功',
    icon: 'mdi-account-plus',
  },
  {
    title: '系统监控',
    description: '系统性能监控正常，CPU使用率 {cpu}%',
    icon: 'mdi-monitor',
  },
]

/**
 * 生成随机用户名
 */
const generateRandomUser = (): string => {
  const users = ['admin', 'manager', 'user01', 'operator', 'guest', 'system']
  return users[Math.floor(Math.random() * users.length)] || 'user'
}

/**
 * 生成随机状态
 */
const generateRandomStatus = (): string => {
  const statuses = ['无异常', '发现1个警告', '全部正常', '需要关注']
  return statuses[Math.floor(Math.random() * statuses.length)] || '正常'
}

/**
 * 生成随机报告类型
 */
const generateRandomReport = (): string => {
  const reports = ['日报', '周报', '月报', '性能报告', '用户行为报告']
  return reports[Math.floor(Math.random() * reports.length)] || '报告'
}

/**
 * 生成随机活动记录
 */
export const generateRandomActivity = (): ActivityItem => {
  const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]
  if (!template) {
    // 默认模板，防止数组为空
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: '系统活动',
      description: '系统执行了一个操作',
      timestamp: new Date(),
      icon: 'mdi-cog',
    }
  }

  const randomMinutes = Math.floor(Math.random() * 180) // 0-3小时内

  let description = template.description
    .replace('{user}', generateRandomUser())
    .replace('{status}', generateRandomStatus())
    .replace('{report}', generateRandomReport())
    .replace('{cpu}', Math.floor(Math.random() * 30 + 20).toString())

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: template.title,
    description,
    timestamp: new Date(Date.now() - randomMinutes * 60 * 1000),
    icon: template.icon,
  }
}

/**
 * 初始活动记录 Mock 数据
 */
export const mockActivities: ActivityItem[] = [
  {
    id: '1',
    title: '系统启动',
    description: '仪表盘系统成功启动',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    icon: 'mdi-power',
  },
  {
    id: '2',
    title: '用户登录',
    description: 'admin 用户成功登录系统',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    icon: 'mdi-login',
  },
  {
    id: '3',
    title: '数据更新',
    description: '用户统计数据已更新',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: 'mdi-database-sync',
  },
  {
    id: '4',
    title: '系统备份',
    description: '系统数据备份完成',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: 'mdi-backup-restore',
  },
  {
    id: '5',
    title: '配置变更',
    description: '系统配置已更新',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    icon: 'mdi-cog',
  },
]

/**
 * 生成指定数量的活动记录
 */
export const generateActivities = (count: number): ActivityItem[] => {
  return Array.from({ length: count }, () => generateRandomActivity()).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  )
}
