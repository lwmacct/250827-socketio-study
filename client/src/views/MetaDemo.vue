<script setup lang="ts">
// 路由Meta演示页面
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'

const routeMenuStore = useAppHeaderStore()

// 从路由meta中获取所有信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-information')
const pageTitle = routeMenuStore.useRouteTitle('Meta演示')
const pageDescription = routeMenuStore.useRouteDescription('演示路由meta自定义字段的使用')
const pageCategory = routeMenuStore.useRouteCategory('演示页面')
const routeMeta = routeMenuStore.useRouteMeta()
</script>

<template>
  <v-app>
    <!-- 使用通用头部组件 -->
    <AppHeader :title="pageTitle" :titleIcon="pageIcon" />

    <!-- 主要内容区域 -->
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10">
            <v-card class="mx-auto" max-width="1000">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon size="large" color="primary" class="mr-3">{{ pageIcon }}</v-icon>
                路由Meta自定义字段演示
              </v-card-title>
              <v-card-text class="text-body-1">
                <p class="mb-4">
                  这个页面演示了如何在路由meta中配置自定义字段，并在页面中动态获取和使用这些信息。
                </p>

                <v-divider class="my-4"></v-divider>

                <!-- 当前路由Meta信息展示 -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-h6">
                    <v-icon color="info" class="mr-2">mdi-information</v-icon>
                    当前路由Meta信息
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-list>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-format-title</v-icon>
                            </template>
                            <v-list-item-title>页面标题</v-list-item-title>
                            <v-list-item-subtitle>{{ pageTitle }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="secondary">mdi-icon</v-icon>
                            </template>
                            <v-list-item-title>页面图标</v-list-item-title>
                            <v-list-item-subtitle>{{ pageIcon }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="success">mdi-text</v-icon>
                            </template>
                            <v-list-item-title>页面描述</v-list-item-title>
                            <v-list-item-subtitle>{{ pageDescription }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="warning">mdi-folder</v-icon>
                            </template>
                            <v-list-item-title>页面分类</v-list-item-title>
                            <v-list-item-subtitle>{{ pageCategory }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card variant="tonal" color="info">
                          <v-card-title class="text-h6">完整Meta对象</v-card-title>
                          <v-card-text>
                            <pre class="text-caption">{{ JSON.stringify(routeMeta, null, 2) }}</pre>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- 自定义字段说明 -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-h6">
                    <v-icon color="success" class="mr-2">mdi-cog</v-icon>
                    可配置的自定义字段
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-list>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-format-title</v-icon>
                            </template>
                            <v-list-item-title>title</v-list-item-title>
                            <v-list-item-subtitle>页面标题</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="secondary">mdi-icon</v-icon>
                            </template>
                            <v-list-item-title>icon</v-list-item-title>
                            <v-list-item-subtitle>页面图标</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="success">mdi-text</v-icon>
                            </template>
                            <v-list-item-title>description</v-list-item-title>
                            <v-list-item-subtitle>页面描述</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="warning">mdi-tag</v-icon>
                            </template>
                            <v-list-item-title>keywords</v-list-item-title>
                            <v-list-item-subtitle>关键词数组</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-list>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="info">mdi-folder</v-icon>
                            </template>
                            <v-list-item-title>category</v-list-item-title>
                            <v-list-item-subtitle>页面分类</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="error">mdi-priority-high</v-icon>
                            </template>
                            <v-list-item-title>priority</v-list-item-title>
                            <v-list-item-subtitle>优先级</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="warning">mdi-menu</v-icon>
                            </template>
                            <v-list-item-title>showInMenu</v-list-item-title>
                            <v-list-item-subtitle>是否在菜单中显示</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="success">mdi-shield</v-icon>
                            </template>
                            <v-list-item-title>requireAuth</v-list-item-title>
                            <v-list-item-subtitle>是否需要认证</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-alert type="info" variant="tonal" class="mt-4 mb-6">
                  <template v-slot:prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  当前页面：Meta演示 (/meta-demo)
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 使用通用页脚组件 -->
    <AppFooter />
  </v-app>
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}

pre {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
