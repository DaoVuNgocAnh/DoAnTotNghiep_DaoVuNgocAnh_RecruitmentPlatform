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
  ForbiddenException 
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobDto } from './dto/job.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // 1. Lấy danh sách bài đăng (Public - Có lọc theo category hoặc search)
  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.jobService.findAll({ categoryId, search });
  }

  // 2. Xem chi tiết một bài đăng
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  // 3. Đăng tin tuyển dụng mới (Chỉ dành cho Employer)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  async create(@Request() req, @Body() dto: JobDto) {
    const { userId, companyId } = req.user;

    // Logic bảo vệ: Chỉ người đã có công ty mới được đăng bài
    if (!companyId) {
      throw new ForbiddenException('Bạn phải thuộc về một công ty để đăng tin');
    }
    
    return this.jobService.create(userId, companyId, dto);
  }

  // 4. Cập nhật bài đăng (Chủ bài đăng cùng công ty hoặc Admin)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: JobDto,
  ) {
    return this.jobService.update(id, req.user.userId, req.user.role, dto);
  }
}