import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectQueue('email_queue') private emailQueue: Queue
  ) {}

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

  // Thêm method gửi email thông báo ứng tuyển (Job application)
  async sendApplicationNotification(employerEmail: string, candidateName: string, jobTitle: string) {
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