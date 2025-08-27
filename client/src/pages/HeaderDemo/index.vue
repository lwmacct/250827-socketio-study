<script setup lang="ts">
// 头部演示主页面
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'
import { useHeaderDemoStore } from './stores/index'
import SlotTemplate from './components/SlotTemplate.vue'
import SlotDemo from './components/SlotDemo.vue'
import StylesDemo from './components/StylesDemo.vue'

const routeMenuStore = useAppHeaderStore()
const headerStore = useHeaderDemoStore()

// 从路由meta中获取信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-puzzle')
const pageTitle = routeMenuStore.useRouteTitle('头部演示')

// 页面生命周期
onMounted(() => {
  headerStore.initialize()
})

onUnmounted(() => {
  headerStore.saveToLocalStorage()
})

// 根据模式生成插槽内容
const generateSlotContent = () => {
  if (!headerStore.useSlotContent) return null

  const style = headerStore.currentStyle

  // 根据不同主题返回不同的插槽内容
  if (style.color === 'primary') {
    return {
      content: [
        { icon: 'mdi-bell', badge: '3', color: 'white' },
        { icon: 'mdi-account', color: 'white' },
        { chip: { text: '在线', icon: 'mdi-check-circle' } },
      ],
    }
  } else if (style.color === 'grey-darken-4') {
    return {
      content: [
        { icon: 'mdi-weather-night', color: 'white' },
        { icon: 'mdi-cog', color: 'white' },
        { chip: { text: '夜间模式', icon: 'mdi-account-circle' } },
      ],
    }
  }

  return null
}
</script>

<template>
  <v-app>
    <!-- 动态演示头部 -->
    <AppHeader
      :title="pageTitle"
      :titleIcon="pageIcon"
      :actions="headerStore.headerActions"
      :color="headerStore.currentStyle.color"
      :elevation="headerStore.currentStyle.elevation"
      :height="headerStore.currentStyle.height"
      :navIconColor="headerStore.currentStyle.navIconColor"
      :use-custom-content="headerStore.currentMode === 'slot'"
    >
      <!-- 插槽模式的自定义内容 -->
      <template v-if="headerStore.currentMode === 'slot'" #custom-content>
        <SlotTemplate />
      </template>

      <!-- 样式模式的插槽内容 -->
      <template
        v-else-if="headerStore.currentMode === 'styles' && headerStore.useSlotContent"
        #custom-content
      >
        <!-- 默认主题插槽 -->
        <div v-if="headerStore.currentStyle.color === 'primary'" class="d-flex align-center">
          <v-btn icon="mdi-bell" variant="text" color="white" class="mr-2">
            <v-badge content="3" color="error" offset-x="8" offset-y="-8">
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
          <v-btn icon="mdi-account" variant="text" color="white" class="mr-2">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-chip color="white" variant="outlined" size="small">
            <v-icon start>mdi-check-circle</v-icon>
            在线
          </v-chip>
        </div>

        <!-- 深色主题插槽 -->
        <div
          v-else-if="headerStore.currentStyle.color === 'grey-darken-4'"
          class="d-flex align-center"
        >
          <v-btn icon="mdi-weather-night" variant="text" color="white" class="mr-2">
            <v-icon>mdi-weather-night</v-icon>
          </v-btn>
          <v-btn icon="mdi-cog" variant="text" color="white" class="mr-2">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-chip color="grey-lighten-1" variant="outlined" size="small">
            <v-icon start>mdi-account-circle</v-icon>
            夜间模式
          </v-chip>
        </div>

        <!-- 其他主题插槽 -->
        <div v-else class="d-flex align-center">
          <v-btn icon="mdi-star" variant="text" color="white" class="mr-2">
            <v-icon>mdi-star</v-icon>
          </v-btn>
          <v-btn icon="mdi-heart" variant="text" color="white" class="mr-2">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-chip color="white" variant="outlined" size="small">
            <v-icon start>mdi-emoticon-happy</v-icon>
            主题模式
          </v-chip>
        </div>
      </template>
    </AppHeader>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="10">
            <!-- 页面标题 -->
            <v-card class="mb-6">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon size="large" color="primary" class="mr-3">{{ pageIcon }}</v-icon>
                头部组件演示
              </v-card-title>
              <v-card-text class="text-center">
                <p class="text-body-1 mb-4">
                  这个页面演示了 AppHeader 组件的不同使用方式和配置选项。
                  使用页面级架构管理演示状态，支持插槽和样式两种演示模式。
                </p>
                <v-chip
                  :color="headerStore.currentMode === 'slot' ? 'primary' : 'default'"
                  variant="outlined"
                  class="mr-2"
                  @click="headerStore.switchMode('slot')"
                  style="cursor: pointer"
                >
                  <v-icon start>mdi-puzzle</v-icon>
                  插槽演示
                </v-chip>
                <v-chip
                  :color="headerStore.currentMode === 'styles' ? 'secondary' : 'default'"
                  variant="outlined"
                  @click="headerStore.switchMode('styles')"
                  style="cursor: pointer"
                >
                  <v-icon start>mdi-palette</v-icon>
                  样式演示
                </v-chip>
              </v-card-text>
            </v-card>

            <!-- 插槽演示模式 -->
            <SlotDemo v-if="headerStore.currentMode === 'slot'" />

            <!-- 样式演示模式 -->
            <StylesDemo
              v-else-if="headerStore.currentMode === 'styles'"
              :use-slot-content="headerStore.useSlotContent"
              :current-style="headerStore.currentStyle"
              :style-themes="headerStore.styleThemes"
              @toggle-slot="headerStore.toggleSlotContent"
              @switch-theme="headerStore.switchTheme"
            />

            <!-- 当前演示模式说明 -->
            <v-alert
              :type="headerStore.currentExample?.color === 'primary' ? 'info' : 'success'"
              variant="tonal"
              class="mb-6"
            >
              <template v-slot:prepend>
                <v-icon>{{ headerStore.currentExample?.icon || 'mdi-puzzle' }}</v-icon>
              </template>
              <div class="text-body-2">
                <div class="font-weight-bold mb-1">
                  {{ headerStore.currentExample?.title || '演示标题' }}
                </div>
                <div class="mb-2">{{ headerStore.modeDescription }}</div>
                <div class="text-caption">
                  <strong>特性：</strong>
                  {{ headerStore.currentExample?.features?.join('、') || '演示功能' }}
                </div>
              </div>
            </v-alert>

            <!-- 页面架构说明 -->
            <v-alert type="success" variant="tonal" class="mb-6">
              <template v-slot:prepend>
                <v-icon>mdi-folder-outline</v-icon>
              </template>
              <div class="text-body-2">
                <div class="font-weight-bold mb-2">🏗️ 页面级架构演示:</div>
                <div>• 路径: <code>pages/HeaderDemo/</code></div>
                <div>• Store: <code>pages/HeaderDemo/stores/index.ts</code></div>
                <div>• 类型: <code>pages/HeaderDemo/types.ts</code></div>
                <div>• 组件: <code>pages/HeaderDemo/components/</code></div>
                <div class="text-caption mt-2 text-medium-emphasis">
                  💡 点击头部按钮可切换演示模式
                </div>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
