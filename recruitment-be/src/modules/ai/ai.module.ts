import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiService } from './ai.service';
import { AiProcessor } from './ai.processor';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'AI_QUEUE',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000, // Thử lại sau 1 phút nếu lỗi (vd: lỗi 429)
        },
        removeOnComplete: true,
      },
    }),
  ],
  providers: [AiService, AiProcessor],
  exports: [AiService, BullModule],
})
export class AiModule {}
