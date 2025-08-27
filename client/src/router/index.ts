import { createRouter, createWebHashHistory } from 'vue-router'
import { setPageTitle } from '@/components/AppHeader/utils'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home/index.vue'),
      meta: {
        title: '首页',
        icon: 'mdi-home',
        description: '应用首页，展示主要功能',
        keywords: ['首页', '主页', 'home'],
        category: '基础页面',
        priority: 1,
        showInMenu: true,
        requireAuth: false,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: {
        title: '关于',
        icon: 'mdi-information',
        description: '关于页面，介绍应用信息',
        keywords: ['关于', 'about', '介绍'],
        category: '基础页面',
        priority: 4,
        showInMenu: true,
        requireAuth: false,
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
      meta: {
        title: '联系我们',
        icon: 'mdi-email',
        description: '联系页面，提供联系方式和服务信息',
        keywords: ['联系', 'contact', '邮箱', '电话'],
        category: '基础页面',
        priority: 2,
        showInMenu: true,
        requireAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录',
        icon: 'mdi-login',
        description: '用户登录页面',
        keywords: ['登录', 'login', '用户认证'],
        category: '基础页面',
        priority: 5,
        showInMenu: true,
        requireAuth: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/Dashboard/index.vue'),
      meta: {
        title: '仪表板',
        icon: 'mdi-view-dashboard',
        description: '系统仪表板，展示关键指标和实时数据',
        keywords: ['仪表板', 'dashboard', '统计', '数据', '监控'],
        category: '基础页面',
        priority: 3,
        showInMenu: true,
        requireAuth: true,
      },
    },
    {
      path: '/meta-demo',
      name: 'meta-demo',
      component: () => import('@/views/MetaDemo.vue'),
      meta: {
        title: 'Meta演示',
        icon: 'mdi-information',
        description: '演示路由meta自定义字段的使用',
        keywords: ['meta', '演示', '自定义字段'],
        category: 'Demo',
        priority: 4,
        showInMenu: true,
        requireAuth: false,
      },
    },
    // AppHeader 演示页面
    {
      path: '/header-demo',
      name: 'header-demo',
      component: () => import('@/pages/HeaderDemo/index.vue'),
      meta: {
        title: '头部演示',
        icon: 'mdi-puzzle',
        description: 'AppHeader组件的插槽和样式演示',
        keywords: ['header', '头部', '插槽', '样式', '演示'],
        category: 'Demo',
        priority: 10,
        showInMenu: true,
        requireAuth: false,
      },
    },

    // AppFooter 演示页面
    {
      path: '/footer-demo',
      name: 'footer-demo',
      component: () => import('@/pages/FooterDemo/index.vue'),
      meta: {
        title: '页脚演示',
        icon: 'mdi-foot-print',
        description: 'AppFooter组件的各种配置和使用方式演示',
        keywords: ['footer', '页脚', '演示', '组件'],
        category: 'Demo',
        priority: 13,
        showInMenu: true,
        requireAuth: false,
      },
    },
    // 404 页面重定向到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 全局路由守卫 - 自动更新页面标题
router.beforeEach((to, from, next) => {
  // 获取路由的 meta.title
  const title = to.meta?.title as string

  // 使用页面标题管理工具设置标题
  setPageTitle(title)

  // 继续路由导航
  next()
})

export default router
