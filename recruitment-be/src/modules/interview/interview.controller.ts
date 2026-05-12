import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewService } from './interview.service';
import {
  CreateInterviewDto,
  UpdateInterviewStatusDto,
} from './dto/interview.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Interviews')
@ApiBearerAuth()
@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterviewController {
  constructor(private readonly service: InterviewService) {}

  @ApiOperation({ summary: 'Lên lịch phỏng vấn ứng viên (Nhà tuyển dụng)' })
  @Post()
  @Roles(Role.EMPLOYER)
  create(@Request() req, @Body() dto: CreateInterviewDto) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.service.create(
      req.user.userId,
      req.user.companyId,
      req.user.isOwner,
      dto,
    );
  }

  @ApiOperation({ summary: 'Lấy danh sách lịch phỏng vấn của công ty (Nhà tuyển dụng)' })
  @Get('employer')
  @Roles(Role.EMPLOYER)
  getEmployerInterviews(
    @Request() req,
    @Query() pagination: PaginationQueryDto,
  ) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.service.findByEmployer(
      req.user.companyId,
      req.user.userId,
      req.user.isOwner,
      pagination,
    );
  }

  @ApiOperation({ summary: 'Lấy lịch phỏng vấn của cá nhân (Ứng viên)' })
  @Get('my-interviews')
  @Roles(Role.CANDIDATE)
  getCandidateInterviews(
    @Request() req,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.service.findByCandidate(req.user.userId, pagination);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái chấp nhận/từ chối phỏng vấn (Ứng viên)' })
  @Patch(':id/status')
  @Roles(Role.CANDIDATE)
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateInterviewStatusDto,
  ) {
    return this.service.updateStatus(req.user.userId, id, dto);
  }
}
