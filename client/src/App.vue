<script setup lang="ts">
// 主应用组件 - 路由入口
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppHeaderStore } from '@/components/AppHeader/stores'

const route = useRoute()
const routeMenuStore = useAppHeaderStore()

// 监听路由变化，更新页面访问时间
watch(
  () => route.path,
  (newPath) => {
    // 当路由变化时，记录访问时间
    routeMenuStore.recordAccess(newPath)
  },
  { immediate: true }, // 立即执行一次，确保初始页面也被记录
)
</script>

<template>
  <v-app>
    <!-- 路由视图 -->
    <router-view />
  </v-app>
</template>

<style scoped>
.v-app {
  min-height: 100vh;
}
</style>
