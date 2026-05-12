import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SystemLogService } from './modules/system-log/system-log.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Recruitment Platform API')
    .setDescription('The comprehensive API documentation for the Recruitment Platform')
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
