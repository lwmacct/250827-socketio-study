/**
 * Home 页面相关的类型定义
 * Socket.IO 功能相关类型
 */

/**
 * 消息类型
 */
export interface Message {
  id: string
  timestamp: Date
  content: string
  type: 'sent' | 'received' | 'system'
  sender?: string
  room?: string
}

/**
 * Socket 连接状态
 */
export interface SocketState {
  connected: boolean
  clientId: string | null
  currentRoom: string | null
}

/**
 * 消息数据接口
 */
export interface MessageData {
  message: string
  sender: string
}

/**
 * 房间消息数据接口
 */
export interface RoomMessageData {
  room: string
  message: string
  sender: string
}

/**
 * 房间操作数据接口
 */
export interface RoomData {
  room: string
}
