import { Controller, Post, Body, Get } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { IsEmail, IsNotEmpty } from 'class-validator';

class SubscribeDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto.email);
  }

  // Route test để trigger tay (có thể bảo vệ bằng Admin guard nếu cần)
  @Get('trigger-test')
  async triggerTest() {
    await this.newsletterService.triggerTestNewsletter();
    return { message: 'Đã kích hoạt gửi bản tin thử nghiệm' };
  }
}
