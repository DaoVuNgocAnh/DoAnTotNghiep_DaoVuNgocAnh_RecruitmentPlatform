import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

// Core & Infrastructure Modules
import { PrismaModule } from './core/database/prisma.module';
import { CloudinaryModule } from './core/cloudinary/cloudinary.module';
import { MailModule } from './core/mail/mail.module';

// Business Logic Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module'; 
import { CompanyModule } from './modules/company/company.module';
import { JobModule } from './modules/job/job.module';
import { JobCategoryModule } from './modules/job-category/job-category.module';

@Module({
  imports: [
    // Cấu hình hệ thống 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Đảm bảo nhận file .env ở root be
    }),

    // Tích hợp Redis Caching
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: parseInt(configService.get('REDIS_PORT', '6380')),
          },
          password: configService.get('REDIS_PASSWORD'),
          ttl: 600, // 10 minutes default
        }),
      }),
    }),

    // Tích hợp Rate Limiting (Mặc định dùng Memory, có thể mở rộng Redis sau)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Tích hợp BullMQ cho Queues (Email, v.v.)
    BullModule.forRootAsync({
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

    // Hạ tầng & Database (Shared Core)
    PrismaModule,
    CloudinaryModule,
    MailModule,

    // Nghiệp vụ (Features)
    AuthModule,
    UserModule,
    CompanyModule,
    JobCategoryModule,
    JobModule,
  ],
  controllers: [], 
  providers: [],   
})
export class AppModule {}