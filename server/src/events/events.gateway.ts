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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('Socket.IO 服务器初始化完成');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`客户端连接: ${client.id}`);
    this.server.emit('userConnected', {
      clientId: client.id,
      message: '用户已连接',
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`客户端断开连接: ${client.id}`);
    this.server.emit('userDisconnected', {
      clientId: client.id,
      message: '用户已断开连接',
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`收到消息: ${JSON.stringify(data)} 来自 ${client.id}`);

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
    client.join(data.room);
    this.logger.log(`客户端 ${client.id} 加入房间: ${data.room}`);

    client.to(data.room).emit('userJoinedRoom', {
      clientId: client.id,
      room: data.room,
      message: `用户加入了房间 ${data.room}`,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(data.room);
    this.logger.log(`客户端 ${client.id} 离开房间: ${data.room}`);

    client.to(data.room).emit('userLeftRoom', {
      clientId: client.id,
      room: data.room,
      message: `用户离开了房间 ${data.room}`,
    });
  }

  @SubscribeMessage('room-message')
  handleRoomMessage(
    @MessageBody() data: { room: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`房间消息: ${JSON.stringify(data)} 来自 ${client.id}`);

    // 发送消息给特定房间的所有客户端
    this.server.to(data.room).emit('roomMessage', {
      ...data,
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }
}
