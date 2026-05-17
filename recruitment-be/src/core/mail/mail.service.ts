import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue('email_queue') private emailQueue: Queue) {}

  async sendUserWelcome(email: string, name: string) {
    const html = `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: sans-serif;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; border-top: 5px solid #00b14f;">
            <h1 style="color: #00b14f;">Chào mừng ${name}!</h1>
            <p>Cảm ơn bạn đã tham gia vào hệ thống tuyển dụng <b>SmartCV</b>.</p>
            <p>Tài khoản của bạn đã được khởi tạo thành công. Hãy bắt đầu cập nhật hồ sơ để tiếp cận những cơ hội việc làm tốt nhất.</p>
            <a href="#" style="background: #00b14f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Khám phá ngay</a>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời email này.</p>
          </div>
        </div>
      `;

    await this.emailQueue.add('send_welcome', {
      to: email,
      subject: 'Chào mừng bạn đến với SmartCV!',
      html,
    });

    this.logger.log(`Đã đẩy email chào mừng ${email} vào hàng chờ.`);
  }

  async sendNewsletterConfirmation(email: string) {
    const html = `
      <div style="background-color: #f8fafc; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; background: #00b14f; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; transform: rotate(-6deg);">
              <span style="color: white; font-size: 32px; font-weight: 900;">S</span>
            </div>
            <h1 style="color: #0f172a; margin-top: 24px; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Xác nhận đăng ký</h1>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Chào bạn,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã đăng ký nhận bản tin từ <b>SmartCV</b>. Bạn sẽ là người đầu tiên nhận được thông tin về các cơ hội việc làm mới nhất và hấp dẫn nhất hàng tuần.</p>
          <div style="margin: 32px 0; padding: 24px; background: #f0fdf4; border-radius: 16px; border: 1px border-dashed #bbf7d0;">
            <p style="color: #166534; margin: 0; font-weight: 600; text-align: center;">Đăng ký của bạn đã được kích hoạt thành công!</p>
          </div>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 SmartCV Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.emailQueue.add('send_newsletter_confirm', {
      to: email,
      subject: 'Xác nhận đăng ký bản tin SmartCV',
      html,
    });
  }

  async sendWeeklyJobDigest(email: string, jobs: any[]) {
    const jobItems = jobs
      .map(
        (job) => `
      <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h3 style="margin: 0 0 8px 0; color: #0f172a;">${job.title}</h3>
        <p style="margin: 0 0 12px 0; color: #00b14f; font-weight: 600;">${job.company.name}</p>
        <div style="font-size: 14px; color: #64748b;">
          <span>📍 ${job.location}</span> • <span>💰 ${job.isSalaryNegotiable ? 'Thỏa thuận' : job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} tr` : 'Thỏa thuận'}</span>
        </div>
        <a href="http://localhost:5173/jobs/${job.id}" style="display: inline-block; margin-top: 16px; color: #00b14f; font-weight: 700; text-decoration: none;">Xem chi tiết →</a>
      </div>
    `,
      )
      .join('');

    const html = `
      <div style="background-color: #f8fafc; padding: 40px; font-family: sans-serif;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 24px;">
          <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 24px;">Cơ hội việc làm nổi bật trong tuần</h2>
          <p style="color: #475569; margin-bottom: 32px;">SmartCV đã tổng hợp những vị trí phù hợp nhất dành cho bạn trong 7 ngày qua.</p>
          ${jobItems}
          <div style="text-align: center; margin-top: 40px;">
            <a href="http://localhost:5173/jobs" style="background: #00b14f; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 800;">KHÁM PHÁ TẤT CẢ VIỆC LÀM</a>
          </div>
        </div>
      </div>
    `;

    await this.emailQueue.add('send_weekly_digest', {
      to: email,
      subject: 'Bản tin việc làm hàng tuần từ SmartCV',
      html,
    });
  }

  // Thêm method gửi email thông báo ứng tuyển (Job application)
  async sendApplicationNotification(
    employerEmail: string,
    candidateName: string,
    jobTitle: string,
  ) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Thông báo ứng tuyển mới</h2>
        <p>Ứng viên <b>${candidateName}</b> vừa nộp đơn vào vị trí <b>${jobTitle}</b> của bạn.</p>
        <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết hồ sơ.</p>
      </div>
    `;

    await this.emailQueue.add('send_application', {
      to: employerEmail,
      subject: `Ứng tuyển mới: ${jobTitle}`,
      html,
    });
  }
}
