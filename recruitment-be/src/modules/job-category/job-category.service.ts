import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobCategoryDto } from './dto/job-category.dto';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';

@Injectable()
export class JobCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 100 } = pagination; // Default 100 for categories
    const skip = (page - 1) * limit;

    const where = { isDeleted: false };

    const [total, categories] = await this.prisma.$transaction([
      this.prisma.jobCategory.count({ where }),
      this.prisma.jobCategory.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: JobCategoryDto) {
    return this.prisma.jobCategory.create({
      data: {
        name: dto.categoryName,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: JobCategoryDto) {
    return this.prisma.jobCategory.update({
      where: { id },
      data: {
        name: dto.categoryName,
        description: dto.description,
      },
    });
  }

  async remove(id: string) {
    // 1. Kiểm tra xem có Job nào đang sử dụng category này không (không tính các job đã bị xóa mềm)
    const jobCount = await this.prisma.job.count({
      where: {
        categoryId: id,
        isDeleted: false,
      },
    });

    if (jobCount > 0) {
      throw new BadRequestException(
        `Không thể xóa ngành nghề này vì đang có ${jobCount} tin tuyển dụng đang hoạt động thuộc danh mục này.`,
      );
    }

    // 2. Nếu không có job nào thì mới cho phép ẩn ngành nghề
    return this.prisma.jobCategory.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
