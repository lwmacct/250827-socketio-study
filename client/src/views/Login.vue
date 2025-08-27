<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '@/components/AppFooter/index.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = () => {
  // 这里可以添加登录逻辑
  console.log('登录信息:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
  // 登录成功后跳转到首页
  router.push('/')
}
</script>

<template>
  <!-- 登录页面不显示头部 -->

  <!-- 主要内容区域 -->
  <v-main
    class="d-flex align-center justify-center"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh"
  >
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="mx-auto" max-width="400" elevation="12">
            <v-card-title class="text-h4 text-center pa-6">
              <v-icon size="large" color="primary" class="mr-3">mdi-login</v-icon>
              用户登录
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="邮箱"
                  prepend-icon="mdi-email"
                  variant="outlined"
                  type="email"
                  required
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="密码"
                  prepend-icon="mdi-lock"
                  variant="outlined"
                  type="password"
                  required
                  class="mb-4"
                ></v-text-field>

                <v-checkbox
                  v-model="rememberMe"
                  label="记住我"
                  color="primary"
                  class="mb-4"
                ></v-checkbox>

                <v-btn
                  @click="handleLogin"
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-login"
                  block
                  size="large"
                  type="submit"
                >
                  登录
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-center pa-4">
              <v-btn @click="router.push('/')" variant="text" prepend-icon="mdi-arrow-left">
                返回首页
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <!-- 登录页面使用简化的页脚 -->
  <AppFooter :show-links="false" custom-text="© 2024 登录系统" :fixed="true" />
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
