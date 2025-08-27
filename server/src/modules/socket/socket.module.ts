/**
 * Socket 模块
 * 配置 Socket.IO 相关的依赖注入
 */

import { Module } from '@nestjs/common';
import { EventsGateway } from '../../events/events.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [EventsGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
