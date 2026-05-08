import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobSchedule {
  private readonly logger = new Logger(JobSchedule.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running Cron Job: Closing expired jobs...');

    const now = new Date();

    const result = await this.prisma.job.updateMany({
      where: {
        status: JobStatus.ACTIVE,
        expiredDate: {
          lt: now,
        },
      },
      data: {
        status: JobStatus.CLOSED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Closed ${result.count} expired jobs.`);
    }
  }
}
