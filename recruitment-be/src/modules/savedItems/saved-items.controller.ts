import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavedItemsService } from './saved-items.service';
import { ToggleSavedItemDto } from './dto/toggle-saved-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TargetType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { FindAllSavedItemsDto } from './dto/find-all-saved-items.dto';

@ApiTags('Saved Items & Talent Pool')
@ApiBearerAuth()
@Controller('saved-items')
@UseGuards(JwtAuthGuard)
export class SavedItemsController {
  constructor(private readonly savedItemsService: SavedItemsService) {}

  @ApiOperation({ summary: 'Lưu hoặc bỏ lưu một mục (Việc làm/Ứng viên)' })
  @Post('toggle')
  toggle(@Req() req, @Body() dto: ToggleSavedItemDto) {
    return this.savedItemsService.toggle(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Cập nhật ghi chú cá nhân cho một mục đã lưu' })
  @Patch(':id/note')
  updateNote(@Req() req, @Param('id') id: string, @Body('note') note: string) {
    return this.savedItemsService.updateNote(req.user.userId, id, note);
  }

  @ApiOperation({ summary: 'Cập nhật ghi chú ứng viên trong Talent Pool của công ty' })
  @Patch('company/candidates/:id/note')
  updateCompanyNote(
    @Req() req,
    @Param('id') id: string,
    @Body('note') note: string,
  ) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.updateCompanyNote(
      req.user.userId,
      req.user.companyId,
      id,
      note,
    );
  }

  @ApiOperation({ summary: 'Thêm/Xóa ứng viên khỏi Talent Pool của công ty' })
  @Post('company/candidates/toggle/:candidateId')
  toggleCompanyCandidate(
    @Req() req,
    @Param('candidateId') candidateId: string,
  ) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.toggleCompanyCandidate(
      req.user.userId,
      req.user.companyId,
      candidateId,
    );
  }

  @ApiOperation({ summary: 'Lấy danh sách ứng viên trong Talent Pool của công ty' })
  @Get('company/candidates')
  findCompanyCandidates(@Req() req, @Query() pagination: PaginationQueryDto) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.findCompanyCandidates(
      req.user.userId,
      req.user.companyId,
      pagination,
    );
  }

  @ApiOperation({ summary: 'Kiểm tra xem ứng viên đã có trong Talent Pool của công ty chưa' })
  @Get('company/candidates/check/:targetId')
  checkCompanyCandidate(@Req() req, @Param('targetId') targetId: string) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.savedItemsService.checkCompanyCandidate(
      req.user.companyId,
      targetId,
    );
  }

  @ApiOperation({ summary: 'Lấy danh sách các mục đã lưu của cá nhân' })
  @Get()
  findAll(@Req() req, @Query() query: FindAllSavedItemsDto) {
    const { type, ...pagination } = query;
    return this.savedItemsService.findAll(req.user.userId, pagination, type);
  }

  @ApiOperation({ summary: 'Kiểm tra trạng thái lưu của một mục cụ thể' })
  @Get('check/:targetId')
  checkStatus(@Req() req, @Param('targetId') targetId: string) {
    return this.savedItemsService.checkStatus(req.user.userId, targetId);
  }
}
