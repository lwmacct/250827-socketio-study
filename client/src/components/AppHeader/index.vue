<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useAppHeaderStore } from './stores'
import FavoriteMenu from './components/FavoriteMenu.vue'
import ProductsPanel from './components/ProductsPanel.vue'
import AllPagesMenuItem from './components/AllPagesMenuItem.vue'
import RecentPagesMenuItem from './components/RecentPagesMenuItem.vue'
import type { Props } from './types'

const props = withDefaults(defineProps<Props>(), {
  title: '控制台',
  titleIcon: 'mdi-console',
  showTitle: true,
  showNavIcon: true,
  navIcon: 'mdi-menu',
  navIconColor: 'white',
  showDrawer: true,
  drawerWidth: 240,
  elevation: 2,
  color: 'grey-darken-4',
  height: 50,
  useCustomContent: false,
  customContent: undefined,
})

const router = useRouter()
const routeMenuStore = useAppHeaderStore()
const drawer = ref(false)
const hoveredItem = ref<string | null>(null)

// 监听抽屉状态，关闭时隐藏二级菜单
watch(drawer, (newValue) => {
  if (!newValue) {
    hoveredItem.value = null
  }
})

const navigateTo = (path: string) => {
  router.push(path)
  routeMenuStore.recordAccess(path) // 记录访问时间
  drawer.value = false // Close drawer on navigation
  hoveredItem.value = null // Hide hover panel
}

// 处理导航图标点击
const handleNavIconClick = () => {
  if (props.onNavIconClick) {
    props.onNavIconClick()
  } else if (props.showDrawer) {
    drawer.value = !drawer.value
  }
}

// 添加收藏项的方法
const addToFavorites = (item: any) => {
  routeMenuStore.toggleFavorite(item.path)
}

// 移除收藏项的方法
const removeFromFavorites = (path: string) => {
  routeMenuStore.toggleFavorite(path)
}

const handleMouseEnter = (itemId: string) => {
  hoveredItem.value = itemId
}
</script>

<template>
  <!-- 头部导航栏 -->
  <v-app-bar app :elevation="elevation" :color="color" dark :height="height">
    <!-- 导航图标 -->
    <v-app-bar-nav-icon
      v-if="showNavIcon"
      @click="handleNavIconClick"
      :color="navIconColor"
      variant="text"
      class="mr-2"
    >
      <v-icon>{{ drawer ? 'mdi-close' : navIcon }}</v-icon>
    </v-app-bar-nav-icon>
    <!-- 菜单按钮分割线 -->
    <v-divider vertical color="white"></v-divider>
    <!-- 自定义内容或默认内容 -->
    <template v-if="useCustomContent">
      <!-- 插槽：自定义导航栏右侧内容 -->
      <slot name="custom-content"></slot>
    </template>
    <template v-else>
      <!-- 默认内容 -->
      <v-app-bar-title v-if="showTitle" class="text-h6">
        <v-icon v-if="titleIcon" class="mr-2" color="white">{{ titleIcon }}</v-icon>
        {{ title }}
      </v-app-bar-title>
    </template>
  </v-app-bar>

  <!-- 抽屉菜单 -->
  <v-navigation-drawer
    v-if="showDrawer"
    v-model="drawer"
    app
    temporary
    color="grey-darken-4"
    dark
    class="drawer-container"
    :width="drawerWidth"
  >
    <v-list color="transparent" nav class="drawer-list">
      <!-- 所有页面菜单项 -->
      <AllPagesMenuItem :hovered-item="hoveredItem" :on-mouse-enter="handleMouseEnter" />
      <v-divider class="my-2" color="grey-lighten-1"></v-divider>

      <!-- 最近访问菜单项 -->
      <RecentPagesMenuItem :on-navigate="navigateTo" />
      <v-divider class="my-2" color="grey-lighten-1"></v-divider>

      <!-- 收藏菜单组件 -->
      <FavoriteMenu :on-remove-from-favorites="removeFromFavorites" />
    </v-list>

    <!-- 悬停显示的二级菜单面板 -->
    <div
      v-if="hoveredItem && drawer"
      class="hover-panel"
      @mouseenter="handleMouseEnter(hoveredItem)"
    >
      <!-- 连接区域 - 确保鼠标可以移动到面板 -->
      <div class="connection-area"></div>
      <!-- 面板内容 -->
      <!-- 所有页面专用组件 -->
      <template v-if="hoveredItem === 'all-products'">
        <ProductsPanel
          :on-navigate="navigateTo"
          :on-add-to-favorites="addToFavorites"
          :on-remove-from-favorites="removeFromFavorites"
        />
      </template>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.drawer-container {
  position: relative;
}

:deep(.v-list-item__prepend) {
  width: 30px !important;
}

.drawer-list {
  padding-top: 0;
}

.menu-item-container {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
}

.menu-item {
  border-radius: 0;
  transition: all 0.3s ease;
  margin: 0;
  padding: 0;
  width: 100%;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active-menu-item {
  background-color: #616161 !important;
  color: #ffffff !important;
}

.active-menu-item:hover {
  background-color: #757575 !important;
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.menu-item:hover .chevron-icon {
  transform: translateX(4px);
}

.favorite-active {
  color: #ffd700 !important;
}

/* 悬停面板样式 */
.hover-panel {
  position: absolute;
  left: 100%; /* 相对于抽屉的右边缘 */
  top: 0; /* 相对于抽屉的顶部 */
  min-width: 300px; /* 最小宽度 */
  max-width: 800px; /* 进一步增加最大宽度限制 */
  height: 100%; /* 相对于抽屉的高度 */
  background-color: #424242;
  border-left: 1px solid #616161;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.3);
  overflow: visible;
}
</style>
