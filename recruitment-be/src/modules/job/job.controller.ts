import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobService } from './job.service';
import {
  AdminJobQueryDto,
  GetJobsQueryDto,
  JobDto,
  UpdateJobStatusAdminDto,
} from './dto/job.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, JobStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({ summary: 'Tìm kiếm tin tuyển dụng (Public)' })
  @Get()
  async findAll(@Query() query: GetJobsQueryDto) {
    return this.jobService.findAll(query);
  }

  // ROUTE ADMIN: Phê duyệt tin
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tin tuyển dụng cho Admin' })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAllAdmin(@Query() query: AdminJobQueryDto) {
    const { status, ...pagination } = query;
    return this.jobService.findAllForAdmin(pagination, status);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin tuyển dụng xu hướng (Trending)' })
  @Get('trending')
  async getTrending() {
    return this.jobService.getTrendingJobs();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách việc làm gợi ý dựa trên AI/CV (Candidate)' })
  @Get('recommended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async getRecommended(@Request() req) {
    return this.jobService.getRecommendedJobs(req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái tin tuyển dụng (Admin phê duyệt/từ chối)' })
  @Patch(':id/status/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatusAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateJobStatusAdminDto,
  ) {
    return this.jobService.updateStatusByAdmin(id, dto.status);
  }

  // Remove the old featured endpoint if it existed or was planned

  // ROUTE EMPLOYER: Quản lý tin cá nhân
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tin tuyển dụng của công ty (Employer)' })
  @Get('my-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async findMyJobs(@Request() req, @Query() pagination: PaginationQueryDto) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.findAllForEmployer(
      req.user.companyId,
      req.user.userId,
      req.user.isOwner,
      pagination,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đóng tin tuyển dụng (Employer)' })
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async closeJob(@Param('id') id: string, @Request() req) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.closeJob(
      id,
      req.user.companyId,
      req.user.userId,
      req.user.isOwner,
    );
  }

  @ApiOperation({ summary: 'Lấy chi tiết một tin tuyển dụng' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tin tuyển dụng mới (Employer)' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async create(@Request() req, @Body() dto: JobDto) {
    if (!req.user.companyId)
      throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.create(req.user.userId, req.user.companyId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async update(@Param('id') id: string, @Request() req, @Body() dto: JobDto) {
    return this.jobService.update(
      id,
      req.user.userId,
      req.user.role,
      req.user.companyId,
      req.user.isOwner,
      dto,
    );
  }
}
