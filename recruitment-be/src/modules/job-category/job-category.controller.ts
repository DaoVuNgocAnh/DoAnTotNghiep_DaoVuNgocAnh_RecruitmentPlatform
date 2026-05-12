import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobCategoryService } from './job-category.service';
import { JobCategoryDto } from './dto/job-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Job Categories')
@Controller('job-categories')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách ngành nghề (Public)' })
  @Get()
  async findAll(@Query() pagination: PaginationQueryDto) {
    return this.jobCategoryService.findAll(pagination);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới ngành nghề (Dành cho Admin)' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: JobCategoryDto) {
    return this.jobCategoryService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật ngành nghề (Dành cho Admin)' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: JobCategoryDto) {
    return this.jobCategoryService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa ngành nghề - Soft delete (Dành cho Admin)' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.jobCategoryService.remove(id);
  }
}
