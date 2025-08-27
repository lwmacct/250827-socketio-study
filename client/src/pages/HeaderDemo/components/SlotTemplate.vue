<script setup lang="ts">
import { ref } from 'vue'

// 响应式数据
const notificationCount = ref(3)
const userStatus = ref('在线')
const isSettingsOpen = ref(false)
const userDrawer = ref(false)

// 用户信息
const userInfo = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
  role: '管理员',
})

// 事件处理函数
const handleNotification = () => {
  console.log('点击了通知按钮')
  notificationCount.value = Math.max(0, notificationCount.value - 1)
  // 模拟通知处理
  if (notificationCount.value === 0) {
    setTimeout(() => {
      notificationCount.value = Math.floor(Math.random() * 5) + 1
    }, 1000)
  }
}

const handleUser = () => {
  console.log('点击了用户按钮')
  // 模拟用户管理操作
  userStatus.value = userStatus.value === '在线' ? '忙碌' : '在线'
}

const handleUserStatus = () => {
  console.log('切换用户状态')
  const statuses = ['在线', '忙碌', '离开', '勿扰']
  const currentIndex = statuses.indexOf(userStatus.value)
  const nextIndex = (currentIndex + 1) % statuses.length
  const newStatus = statuses[nextIndex]
  if (newStatus) {
    userStatus.value = newStatus
  }
}

const handleSettings = () => {
  console.log('点击了设置按钮')
  isSettingsOpen.value = !isSettingsOpen.value
  // 模拟设置面板切换
  setTimeout(() => {
    isSettingsOpen.value = false
  }, 2000)
}

const toggleUserDrawer = () => {
  userDrawer.value = !userDrawer.value
}

const handleLogout = () => {
  console.log('用户登出')
  userDrawer.value = false
}

const handleProfile = () => {
  console.log('查看个人资料')
  userDrawer.value = false
}
</script>

<template>
  <div class="header-layout">
    <!-- 左侧区域：通知和用户按钮 -->
    <div class="left-section">
      <!-- 通知按钮 -->
      <v-btn
        icon="mdi-bell"
        variant="text"
        color="warning"
        class="mr-2"
        @click="handleNotification"
      >
        <v-badge :content="notificationCount" color="error" offset-x="8" offset-y="-8">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-tooltip activator="parent" location="bottom"> 通知 ({{ notificationCount }}) </v-tooltip>
      </v-btn>

      <!-- 用户按钮 -->
      <v-btn icon="mdi-account" variant="text" color="info" class="mr-2" @click="handleUser">
        <v-icon>mdi-account</v-icon>
        <v-tooltip activator="parent" location="bottom"> 用户管理 </v-tooltip>
      </v-btn>
    </div>

    <!-- 中间区域：用户状态芯片 -->
    <div class="center-section">
      <v-chip color="success" variant="outlined" size="small" @click="handleUserStatus">
        <v-icon start>mdi-account-circle</v-icon>
        {{ userStatus }}
        <v-tooltip activator="parent" location="bottom"> 点击切换状态 </v-tooltip>
      </v-chip>
    </div>

    <!-- 右侧区域：设置按钮和用户头像 -->
    <div class="right-section">
      <!-- 设置按钮 -->
      <v-btn icon="mdi-cog" variant="text" color="white" class="mr-2" @click="handleSettings">
        <v-icon>mdi-cog</v-icon>
        <v-tooltip activator="parent" location="bottom"> 系统设置 </v-tooltip>
      </v-btn>

      <!-- 用户头像 -->
      <v-btn icon variant="text" color="white" @click="toggleUserDrawer" class="user-avatar-btn">
        <v-avatar size="32" class="user-avatar">
          <v-img :src="userInfo.avatar" alt="用户头像"></v-img>
        </v-avatar>
        <v-tooltip activator="parent" location="bottom"> 点击查看用户菜单 </v-tooltip>
      </v-btn>
    </div>

    <!-- 用户抽屉 -->
    <v-navigation-drawer
      v-model="userDrawer"
      location="right"
      temporary
      width="300"
      class="user-drawer"
    >
      <v-list>
        <!-- 用户信息头部 -->
        <v-list-item class="user-info-header">
          <template v-slot:prepend>
            <v-avatar size="48">
              <v-img :src="userInfo.avatar" alt="用户头像"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title class="text-h6">{{ userInfo.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
          <v-list-item-subtitle class="text-caption">
            <v-chip size="small" color="primary" variant="outlined">
              {{ userInfo.role }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- 用户状态 -->
        <v-list-item @click="handleUserStatus">
          <template v-slot:prepend>
            <v-icon>mdi-account-circle</v-icon>
          </template>
          <v-list-item-title>状态</v-list-item-title>
          <v-list-item-subtitle>{{ userStatus }}</v-list-item-subtitle>
        </v-list-item>

        <!-- 个人资料 -->
        <v-list-item @click="handleProfile">
          <template v-slot:prepend>
            <v-icon>mdi-account-edit</v-icon>
          </template>
          <v-list-item-title>个人资料</v-list-item-title>
        </v-list-item>

        <!-- 设置 -->
        <v-list-item @click="handleSettings">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>设置</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- 登出 -->
        <v-list-item @click="handleLogout" color="error">
          <template v-slot:prepend>
            <v-icon color="error">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-error">登出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.header-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.center-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.user-avatar:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.user-drawer {
  z-index: 1000;
}

.user-info-header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-info-header .v-list-item-title {
  color: white;
  font-weight: 600;
}

.user-info-header .v-list-item-subtitle {
  color: rgba(255, 255, 255, 0.8);
}
</style>
