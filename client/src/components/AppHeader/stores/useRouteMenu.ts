/**
 * 路由菜单管理 Composable
 */

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteMenuItem } from '../types'

export function useRouteMenu() {
  const router = useRouter()

  // === 路由菜单状态 ===
  // 用户状态存储（持久化）
  const userFavorites = ref<string[]>(['/', '/dashboard', '/header-demo', '/footer-demo'])
  const userAccessHistory = ref<Map<string, number>>(
    new Map([
      ['/', Date.now() - 1000 * 60 * 1], // 1分钟前
      ['/dashboard', Date.now() - 1000 * 60 * 3], // 3分钟前
      ['/header-demo', Date.now() - 1000 * 60 * 5], // 5分钟前
      ['/footer-demo', Date.now() - 1000 * 60 * 2], // 2分钟前
    ]),
  )

  // === 路由菜单计算属性 ===

  // 从路由配置生成菜单项
  const generateMenuFromRoutes = (routes: RouteRecordRaw[]): RouteMenuItem[] => {
    const menuItems: RouteMenuItem[] = []

    routes.forEach((route) => {
      // 跳过404和重定向路由
      if (route.path === '/:pathMatch(.*)*' || route.redirect) {
        return
      }

      const meta = (route.meta as any) || {}
      const menuItem: RouteMenuItem = {
        title: (meta.title as string) || (route.name as string) || '未命名页面',
        path: route.path,
        icon: (meta.icon as string) || 'mdi-help',
        description: meta.description as string,
        category: (meta.category as string) || '其他',
        priority: (meta.priority as number) || 999,
        showInMenu: (meta.showInMenu as boolean) !== false, // 默认显示
        requireAuth: (meta.requireAuth as boolean) === true,
        isFavorite: userFavorites.value.includes(route.path), // 从用户状态获取
        lastAccessed: userAccessHistory.value.get(route.path), // 从用户状态获取
      }

      // 如果有子路由，递归处理
      if (route.children && route.children.length > 0) {
        menuItem.children = generateMenuFromRoutes(route.children)
      }

      // 只添加配置了showInMenu的路由
      if (menuItem.showInMenu) {
        menuItems.push(menuItem)
      }
    })

    // 按优先级排序
    return menuItems.sort((a, b) => (a.priority || 999) - (b.priority || 999))
  }

  // 生成所有菜单项
  const allMenuItems = computed(() => {
    return generateMenuFromRoutes(router.getRoutes())
  })

  // 按分类分组的菜单项
  const menuItemsByCategory = computed(() => {
    const categories: { [key: string]: RouteMenuItem[] } = {}

    allMenuItems.value.forEach((item) => {
      const category = item.category || '其他'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(item)
    })

    return categories
  })

  // 收藏的菜单项
  const favoriteItems = computed(() => {
    const allFavorites = allMenuItems.value.filter((item) => item.isFavorite)

    // 按照userFavorites的顺序返回收藏项
    return userFavorites.value
      .map((path) => allFavorites.find((item) => item.path === path))
      .filter((item) => item !== undefined) as RouteMenuItem[]
  })

  // 最近访问的菜单项
  const recentItems = computed(() => {
    return allMenuItems.value
      .filter((item) => item.lastAccessed)
      .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
      .slice(0, 10)
  })

  // === 路由菜单操作方法 ===

  // 切换收藏状态
  const toggleFavorite = (path: string) => {
    if (userFavorites.value.includes(path)) {
      userFavorites.value = userFavorites.value.filter((p) => p !== path)
    } else {
      userFavorites.value.push(path)
    }
  }

  // 检查是否已收藏
  const isFavorite = (path: string) => {
    return userFavorites.value.includes(path)
  }

  // 重新排序收藏项
  const reorderFavorites = (fromIndex: number, toIndex: number) => {
    const items = favoriteItems.value

    if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
      return
    }

    // 直接操作favoriteOrder数组
    const [movedPath] = userFavorites.value.splice(fromIndex, 1)
    if (movedPath) {
      userFavorites.value.splice(toIndex, 0, movedPath)
    }
  }

  // 记录访问时间
  const recordAccess = (path: string) => {
    userAccessHistory.value.set(path, Date.now())
  }

  // 根据路径获取菜单项
  const getMenuItemByPath = (path: string) => {
    return allMenuItems.value.find((item) => item.path === path)
  }

  // 根据分类获取菜单项
  const getMenuItemsByCategory = (category: string) => {
    return allMenuItems.value.filter((item) => item.category === category)
  }

  // 获取当前路由的菜单项
  const getCurrentMenuItem = () => {
    const currentRoute = router.currentRoute.value
    return getMenuItemByPath(currentRoute.path)
  }

  return {
    // 路由菜单数据
    allMenuItems,
    menuItemsByCategory,
    favoriteItems,
    recentItems,

    // 路由菜单操作方法
    toggleFavorite,
    isFavorite,
    reorderFavorites,
    recordAccess,
    getMenuItemByPath,
    getMenuItemsByCategory,
    getCurrentMenuItem,
  }
}
