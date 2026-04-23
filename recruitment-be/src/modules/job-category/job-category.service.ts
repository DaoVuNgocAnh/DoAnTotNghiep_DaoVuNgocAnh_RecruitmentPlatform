import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobCategoryDto } from './dto/job-category.dto';

@Injectable()
export class JobCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.jobCategory.findMany({
      where: { isDeleted: false },
    });
  }

  async create(dto: JobCategoryDto) {
    return this.prisma.jobCategory.create({
      data: {
        name: dto.categoryName,
        description: dto.description,
      },
    });
  }
}