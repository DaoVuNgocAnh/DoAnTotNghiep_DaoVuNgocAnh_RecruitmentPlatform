import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobCategoryService } from './job-category.service';
import { JobCategoryDto } from './dto/job-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('job-categories')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  // 1. Lấy danh sách ngành nghề (Dùng cho cả khách và Employer chọn khi đăng tin)
  @Get()
  async findAll() {
    return this.jobCategoryService.findAll();
  }

  // 2. Tạo mới ngành nghề (Chỉ Admin hệ thống được phép)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: JobCategoryDto) {
    return this.jobCategoryService.create(dto);
  }

  // 3. Cập nhật ngành nghề (Chỉ Admin hệ thống được phép)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: JobCategoryDto) {
    return this.jobCategoryService.update(id, dto);
  }

  // 4. Xóa ngành nghề (Chỉ Admin hệ thống được phép - Soft delete)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.jobCategoryService.remove(id);
  }
}
