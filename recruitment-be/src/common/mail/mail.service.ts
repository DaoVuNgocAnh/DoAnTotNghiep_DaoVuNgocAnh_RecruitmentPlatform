import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Chào mừng bạn đến với SmartCV!',
      template: './welcome', // Nếu dùng template engine, hoặc viết html trực tiếp bên dưới
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: sans-serif;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; border-top: 5px solid #00b14f;">
            <h1 style="color: #00b14f;">Chào mừng ${name}!</h1>
            <p>Cảm ơn bạn đã tham gia vào hệ thống tuyển dụng <b>SmartCV</b>.</p>
            <p>Tài khoản của bạn đã được khởi tạo thành công. Hãy bắt đầu cập nhật hồ sơ để tiếp cận những cơ hội việc làm tốt nhất.</p>
            <a href="#" style="background: #00b14f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Khám phá ngay</a>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời email này.</p>
          </div>
        </div>
      `,
    });
  }
}