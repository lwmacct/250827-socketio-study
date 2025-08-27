<script setup lang="ts">
// 关于页面组件
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'
</script>

<template>
  <v-app>
    <!-- 使用通用头部组件 -->
    <AppHeader title="Vue + Vuetify 应用" />

    <!-- 主要内容区域 -->
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="mx-auto" max-width="800">
              <v-card-title class="text-h4 text-center pa-6">
                <v-icon size="large" color="secondary" class="mr-3">mdi-information</v-icon>
                关于我们
              </v-card-title>
              <v-card-text class="text-body-1">
                <p class="mb-4">
                  这是一个演示项目，展示了如何使用 Vue 3、Vuetify 3 和 Vue Router 4 构建现代化的 Web
                  应用程序。
                </p>
                <v-divider class="my-4"></v-divider>
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-vuejs"
                    title="Vue 3"
                    subtitle="渐进式 JavaScript 框架"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-vuetify"
                    title="Vuetify 3"
                    subtitle="Material Design 组件库"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-router"
                    title="Vue Router 4"
                    subtitle="官方路由管理器"
                  ></v-list-item>
                  <v-list-item
                    prepend-icon="mdi-language-typescript"
                    title="TypeScript"
                    subtitle="类型安全的 JavaScript"
                  ></v-list-item>
                </v-list>
                <v-alert type="success" variant="tonal" class="mt-4 mb-6">
                  <template v-slot:prepend>
                    <v-icon>mdi-check-circle</v-icon>
                  </template>
                  当前页面：关于 (/about)
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
