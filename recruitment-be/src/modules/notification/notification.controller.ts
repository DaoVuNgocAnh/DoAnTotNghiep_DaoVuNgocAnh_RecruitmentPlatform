import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Lấy danh sách thông báo' })
  @Get()
  findAll(@Req() req, @Query() pagination: PaginationQueryDto) {
    return this.notificationService.findAll(req.user.userId, pagination);
  }

  @ApiOperation({ summary: 'Đếm số thông báo chưa đọc' })
  @Get('unread-count')
  countUnread(@Req() req) {
    return this.notificationService.countUnread(req.user.userId);
  }

  @ApiOperation({ summary: 'Đánh dấu 1 thông báo đã đọc' })
  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.userId, id);
  }

  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @ApiOperation({ summary: 'Xóa thông báo' })
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.notificationService.remove(req.user.userId, id);
  }
}
