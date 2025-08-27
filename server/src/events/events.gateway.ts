/**
 * Socket.IO 网关
 * 负责事件路由和 Socket.IO 操作，业务逻辑委托给服务层
 */

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
import { SocketService } from '../modules/socket/socket.service';
import {
  MessageDto,
  RoomDto,
  RoomMessageDto,
} from '../modules/socket/dto/message.dto';
import {
  UserActionData,
  RoomJoinResponse,
  RoomLeaveResponse,
  RoomStats,
} from '../common/interfaces/socket.interface';

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

  private readonly logger: Logger = new Logger(EventsGateway.name);

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.logger.log('🚀 Socket.IO 服务器初始化完成');
    this.logger.log(`📡 监听端口: ${process.env.PORT || 3000}`);
    this.logger.log(
      '🔧 支持的事件: message, join-room, leave-room, room-message',
    );
  }

  handleConnection(client: Socket, ...args: any[]) {
    // 使用服务层处理连接逻辑
    const connectionResponse = this.socketService.handleConnection(client.id);

    // 发送连接成功消息给客户端
    client.emit('connected', connectionResponse);

    // 广播用户连接消息给其他客户端
    client.broadcast.emit('userConnected', {
      clientId: client.id,
      message: '用户已连接',
      timestamp: new Date().toISOString(),
      onlineUsers: connectionResponse.onlineUsers,
    });

    // 发送当前房间统计信息
    this.sendRoomStats(client);
  }

  handleDisconnect(client: Socket) {
    // 使用服务层处理断开连接逻辑
    const disconnectResponse = this.socketService.handleDisconnection(
      client.id,
    );

    // 广播用户断开连接消息
    this.server.emit('userDisconnected', disconnectResponse);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // 使用服务层处理消息逻辑
    this.socketService.handleMessage(client.id, data);

    // 广播消息给所有连接的客户端
    this.server.emit('message', {
      ...data,
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // 使用服务层处理加入房间逻辑
    const joinResponse = this.socketService.handleJoinRoom(
      client.id,
      data.room,
    );

    if (!joinResponse) {
      // 如果已经在房间中或房间名称为空
      client.emit('error', { message: '您已经在房间中了或房间名称无效' });
      return;
    }

    // 执行 Socket.IO 房间操作
    client.join(data.room);

    // 发送加入房间成功消息
    client.emit('roomJoined', joinResponse);

    // 通知房间内其他用户
    client.to(data.room).emit('userJoinedRoom', {
      clientId: client.id,
      room: data.room,
      message: `用户加入了房间 ${data.room}`,
      timestamp: new Date().toISOString(),
      roomMembers: joinResponse.roomMembers,
    });

    // 更新所有客户端的房间统计
    this.broadcastRoomStats();
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // 使用服务层处理离开房间逻辑
    const leaveResponse = this.socketService.handleLeaveRoom(
      client.id,
      data.room,
    );

    if (!leaveResponse) {
      // 如果房间名称为空
      client.emit('error', { message: '房间名称无效' });
      return;
    }

    // 执行 Socket.IO 房间操作
    client.leave(data.room);

    // 发送离开房间成功消息
    client.emit('roomLeft', leaveResponse);

    // 通知房间内其他用户
    client.to(data.room).emit('userLeftRoom', {
      clientId: client.id,
      room: data.room,
      message: `用户离开了房间 ${data.room}`,
      timestamp: new Date().toISOString(),
      roomMembers: this.socketService.getRoomMemberCount(data.room),
    });

    // 更新所有客户端的房间统计
    this.broadcastRoomStats();
  }

  @SubscribeMessage('room-message')
  handleRoomMessage(
    @MessageBody() data: RoomMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // 使用服务层处理房间消息逻辑
    this.socketService.handleRoomMessage(client.id, data);

    // 发送消息给特定房间的所有客户端
    this.server.to(data.room).emit('roomMessage', {
      ...data,
      clientId: client.id,
      timestamp: new Date().toISOString(),
      room: data.room,
    });
  }

  @SubscribeMessage('get-stats')
  handleGetStats(@ConnectedSocket() client: Socket): void {
    // 使用服务层获取统计信息
    const stats = this.socketService.getStats(client.id);
    client.emit('stats', stats);
  }

  /**
   * 发送房间统计信息给指定客户端
   */
  private sendRoomStats(client: Socket): void {
    const stats = this.socketService.getRoomStats();
    client.emit('roomStats', stats);
  }

  /**
   * 广播房间统计信息给所有客户端
   */
  private broadcastRoomStats(): void {
    const stats = this.socketService.getRoomStats();
    this.server.emit('roomStats', stats);
  }
}
