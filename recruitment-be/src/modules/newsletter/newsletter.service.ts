import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/core/database/prisma.service';
import { MailService } from 'src/core/mail/mail.service';
import { subDays } from 'date-fns';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async subscribe(email: string) {
    const subscription = await this.prisma.newsletterSubscription.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    await this.mailService.sendNewsletterConfirmation(email);
    return subscription;
  }

  // Chạy vào 8:00 sáng thứ Hai hàng tuần
  @Cron('0 8 * * 1')
  async handleWeeklyNewsletter() {
    this.logger.log('Bắt đầu xử lý bản tin việc làm hàng tuần...');

    // 1. Lấy các việc làm mới trong 7 ngày qua
    const sevenDaysAgo = subDays(new Date(), 7);
    const newJobs = await this.prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        createdAt: { gte: sevenDaysAgo },
      },
      include: {
        company: { select: { name: true } },
      },
      take: 10, // Lấy tối đa 10 tin tiêu biểu
      orderBy: { createdAt: 'desc' },
    });

    if (newJobs.length === 0) {
      this.logger.log(
        'Không có việc làm mới trong tuần qua. Bỏ qua gửi bản tin.',
      );
      return;
    }

    // 2. Lấy danh sách người đăng ký
    const subscribers = await this.prisma.newsletterSubscription.findMany();

    // 3. Gửi email cho từng người (thông qua hàng đợi BullMQ trong MailService)
    for (const sub of subscribers) {
      try {
        await this.mailService.sendWeeklyJobDigest(sub.email, newJobs);
      } catch (error) {
        this.logger.error(`Lỗi khi gửi bản tin cho ${sub.email}:`, error);
      }
    }

    this.logger.log(`Đã đẩy ${subscribers.length} email bản tin vào hàng chờ.`);
  }

  // Endpoint test để kích hoạt gửi mail ngay lập tức (chỉ dành cho dev)
  async triggerTestNewsletter() {
    return this.handleWeeklyNewsletter();
  }
}
