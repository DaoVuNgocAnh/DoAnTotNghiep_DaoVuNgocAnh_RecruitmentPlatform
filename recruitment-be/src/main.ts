import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SystemLogService } from './modules/system-log/system-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.useGlobalInterceptors(new LoggingInterceptor(systemLogService));

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
