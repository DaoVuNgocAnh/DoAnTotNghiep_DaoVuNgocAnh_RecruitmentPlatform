import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { NotificationModule } from '../notification/notification.module';
import { JobSchedule } from './job.schedule';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [NotificationModule, AiModule],
  controllers: [JobController],
  providers: [JobService, JobSchedule],
})
export class JobModule {}
