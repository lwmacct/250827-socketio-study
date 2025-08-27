<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-puzzle</v-icon>
      插槽方式演示
    </v-card-title>
    <v-card-text>
      <p class="text-body-1 mb-4">
        使用插槽方式可以完全自定义导航栏右侧的内容，支持完整的 Vue 组件功能，
        包括响应式数据、事件处理、状态管理等。本示例展示了类似 GitHub 的用户头像和抽屉功能。
      </p>

      <!-- 功能演示说明 -->
      <v-alert type="success" variant="tonal" class="mb-4">
        <template v-slot:prepend>
          <v-icon>mdi-check-circle</v-icon>
        </template>
        <strong>功能演示：</strong>
        <ul class="mt-2">
          <li>点击通知按钮：减少通知数量，数量为0时会自动重置</li>
          <li>点击用户按钮：切换用户状态（在线/忙碌）</li>
          <li>点击用户状态芯片：循环切换状态（在线→忙碌→离开→勿扰）</li>
          <li>点击设置按钮：模拟设置面板切换</li>
          <li><strong>点击用户头像：打开右侧抽屉菜单（类似 GitHub）</strong></li>
          <li>抽屉中包含：用户信息、状态、个人资料、设置、登出等功能</li>
        </ul>
      </v-alert>

      <!-- 代码示例 -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-2">mdi-code-tags</v-icon>
            查看代码示例
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <pre class="bg-grey-lighten-4 pa-4 rounded"><code>// 主页面使用
          &lt;AppHeader :use-custom-content="true"&gt;
          &lt;template #custom-content&gt;
          &lt;SlotTemplate /&gt;
          &lt;/template&gt;
          &lt;/AppHeader&gt;

          // SlotTemplate 组件
          &lt;script setup lang="ts"&gt;
          import { ref } from 'vue'

          const userDrawer = ref(false)
          const userInfo = ref({
          name: '张三',
          email: 'zhangsan@example.com',
          avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
          })

          const toggleUserDrawer = () => {
          userDrawer.value = !userDrawer.value
          }
          &lt;/script&gt;</code></pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// 插槽演示说明组件
</script>
