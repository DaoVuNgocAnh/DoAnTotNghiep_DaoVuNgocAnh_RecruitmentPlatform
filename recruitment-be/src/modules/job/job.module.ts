import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { NotificationModule } from '../notification/notification.module';
import { JobSchedule } from './job.schedule';

@Module({
  imports: [NotificationModule],
  controllers: [JobController],
  providers: [JobService, JobSchedule],
})
export class JobModule {}
