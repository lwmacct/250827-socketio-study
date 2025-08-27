import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface ClientInfo {
  id: string;
  connectedAt: Date;
  rooms: Set<string>;
  lastActivity: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');
  private clients: Map<string, ClientInfo> = new Map();
  private roomStats: Map<string, number> = new Map();

  afterInit(server: Server) {
    this.logger.log('🚀 Socket.IO 服务器初始化完成');
    this.logger.log(`📡 监听端口: ${process.env.PORT || 3000}`);
    this.logger.log(
      '🔧 支持的事件: message, join-room, leave-room, room-message',
    );
  }

  handleConnection(client: Socket, ...args: any[]) {
    const clientInfo: ClientInfo = {
      id: client.id,
      connectedAt: new Date(),
      rooms: new Set(),
      lastActivity: new Date(),
    };

    this.clients.set(client.id, clientInfo);

    this.logger.log(`✅ 客户端连接: ${client.id}`);
    this.logger.log(`📊 当前在线用户: ${this.clients.size}`);

    // 发送连接成功消息给客户端
    client.emit('connected', {
      clientId: client.id,
      message: '连接成功',
      timestamp: new Date().toISOString(),
      onlineUsers: this.clients.size,
    });

    // 广播用户连接消息给其他客户端
    client.broadcast.emit('userConnected', {
      clientId: client.id,
      message: '用户已连接',
      timestamp: new Date().toISOString(),
      onlineUsers: this.clients.size,
    });

    // 发送当前房间统计信息
    this.sendRoomStats(client);
  }

  handleDisconnect(client: Socket) {
    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      // 离开所有房间
      clientInfo.rooms.forEach((room) => {
        this.leaveRoom(client, room);
      });

      this.clients.delete(client.id);
    }

    this.logger.log(`❌ 客户端断开连接: ${client.id}`);
    this.logger.log(`📊 当前在线用户: ${this.clients.size}`);

    // 广播用户断开连接消息
    this.server.emit('userDisconnected', {
      clientId: client.id,
      message: '用户已断开连接',
      timestamp: new Date().toISOString(),
      onlineUsers: this.clients.size,
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
    }

    this.logger.log(
      `💬 收到消息: "${data.message}" 来自 ${data.sender} (${client.id})`,
    );

    // 广播消息给所有连接的客户端
    this.server.emit('message', {
      ...data,
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const room = data.room.trim();
    if (!room) {
      client.emit('error', { message: '房间名称不能为空' });
      return;
    }

    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      clientInfo.rooms.add(room);
      clientInfo.lastActivity = new Date();
    }

    client.join(room);

    // 更新房间统计
    const currentCount = this.roomStats.get(room) || 0;
    this.roomStats.set(room, currentCount + 1);

    this.logger.log(`🏠 客户端 ${client.id} 加入房间: ${room}`);
    this.logger.log(`📊 房间 ${room} 当前人数: ${this.roomStats.get(room)}`);

    // 发送加入房间成功消息
    client.emit('roomJoined', {
      room: room,
      message: `成功加入房间 ${room}`,
      timestamp: new Date().toISOString(),
      roomMembers: this.roomStats.get(room),
    });

    // 通知房间内其他用户
    client.to(room).emit('userJoinedRoom', {
      clientId: client.id,
      room: room,
      message: `用户加入了房间 ${room}`,
      timestamp: new Date().toISOString(),
      roomMembers: this.roomStats.get(room),
    });

    // 更新所有客户端的房间统计
    this.broadcastRoomStats();
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const room = data.room.trim();
    if (!room) {
      client.emit('error', { message: '房间名称不能为空' });
      return;
    }

    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      clientInfo.rooms.delete(room);
      clientInfo.lastActivity = new Date();
    }

    client.leave(room);

    // 更新房间统计
    const currentCount = this.roomStats.get(room) || 0;
    if (currentCount > 0) {
      this.roomStats.set(room, currentCount - 1);
    }

    this.logger.log(`🚪 客户端 ${client.id} 离开房间: ${room}`);
    this.logger.log(
      `📊 房间 ${room} 当前人数: ${this.roomStats.get(room) || 0}`,
    );

    // 发送离开房间成功消息
    client.emit('roomLeft', {
      room: room,
      message: `已离开房间 ${room}`,
      timestamp: new Date().toISOString(),
    });

    // 通知房间内其他用户
    client.to(room).emit('userLeftRoom', {
      clientId: client.id,
      room: room,
      message: `用户离开了房间 ${room}`,
      timestamp: new Date().toISOString(),
      roomMembers: this.roomStats.get(room) || 0,
    });

    // 更新所有客户端的房间统计
    this.broadcastRoomStats();
  }

  @SubscribeMessage('room-message')
  handleRoomMessage(
    @MessageBody() data: { room: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const room = data.room.trim();
    if (!room) {
      client.emit('error', { message: '房间名称不能为空' });
      return;
    }

    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
    }

    this.logger.log(
      `🏠💬 房间消息 [${room}]: "${data.message}" 来自 ${data.sender} (${client.id})`,
    );

    // 发送消息给特定房间的所有客户端
    this.server.to(room).emit('roomMessage', {
      ...data,
      clientId: client.id,
      timestamp: new Date().toISOString(),
      room: room,
    });
  }

  @SubscribeMessage('get-stats')
  handleGetStats(@ConnectedSocket() client: Socket): void {
    const stats = {
      onlineUsers: this.clients.size,
      rooms: Object.fromEntries(this.roomStats),
      clientInfo: this.clients.get(client.id),
      timestamp: new Date().toISOString(),
    };

    client.emit('stats', stats);
  }

  private sendRoomStats(client: Socket): void {
    const stats = {
      onlineUsers: this.clients.size,
      rooms: Object.fromEntries(this.roomStats),
      timestamp: new Date().toISOString(),
    };

    client.emit('roomStats', stats);
  }

  private broadcastRoomStats(): void {
    const stats = {
      onlineUsers: this.clients.size,
      rooms: Object.fromEntries(this.roomStats),
      timestamp: new Date().toISOString(),
    };

    this.server.emit('roomStats', stats);
  }

  private leaveRoom(client: Socket, room: string): void {
    client.leave(room);

    const currentCount = this.roomStats.get(room) || 0;
    if (currentCount > 0) {
      this.roomStats.set(room, currentCount - 1);
    }
  }
}
