<script setup lang="ts">
// 页脚演示主页面
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'
import { useFooterDemoStore } from './stores/index'
import ModeSelector from './components/ModeSelector.vue'
import ConfigPanel from './components/ConfigPanel.vue'
import CodeExample from './components/CodeExample.vue'

const routeMenuStore = useAppHeaderStore()
const footerStore = useFooterDemoStore()

// 从路由meta中获取信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-foot-print')
const pageTitle = routeMenuStore.useRouteTitle('页脚演示')

// 页面生命周期
onMounted(() => {
  footerStore.initialize()
})

onUnmounted(() => {
  footerStore.saveToLocalStorage()
})
</script>

<template>
  <!-- 使用通用头部组件 -->
  <AppHeader
    :title="pageTitle"
    :titleIcon="pageIcon"
    :actions="[
      {
        icon: 'mdi-cog',
        text: '配置',
        color: 'primary',
        variant: 'text',
        onClick: () => console.log('配置按钮点击'),
      },
      {
        icon: 'mdi-information',
        text: '帮助',
        color: 'info',
        variant: 'text',
        onClick: () => console.log('帮助按钮点击'),
      },
    ]"
  />

  <!-- 主要内容区域 -->
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <!-- 页面标题 -->
          <v-card class="mb-6">
            <v-card-title class="text-h4 text-center pa-6">
              <v-icon size="large" color="primary" class="mr-3">{{ pageIcon }}</v-icon>
              页脚组件演示
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-body-1 mb-4">
                这个页面演示了 AppFooter 组件的不同配置和使用方式。
                使用页面级架构管理演示状态和配置。
              </p>
              <v-chip color="primary" variant="outlined" class="mr-2">
                <v-icon start>mdi-database</v-icon>
                页面级 Store
              </v-chip>
              <v-chip color="success" variant="outlined" class="mr-2">
                <v-icon start>mdi-puzzle</v-icon>
                组件化
              </v-chip>
              <v-chip color="info" variant="outlined">
                <v-icon start>mdi-code-tags</v-icon>
                TypeScript
              </v-chip>
            </v-card-text>
          </v-card>

          <!-- 演示模式选择 -->
          <ModeSelector
            :examples="footerStore.examples"
            :current-mode="footerStore.currentMode"
            @switch-mode="footerStore.switchMode"
            class="mb-6"
          />

          <v-row>
            <!-- 配置面板 -->
            <v-col cols="12" md="6">
              <ConfigPanel
                :config="footerStore.currentConfig"
                :show-long-content="footerStore.showLongContent"
                @update-config="footerStore.updateConfig"
                @toggle-long-content="footerStore.toggleLongContent"
                class="mb-6"
              />
            </v-col>

            <!-- 代码示例 -->
            <v-col cols="12" md="6">
              <CodeExample
                :code-example="footerStore.currentExample?.codeExample || ''"
                :config="footerStore.currentConfig"
                class="mb-6"
              />
            </v-col>
          </v-row>

          <!-- 当前模式说明 -->
          <v-alert
            :type="footerStore.currentExample?.color === 'info' ? 'info' : 'success'"
            variant="tonal"
            class="mb-6"
          >
            <template v-slot:prepend>
              <v-icon>{{ footerStore.currentExample?.icon || 'mdi-information' }}</v-icon>
            </template>
            <div class="text-body-2">
              <div class="font-weight-bold mb-1">
                {{ footerStore.currentExample?.title || '演示标题' }}
              </div>
              <div>{{ footerStore.modeDescription }}</div>
            </div>
          </v-alert>

          <!-- 长内容区域 -->
          <v-card v-if="footerStore.showLongContent" variant="outlined" class="mb-6">
            <v-card-title>长内容区域</v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">
                这个区域包含大量内容，用于演示页脚在不同内容长度下的表现。
                当内容超出视口高度时，可以观察固定模式和正常模式的区别。
              </p>
              <v-list>
                <v-list-item
                  v-for="i in 20"
                  :key="i"
                  :title="`内容项目 ${i}`"
                  :subtitle="`这是第 ${i} 个内容项目的详细描述，用于增加页面高度和演示滚动效果`"
                  prepend-icon="mdi-circle-small"
                />
              </v-list>
            </v-card-text>
          </v-card>

          <!-- 页面架构说明 -->
          <v-alert type="success" variant="tonal" class="mb-6">
            <template v-slot:prepend>
              <v-icon>mdi-folder-outline</v-icon>
            </template>
            <div class="text-body-2">
              <div class="font-weight-bold mb-2">🏗️ 页面级架构演示:</div>
              <div>• 路径: <code>pages/FooterDemo/</code></div>
              <div>• Store: <code>pages/FooterDemo/stores/index.ts</code></div>
              <div>• 类型: <code>pages/FooterDemo/types.ts</code></div>
              <div>• 组件: <code>pages/FooterDemo/components/</code></div>
              <div class="text-caption mt-2 text-medium-emphasis">
                💡 演示了复杂页面的标准组织结构
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <!-- 使用动态配置的页脚组件 -->
  <AppFooter
    :fixed="footerStore.currentConfig.fixed"
    :show-links="footerStore.currentConfig.showLinks"
    :custom-text="footerStore.currentConfig.customText"
  />
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
