<script setup lang="ts">
// 联系页面组件
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
import { useAppHeaderStore } from '@/components/AppHeader/stores'

const routeMenuStore = useAppHeaderStore()

// 从路由meta中获取信息
const pageIcon = routeMenuStore.useRouteIcon('mdi-email')
const pageTitle = routeMenuStore.useRouteTitle('联系我们')
const pageDescription = routeMenuStore.useRouteDescription('联系页面，提供联系方式和服务信息')
</script>

<template>
  <v-app>
    <!-- 使用通用头部组件 -->
    <AppHeader :title="pageTitle" :titleIcon="pageIcon" />

    <!-- 主要内容区域 -->
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="mx-auto" max-width="800">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon size="large" color="secondary" class="mr-3">{{ pageIcon }}</v-icon>
                联系我们
              </v-card-title>
              <v-card-text class="text-body-1">
                <p class="mb-4">
                  如果您有任何问题或建议，请随时与我们联系。我们很乐意为您提供帮助。
                </p>
                <v-divider class="my-4"></v-divider>
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-email"
                    title="邮箱"
                    subtitle="contact@example.com"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-phone"
                    title="电话"
                    subtitle="+86 123 4567 8900"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-map-marker"
                    title="地址"
                    subtitle="北京市朝阳区某某街道123号"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-clock"
                    title="工作时间"
                    subtitle="周一至周五 9:00-18:00"
                  ></v-list-item>
                </v-list>
                <v-alert type="info" variant="tonal" class="mt-4 mb-6">
                  <template v-slot:prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  当前页面：联系 (/contact)
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
</style>
