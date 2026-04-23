import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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