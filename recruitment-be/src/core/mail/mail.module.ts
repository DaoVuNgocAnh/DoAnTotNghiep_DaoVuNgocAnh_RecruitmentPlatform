import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: Number(config.get('MAIL_PORT')),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: config.get('MAIL_FROM', '"SmartCV" <no-reply@smartcv.com>'),
        },
      }),
      inject: [ConfigService],
    }),
    // Đăng ký queue cho email với cấu hình kết nối tường minh
    BullModule.registerQueueAsync({
      name: 'email_queue',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get('REDIS_PORT', '6380')),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [MailService, EmailProcessor],
  exports: [MailService],
})
export class MailModule {}