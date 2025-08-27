/**
 * Socket 服务层
 * 负责 Socket.IO 的业务逻辑处理
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  ClientInfo,
  RoomStats,
  MessageData,
  RoomData,
  RoomMessageData,
  ConnectionResponse,
  RoomJoinResponse,
  RoomLeaveResponse,
  UserActionData,
  StatsResponse,
} from '../../common/interfaces/socket.interface';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private readonly clients = new Map<string, ClientInfo>();
  private readonly roomStats = new Map<string, number>();

  /**
   * 获取当前房间统计信息
   */
  getRoomStats(): RoomStats {
    return {
      onlineUsers: this.clients.size,
      rooms: Object.fromEntries(this.roomStats),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 获取客户端信息
   */
  getClientInfo(clientId: string): ClientInfo | undefined {
    return this.clients.get(clientId);
  }

  /**
   * 获取客户端统计信息
   */
  getStats(clientId: string): StatsResponse {
    return {
      onlineUsers: this.clients.size,
      rooms: Object.fromEntries(this.roomStats),
      clientInfo: this.clients.get(clientId),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 处理客户端连接
   */
  handleConnection(clientId: string): ConnectionResponse {
    const clientInfo: ClientInfo = {
      id: clientId,
      connectedAt: new Date(),
      rooms: new Set(),
      lastActivity: new Date(),
    };

    this.clients.set(clientId, clientInfo);

    this.logger.log(`✅ 客户端连接: ${clientId}`);
    this.logger.log(`📊 当前在线用户: ${this.clients.size}`);

    return {
      clientId: clientId,
      message: '连接成功',
      timestamp: new Date().toISOString(),
      onlineUsers: this.clients.size,
    };
  }

  /**
   * 处理客户端断开连接
   */
  handleDisconnection(clientId: string): UserActionData {
    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      // 离开所有房间
      clientInfo.rooms.forEach((room) => {
        this.leaveRoom(clientId, room);
      });

      this.clients.delete(clientId);
    }

    this.logger.log(`❌ 客户端断开连接: ${clientId}`);
    this.logger.log(`📊 当前在线用户: ${this.clients.size}`);

    return {
      clientId: clientId,
      message: '用户已断开连接',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 处理消息
   */
  handleMessage(clientId: string, data: MessageData): void {
    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
    }

    this.logger.log(
      `💬 收到消息: "${data.message}" 来自 ${data.sender} (${clientId})`,
    );
  }

  /**
   * 处理加入房间
   */
  handleJoinRoom(clientId: string, room: string): RoomJoinResponse | null {
    const trimmedRoom = room.trim();
    if (!trimmedRoom) {
      return null;
    }

    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      // 检查客户端是否已经在房间中
      if (clientInfo.rooms.has(trimmedRoom)) {
        return null;
      }

      clientInfo.rooms.add(trimmedRoom);
      clientInfo.lastActivity = new Date();
    }

    // 更新房间统计
    const currentCount = this.roomStats.get(trimmedRoom) || 0;
    this.roomStats.set(trimmedRoom, currentCount + 1);

    this.logger.log(`🏠 客户端 ${clientId} 加入房间: ${trimmedRoom}`);
    this.logger.log(
      `📊 房间 ${trimmedRoom} 当前人数: ${this.roomStats.get(trimmedRoom)}`,
    );

    return {
      room: trimmedRoom,
      message: `成功加入房间 ${trimmedRoom}`,
      timestamp: new Date().toISOString(),
      roomMembers: this.roomStats.get(trimmedRoom) || 0,
    };
  }

  /**
   * 处理离开房间
   */
  handleLeaveRoom(clientId: string, room: string): RoomLeaveResponse | null {
    const trimmedRoom = room.trim();
    if (!trimmedRoom) {
      return null;
    }

    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      clientInfo.rooms.delete(trimmedRoom);
      clientInfo.lastActivity = new Date();
    }

    // 更新房间统计
    const currentCount = this.roomStats.get(trimmedRoom) || 0;
    if (currentCount > 0) {
      this.roomStats.set(trimmedRoom, currentCount - 1);
    }

    this.logger.log(`🚪 客户端 ${clientId} 离开房间: ${trimmedRoom}`);
    this.logger.log(
      `📊 房间 ${trimmedRoom} 当前人数: ${this.roomStats.get(trimmedRoom) || 0}`,
    );

    return {
      room: trimmedRoom,
      message: `已离开房间 ${trimmedRoom}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 处理房间消息
   */
  handleRoomMessage(clientId: string, data: RoomMessageData): void {
    const room = data.room.trim();
    if (!room) {
      return;
    }

    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
    }

    this.logger.log(
      `🏠💬 房间消息 [${room}]: "${data.message}" 来自 ${data.sender} (${clientId})`,
    );
  }

  /**
   * 获取房间成员数量
   */
  getRoomMemberCount(room: string): number {
    return this.roomStats.get(room) || 0;
  }

  /**
   * 检查客户端是否在房间中
   */
  isClientInRoom(clientId: string, room: string): boolean {
    const clientInfo = this.clients.get(clientId);
    return clientInfo ? clientInfo.rooms.has(room) : false;
  }

  /**
   * 内部方法：离开房间
   */
  private leaveRoom(clientId: string, room: string): void {
    const currentCount = this.roomStats.get(room) || 0;
    if (currentCount > 0) {
      this.roomStats.set(room, currentCount - 1);
    }
  }
}
