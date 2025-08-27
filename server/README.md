# Socket.IO 服务器

这是一个基于 NestJS 框架构建的 Socket.IO 实时通信服务器。

## 功能特性

### 🔗 连接管理
- 自动处理客户端连接和断开连接
- 实时连接状态通知
- 客户端 ID 跟踪

### 💬 实时消息
- 全局消息广播
- 支持发送者信息和时间戳
- 消息格式化和日志记录

### 🏠 房间功能
- 动态房间加入和离开
- 房间专用消息通道
- 房间用户状态通知

### 🌐 跨域支持
- 配置完整的 CORS 支持
- 支持所有来源的连接
- 适配器优化配置

## 项目结构

```
src/
├── events/
│   └── events.gateway.ts    # Socket.IO 网关和事件处理
├── app.module.ts           # 应用程序主模块
├── app.controller.ts       # 基础控制器
├── app.service.ts          # 基础服务
└── main.ts                # 应用程序入口点
public/
└── test-client.html        # 测试客户端页面
```

## 安装依赖

```bash
npm install
```

## 运行服务器

### 开发模式
```bash
npm run start:dev
```

### 生产模式
```bash
npm run build
npm run start:prod
```

服务器将在 `http://localhost:3000` 启动。

## 测试客户端

打开 `public/test-client.html` 文件在浏览器中测试 Socket.IO 功能：

1. **连接测试**: 点击"连接"按钮连接到服务器
2. **消息测试**: 发送全局消息
3. **房间测试**: 加入/离开房间，发送房间消息
4. **多客户端测试**: 在多个浏览器标签页中打开测试页面

## Socket.IO 事件列表

### 客户端发送事件
- `message`: 发送全局消息
- `join-room`: 加入房间
- `leave-room`: 离开房间
- `room-message`: 发送房间消息

### 服务器发送事件
- `message`: 全局消息广播
- `userConnected`: 用户连接通知
- `userDisconnected`: 用户断开通知
- `userJoinedRoom`: 用户加入房间通知
- `userLeftRoom`: 用户离开房间通知
- `roomMessage`: 房间消息广播

## 消息格式

### 全局消息
```json
{
  "message": "消息内容",
  "sender": "发送者名称",
  "clientId": "socket客户端ID",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 房间消息
```json
{
  "room": "房间名称",
  "message": "消息内容", 
  "sender": "发送者名称",
  "clientId": "socket客户端ID",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 技术栈

- **NestJS**: Node.js 后端框架
- **Socket.IO**: 实时双向事件通信
- **TypeScript**: 类型安全的 JavaScript 超集
- **@nestjs/websockets**: NestJS WebSocket 支持
- **@nestjs/platform-socket.io**: NestJS Socket.IO 适配器

## 开发说明

### 添加新的 Socket 事件

1. 在 `src/events/events.gateway.ts` 中添加新的事件处理器：

```typescript
@SubscribeMessage('your-event')
handleYourEvent(
  @MessageBody() data: any,
  @ConnectedSocket() client: Socket,
): void {
  // 处理逻辑
}
```

2. 在客户端代码中监听和发送对应事件

### 日志记录

服务器自动记录所有 Socket.IO 事件，包括：
- 连接和断开连接
- 消息发送和接收
- 房间操作
- 错误处理

## 部署

### 使用 PM2 部署
```bash
npm install -g pm2
npm run build
pm2 start dist/main.js --name socket-server
```

### 使用 Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 许可证

UNLICENSED