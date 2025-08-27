<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useHomeStore } from './stores/index'

const homeStore = useHomeStore()

// 页面生命周期
onMounted(() => {
  homeStore.initialize()
})

onUnmounted(() => {
  homeStore.saveToLocalStorage()
})
</script>

<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="mx-auto">
            <v-card-title class="text-h4 text-center pa-6">
              <v-icon size="large" color="primary" class="mr-3">mdi-socket</v-icon>
              Socket.IO 测试客户端
            </v-card-title>

            <!-- 连接状态 -->
            <v-card-text>
              <v-alert
                :type="homeStore.isConnected ? 'success' : 'error'"
                variant="tonal"
                class="mb-4"
              >
                <template v-slot:prepend>
                  <v-icon>{{
                    homeStore.isConnected ? 'mdi-check-circle' : 'mdi-close-circle'
                  }}</v-icon>
                </template>
                <strong>状态: {{ homeStore.connectionStatus }}</strong>
              </v-alert>

              <!-- 连接控制 -->
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-h6">
                  <v-icon color="primary" class="mr-2">mdi-connection</v-icon>
                  连接控制
                </v-card-title>
                <v-card-text>
                  <v-btn
                    color="success"
                    @click="homeStore.connect()"
                    :disabled="homeStore.isConnected"
                    class="mr-2"
                  >
                    <v-icon start>mdi-connection</v-icon>
                    连接
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="homeStore.disconnect()"
                    :disabled="!homeStore.isConnected"
                  >
                    <v-icon start>mdi-connection-off</v-icon>
                    断开连接
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- 发送消息 -->
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-h6">
                  <v-icon color="info" class="mr-2">mdi-message</v-icon>
                  发送消息
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="homeStore.senderName"
                        label="发送者名称"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="homeStore.messageInput"
                        label="输入消息"
                        variant="outlined"
                        density="compact"
                        @keyup.enter="homeStore.sendMessage()"
                      />
                    </v-col>
                  </v-row>
                  <v-btn
                    color="primary"
                    @click="homeStore.sendMessage()"
                    :disabled="!homeStore.isConnected"
                    block
                  >
                    <v-icon start>mdi-send</v-icon>
                    发送消息
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- 房间功能 -->
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-h6">
                  <v-icon color="warning" class="mr-2">mdi-home-group</v-icon>
                  房间功能
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="homeStore.roomName"
                        label="房间名称"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="homeStore.roomMessageInput"
                        label="房间消息"
                        variant="outlined"
                        density="compact"
                        @keyup.enter="homeStore.sendRoomMessage()"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-btn
                        color="success"
                        @click="homeStore.joinRoom()"
                        :disabled="!homeStore.isConnected"
                        block
                      >
                        <v-icon start>mdi-login</v-icon>
                        加入房间
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="warning"
                        @click="homeStore.leaveRoom()"
                        :disabled="!homeStore.isConnected"
                        block
                      >
                        <v-icon start>mdi-logout</v-icon>
                        离开房间
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-btn
                    color="info"
                    @click="homeStore.sendRoomMessage()"
                    :disabled="!homeStore.isConnected"
                    block
                    class="mt-2"
                  >
                    <v-icon start>mdi-message-text</v-icon>
                    发送房间消息
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- 消息日志 -->
              <v-card variant="outlined">
                <v-card-title class="text-h6 d-flex align-center justify-space-between">
                  <div>
                    <v-icon color="secondary" class="mr-2">mdi-format-list-bulleted</v-icon>
                    消息日志
                  </div>
                  <v-btn
                    color="secondary"
                    variant="text"
                    @click="homeStore.clearMessages()"
                    size="small"
                  >
                    <v-icon start>mdi-delete-sweep</v-icon>
                    清空日志
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div
                    class="message-log"
                    style="
                      height: 300px;
                      overflow-y: auto;
                      border: 1px solid #ddd;
                      padding: 10px;
                      background-color: #f8f9fa;
                    "
                  >
                    <div
                      v-for="message in homeStore.messages"
                      :key="message.id"
                      class="message mb-2 pa-2"
                      :style="{
                        borderLeft: '3px solid',
                        borderLeftColor:
                          message.type === 'sent'
                            ? '#4caf50'
                            : message.type === 'received'
                              ? '#2196f3'
                              : '#ff9800',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      }"
                    >
                      <div class="d-flex align-center">
                        <v-icon
                          size="small"
                          :color="
                            message.type === 'sent'
                              ? 'success'
                              : message.type === 'received'
                                ? 'primary'
                                : 'warning'
                          "
                          class="mr-2"
                        >
                          {{
                            message.type === 'sent'
                              ? 'mdi-arrow-up'
                              : message.type === 'received'
                                ? 'mdi-arrow-down'
                                : 'mdi-information'
                          }}
                        </v-icon>
                        <span class="text-caption text-medium-emphasis">
                          {{ message.timestamp.toLocaleTimeString('zh-CN') }}
                        </span>
                        <v-spacer />
                        <span v-if="message.sender" class="text-caption font-weight-medium">
                          {{ message.sender }}
                        </span>
                      </div>
                      <div class="mt-1">{{ message.content }}</div>
                    </div>
                    <div
                      v-if="homeStore.messages.length === 0"
                      class="text-center text-medium-emphasis pa-4"
                    >
                      暂无消息
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.message-log {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f8f9fa;
}

.message-log::-webkit-scrollbar {
  width: 6px;
}

.message-log::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.message-log::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.message-log::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
