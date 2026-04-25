import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('email_queue')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { to, subject, html } = job.data;
    
    this.logger.log(`Đang gửi email tới ${to} (Job ID: ${job.id})...`);
    
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      this.logger.log(`Đã gửi email thành công tới ${to}`);
    } catch (error) {
      this.logger.error(`Lỗi khi gửi email tới ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; 
    }
  }
}
