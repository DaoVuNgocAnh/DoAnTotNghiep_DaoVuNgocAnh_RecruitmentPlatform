import { 
  Controller, Get, Post, Patch, Body, Param, 
  Query, UseGuards, Request, ForbiddenException 
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobDto } from './dto/job.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, JobStatus } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async findAll(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    return this.jobService.findAll({ categoryId, search });
  }

  // ROUTE ADMIN: Phê duyệt tin
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAllAdmin(@Query('status') status?: JobStatus) {
    return this.jobService.findAllForAdmin(status);
  }

  @Patch(':id/status/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatusAdmin(@Param('id') id: string, @Body('status') status: JobStatus) {
    return this.jobService.updateStatusByAdmin(id, status);
  }

  // ROUTE EMPLOYER: Quản lý tin cá nhân
  @Get('my-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async findMyJobs(@Request() req) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.findAllForEmployer(req.user.companyId, req.user.userId, req.user.isOwner);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async closeJob(@Param('id') id: string, @Request() req) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.closeJob(id, req.user.companyId, req.user.userId, req.user.isOwner);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async create(@Request() req, @Body() dto: JobDto) {
    if (!req.user.companyId) throw new ForbiddenException('Bạn phải thuộc về một công ty');
    return this.jobService.create(req.user.userId, req.user.companyId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async update(@Param('id') id: string, @Request() req, @Body() dto: JobDto) {
    return this.jobService.update(id, req.user.userId, req.user.role, req.user.companyId, req.user.isOwner, dto);
  }
}
