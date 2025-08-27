# Home 页面架构说明

## 📁 目录结构

```
pages/Home/
├── index.vue          # Socket.IO 测试客户端主页面
├── types.ts          # 📋 Socket.IO 相关类型定义
├── stores/
│   └── index.ts      # 📦 Socket.IO 状态管理
└── components/       # 🧩 页面专用组件（暂未使用）
```

## 🎯 各文件职责分工

### 📋 types.ts - 类型定义

- **作用**: 定义 Socket.IO 相关的数据结构和接口
- **时机**: 编译时静态检查
- **内容**:
  ```typescript
  interface Message {
    id: string
    timestamp: Date
    content: string
    type: 'sent' | 'received' | 'system'
    sender?: string
    room?: string
  }
  ```

### 📦 stores/index.ts - 状态管理

- **作用**: 管理 Socket.IO 连接状态、消息和房间功能
- **时机**: 运行时动态管理
- **内容**:
  ```typescript
  export const useHomeStore = defineStore('home', () => {
    const socketState = ref<SocketState>({ connected: false, clientId: null, currentRoom: null })
    const messages = ref<Message[]>([])
    const connect = () => { ... }
    const sendMessage = () => { ... }
    return { socketState, messages, connect, sendMessage }
  })
  ```

## 🚀 Socket.IO 功能特性

### ✅ 连接管理
- 连接/断开 Socket.IO 服务器
- 实时连接状态显示
- 连接错误处理

### ✅ 消息功能
- 发送和接收消息
- 自定义发送者名称
- 消息类型分类（发送/接收/系统）

### ✅ 房间功能
- 加入/离开房间
- 发送房间消息
- 房间状态管理

### ✅ 消息日志
- 实时消息显示
- 消息时间戳
- 清空日志功能

## 💡 使用方式

### 1. 连接服务器
点击"连接"按钮建立与 Socket.IO 服务器的连接

### 2. 发送消息
- 设置发送者名称
- 输入消息内容
- 点击"发送消息"或按回车键

### 3. 房间操作
- 输入房间名称
- 点击"加入房间"或"离开房间"
- 发送房间消息

### 4. 查看日志
实时查看所有消息记录，包括连接状态、用户操作和消息内容

## 🏗️ 技术实现

- **Vue 3 Composition API**: 响应式状态管理
- **Pinia Store**: 集中状态管理
- **Socket.IO Client**: 实时通信
- **Vuetify 3**: 现代化 UI 组件
- **TypeScript**: 类型安全

## 🔧 配置说明

- 服务器地址: `http://localhost:3000`
- 支持的消息事件: `message`, `room-message`
- 支持的房间事件: `join-room`, `leave-room`
- 数据持久化: 本地存储发送者名称和房间名称
