import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobDto } from './dto/job.dto';
import { Role } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, companyId: string, dto: JobDto) {
    return this.prisma.job.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirement: dto.requirement,
        salary: dto.salary,
        location: dto.location,
        categoryId: dto.categoryId, 
        companyId: companyId, 
        createdById: userId, 
        status: 'PENDING',
        isFeatured: dto.isFeatured || false,
      },
    });
  }

  async findAll(query: any) {
    return this.prisma.job.findMany({
      where: {
        isDeleted: false,
        categoryId: query.categoryId || undefined,
        title: query.search
          ? { contains: query.search, mode: 'insensitive' }
          : undefined,
      },
      include: {
        company: true,
        category: true,
      },
    });
  }

  // BỔ SUNG HÀM FINDONE
  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id, isDeleted: false },
      include: {
        company: true,
        category: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng hoặc tin đã bị xóa');
    }

    // Tăng lượt xem tin (View Count)
    await this.prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return job;
  }

  // BỔ SUNG HÀM UPDATE
  async update(id: string, userId: string, role: string, dto: JobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng');

    // Nếu không phải Admin, thì phải là người thuộc cùng công ty mới được sửa
    if (role !== Role.ADMIN) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (job.companyId !== user?.companyId) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài đăng của công ty khác');
      }
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        requirement: dto.requirement,
        salary: dto.salary,
        location: dto.location,
        categoryId: dto.categoryId,
        status: dto.status,
        isFeatured: dto.isFeatured,
      },
    });
  }
}