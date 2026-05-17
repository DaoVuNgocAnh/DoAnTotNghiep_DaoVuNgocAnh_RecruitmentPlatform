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
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { Audit } from 'src/common/decorators/audit.decorator';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
@Audit('APPLICATION')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @ApiOperation({ summary: 'Nộp hồ sơ ứng tuyển (Dành cho Ứng viên)' })
  @Post()
  @Roles(Role.CANDIDATE)
  create(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.service.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Lấy danh sách hồ sơ đã nộp (Dành cho Ứng viên)' })
  @Get('my-applications')
  @Roles(Role.CANDIDATE)
  getMyApps(@Request() req, @Query() pagination: PaginationQueryDto) {
    return this.service.findByCandidate(req.user.userId, pagination);
  }

  @ApiOperation({
    summary:
      'Lấy danh sách hồ sơ ứng tuyển vào công ty (Dành cho Nhà tuyển dụng)',
  })
  @Get('employer')
  @Roles(Role.EMPLOYER)
  getEmployerApps(@Request() req, @Query() pagination: PaginationQueryDto) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.service.findByEmployer(
      req.user.companyId,
      req.user.userId,
      req.user.isOwner,
      pagination,
    );
  }

  @ApiOperation({
    summary: 'Cập nhật trạng thái hồ sơ ứng tuyển (Dành cho Nhà tuyển dụng)',
  })
  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.service.updateStatus(
      id,
      req.user.companyId,
      req.user.userId,
      req.user.isOwner,
      dto,
    );
  }
}
