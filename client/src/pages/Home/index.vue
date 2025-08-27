<script setup lang="ts">
// 首页组件
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'
import { useHomeStore } from './stores/index'

const routeMenuStore = useAppHeaderStore()
const homeStore = useHomeStore()

// 从路由meta中获取信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-home')
const pageTitle = routeMenuStore.useRouteTitle('首页')

// 页面生命周期
onMounted(() => {
  homeStore.initialize()
})

onUnmounted(() => {
  homeStore.saveToLocalStorage()
})
</script>

<template>
  <!-- 使用通用头部组件 -->
  <AppHeader
    :title="pageTitle"
    :titleIcon="pageIcon"
    :actions="[
      {
        icon: 'mdi-chart-line',
        text: '统计',
        color: homeStore.showStatistics ? 'success' : 'grey',
        variant: 'text',
        onClick: () => homeStore.toggleStatistics(),
      },
      {
        icon: 'mdi-bell',
        text: '通知',
        color: 'warning',
        variant: 'text',
        onClick: () => console.log('通知按钮点击'),
      },
    ]"
  />

  <!-- 主要内容区域 -->
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="mx-auto" max-width="800">
            <v-card-title class="text-h4 text-center pa-6">
              <v-icon size="large" color="primary" class="mr-3">{{ pageIcon }}</v-icon>
              欢迎使用
            </v-card-title>
            <v-card-text class="text-body-1">
              <p class="mb-4">
                这是一个基于 Vue 3、Vuetify 3 和 TypeScript 构建的现代化 Web 应用程序。
                它展示了如何使用这些技术构建功能丰富、用户友好的界面。
              </p>
              <v-divider class="my-4"></v-divider>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-h6">
                      <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                      功能特性
                    </v-card-title>
                    <v-card-text>
                      <ul class="text-body-2">
                        <li>响应式设计</li>
                        <li>现代化 UI</li>
                        <li>类型安全</li>
                        <li>组件化架构</li>
                      </ul>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-h6">
                      <v-icon color="info" class="mr-2">mdi-information</v-icon>
                      技术栈
                    </v-card-title>
                    <v-card-text>
                      <ul class="text-body-2">
                        <li>Vue 3 Composition API</li>
                        <li>Vuetify 3 Material Design</li>
                        <li>TypeScript</li>
                        <li>Vue Router 4</li>
                      </ul>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <!-- 页面级 Store 演示 -->
              <v-alert
                v-if="homeStore.showStatistics"
                type="info"
                variant="tonal"
                class="mt-4 mb-6"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-database</v-icon>
                </template>
                <div class="text-body-2">
                  <div><strong>📊 页面级 Store 演示:</strong></div>
                  <div>• 访问次数: {{ homeStore.stats.visitCount }}</div>
                  <div>• 上次访问: {{ homeStore.formattedLastVisit }}</div>
                  <div>• 本次会话: {{ homeStore.sessionDuration }}</div>
                  <div class="text-caption mt-2 text-medium-emphasis">
                    💡 这些数据由页面级 Store 管理，支持本地存储持久化
                  </div>
                </div>
              </v-alert>

              <!-- 页面信息 -->
              <v-alert type="success" variant="tonal" class="mt-4 mb-6">
                <template v-slot:prepend>
                  <v-icon>mdi-folder-outline</v-icon>
                </template>
                <div class="text-body-2">
                  <div><strong>🗂️ 页面级架构演示:</strong></div>
                  <div>• 路径: <code>pages/Home/</code></div>
                  <div>• Store: <code>pages/Home/stores/index.ts</code></div>
                  <div>• 类型: <code>pages/Home/types.ts</code></div>
                  <div>• 组件: <code>pages/Home/components/</code></div>
                  <div class="text-caption mt-2 text-medium-emphasis">
                    💡 点击头部"统计"按钮可切换显示状态
                  </div>
                </div>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <!-- 使用通用页脚组件 -->
  <AppFooter />
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
