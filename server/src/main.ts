import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态文件服务 - 指向客户端构建后的文件
  app.useStaticAssets(join(__dirname, '..', '..', 'client', 'dist'));

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
      transform: true, // 自动转换类型
    }),
  );

  // 启用 CORS 支持
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // 使用 Socket.IO 适配器
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Socket.IO 服务器运行在 http://localhost:${port}`);
  console.log(`📱 Vue 客户端页面: http://localhost:${port}/index.html`);
  console.log(`🔧 开发模式: 使用 'npm run start:dev' 启动热更新`);
  console.log(`✅ 分层架构重构完成: 网关 + 服务层 + DTO + 接口`);
}
bootstrap();
