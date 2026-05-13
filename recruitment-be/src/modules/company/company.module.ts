import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { NotificationModule } from '../notification/notification.module';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';

@Module({
  imports: [NotificationModule, CloudinaryModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
