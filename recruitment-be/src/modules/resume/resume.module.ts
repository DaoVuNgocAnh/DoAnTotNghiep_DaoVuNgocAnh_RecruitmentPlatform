import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
// Import 2 module chứa các Service mà ResumeService đang cần
import { PrismaModule } from 'src/core/database/prisma.module';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,     // Để cung cấp PrismaService cho ResumeService
    CloudinaryModule  // Để cung cấp CloudinaryService cho ResumeService
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}