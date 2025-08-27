/**
 * Home 页面专用状态管理
 * 集成 Socket.IO 功能的状态管理
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'

interface HomeStats {
  visitCount: number
  lastVisitTime: Date | null
}

interface Message {
  id: string
  timestamp: Date
  content: string
  type: 'sent' | 'received' | 'system'
  sender?: string
  room?: string
}

interface SocketState {
  connected: boolean
  clientId: string | null
  currentRoom: string | null
}

/**
 * Home 页面 Store
 * 管理首页的访问统计和 Socket.IO 连接状态
 */
export const useHomeStore = defineStore('home', () => {
  // === 状态 ===
  const stats = ref<HomeStats>({
    visitCount: 0,
    lastVisitTime: null,
  })

  const showStatistics = ref(true)
  const currentSessionStart = ref<Date>(new Date())

  // Socket.IO 相关状态
  const socket = ref<Socket | null>(null)
  const socketState = ref<SocketState>({
    connected: false,
    clientId: null,
    currentRoom: null,
  })

  // 消息相关状态
  const messages = ref<Message[]>([])
  const senderName = ref('测试用户')
  const messageInput = ref('')
  const roomName = ref('room1')
  const roomMessageInput = ref('')

  // === 计算属性 ===
  const formattedLastVisit = computed(() => {
    if (!stats.value.lastVisitTime) return '首次访问'
    return stats.value.lastVisitTime.toLocaleString('zh-CN')
  })

  const sessionDuration = computed(() => {
    const now = new Date()
    const duration = Math.floor((now.getTime() - currentSessionStart.value.getTime()) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}分${seconds}秒`
  })

  const connectionStatus = computed(() => {
    if (socketState.value.connected) {
      return `已连接 (ID: ${socketState.value.clientId})`
    }
    return '未连接'
  })

  const isConnected = computed(() => socketState.value.connected)

  // === Socket.IO 方法 ===
  const connect = () => {
    if (socket.value) {
      socket.value.disconnect()
    }

    socket.value = io('http://localhost:3000')

    socket.value.on('connect', () => {
      socketState.value.connected = true
      socketState.value.clientId = socket.value?.id || null
      addMessage('✅ 连接成功，客户端ID: ' + socket.value?.id, 'system')
    })

    socket.value.on('disconnect', (reason: string) => {
      socketState.value.connected = false
      socketState.value.clientId = null
      socketState.value.currentRoom = null
      addMessage('❌ 连接断开: ' + reason, 'system')
    })

    socket.value.on('message', (data: any) => {
      addMessage(`💬 收到消息: ${JSON.stringify(data)}`, 'received', data.sender)
    })

    socket.value.on('userConnected', (data: any) => {
      addMessage(`👋 用户连接: ${JSON.stringify(data)}`, 'system')
    })

    socket.value.on('userDisconnected', (data: any) => {
      addMessage(`👋 用户断开: ${JSON.stringify(data)}`, 'system')
    })

    socket.value.on('userJoinedRoom', (data: any) => {
      addMessage(`🏠 用户加入房间: ${JSON.stringify(data)}`, 'system')
    })

    socket.value.on('userLeftRoom', (data: any) => {
      addMessage(`🏠 用户离开房间: ${JSON.stringify(data)}`, 'system')
    })

    socket.value.on('roomMessage', (data: any) => {
      addMessage(`🏠💬 房间消息: ${JSON.stringify(data)}`, 'received', data.sender)
    })

    socket.value.on('connect_error', (error: any) => {
      socketState.value.connected = false
      addMessage(`❌ 连接错误: ${error.message}`, 'system')
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const sendMessage = () => {
    if (!socket.value || !socket.value.connected) {
      addMessage('请先连接到服务器！', 'system')
      return
    }

    if (!messageInput.value.trim()) {
      addMessage('请输入消息！', 'system')
      return
    }

    const messageData = {
      message: messageInput.value,
      sender: senderName.value,
    }

    socket.value.emit('message', messageData)
    addMessage(`📤 发送消息: ${messageInput.value}`, 'sent', senderName.value)
    messageInput.value = ''
  }

  const joinRoom = () => {
    if (!socket.value || !socket.value.connected) {
      addMessage('请先连接到服务器！', 'system')
      return
    }

    if (!roomName.value.trim()) {
      addMessage('请输入房间名称！', 'system')
      return
    }

    socket.value.emit('join-room', { room: roomName.value })
    socketState.value.currentRoom = roomName.value
    addMessage(`🏠 尝试加入房间: ${roomName.value}`, 'system')
  }

  const leaveRoom = () => {
    if (!socket.value || !socket.value.connected) {
      addMessage('请先连接到服务器！', 'system')
      return
    }

    if (!roomName.value.trim()) {
      addMessage('请输入房间名称！', 'system')
      return
    }

    socket.value.emit('leave-room', { room: roomName.value })
    if (socketState.value.currentRoom === roomName.value) {
      socketState.value.currentRoom = null
    }
    addMessage(`🏠 尝试离开房间: ${roomName.value}`, 'system')
  }

  const sendRoomMessage = () => {
    if (!socket.value || !socket.value.connected) {
      addMessage('请先连接到服务器！', 'system')
      return
    }

    if (!roomName.value.trim() || !roomMessageInput.value.trim()) {
      addMessage('请输入房间名称和消息！', 'system')
      return
    }

    const roomMessageData = {
      room: roomName.value,
      message: roomMessageInput.value,
      sender: senderName.value,
    }

    socket.value.emit('room-message', roomMessageData)
    addMessage(
      `🏠📤 发送房间消息到 ${roomName.value}: ${roomMessageInput.value}`,
      'sent',
      senderName.value,
    )
    roomMessageInput.value = ''
  }

  const addMessage = (content: string, type: Message['type'] = 'system', sender?: string) => {
    const message: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content,
      type,
      sender,
    }
    messages.value.push(message)
  }

  const clearMessages = () => {
    messages.value = []
  }

  // === 原有方法 ===
  const recordVisit = () => {
    stats.value.visitCount++
    stats.value.lastVisitTime = new Date()
    currentSessionStart.value = new Date()
    console.log(`首页访问次数: ${stats.value.visitCount}`)
  }

  const toggleStatistics = () => {
    showStatistics.value = !showStatistics.value
  }

  // === 数据持久化 ===
  const saveToLocalStorage = () => {
    const data = {
      stats: stats.value,
      showStatistics: showStatistics.value,
      senderName: senderName.value,
      roomName: roomName.value,
    }
    localStorage.setItem('home-store-data', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('home-store-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.stats) {
          Object.assign(stats.value, data.stats)
          if (data.stats.lastVisitTime) {
            stats.value.lastVisitTime = new Date(data.stats.lastVisitTime)
          }
        }
        if (data.showStatistics !== undefined) {
          showStatistics.value = data.showStatistics
        }
        if (data.senderName) {
          senderName.value = data.senderName
        }
        if (data.roomName) {
          roomName.value = data.roomName
        }
      } catch (error) {
        console.error('加载 Home Store 数据失败:', error)
      }
    }
  }

  // === 初始化 ===
  const initialize = () => {
    loadFromLocalStorage()
    recordVisit()
  }

  return {
    // 状态
    stats: computed(() => stats.value),
    showStatistics: computed(() => showStatistics.value),
    socketState: computed(() => socketState.value),
    messages: computed(() => messages.value),
    senderName,
    messageInput,
    roomName,
    roomMessageInput,

    // 计算属性
    formattedLastVisit,
    sessionDuration,
    connectionStatus,
    isConnected,

    // Socket.IO 方法
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendRoomMessage,
    addMessage,
    clearMessages,

    // 原有方法
    recordVisit,
    toggleStatistics,
    saveToLocalStorage,
    loadFromLocalStorage,
    initialize,
  }
})
