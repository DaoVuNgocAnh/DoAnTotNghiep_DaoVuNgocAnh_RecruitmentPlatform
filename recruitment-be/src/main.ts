import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SystemLogService } from './modules/system-log/system-log.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CacheClearInterceptor } from './common/interceptors/cache-clear.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Redis Adapter cho Socket.io
  const configService = app.get(ConfigService);
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Kích hoạt Validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không định nghĩa trong DTO
      forbidNonWhitelisted: true,
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // Đăng ký Interceptor toàn cục
  const systemLogService = app.get(SystemLogService);
  const reflector = app.get(Reflector);
  const cacheManager = app.get(CACHE_MANAGER);

  app.useGlobalInterceptors(
    new LoggingInterceptor(systemLogService, reflector),
    new CacheClearInterceptor(reflector, cacheManager),
  );

  app.enableCors();

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Recruitment Platform API')
    .setDescription(
      'The comprehensive API documentation for the Recruitment Platform',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  console.error(err);
});
