import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobDto } from './dto/job.dto';
import { Role, JobStatus } from '@prisma/client';

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
        status: JobStatus.PENDING, // Mặc định luôn là PENDING khi tạo
        isFeatured: dto.isFeatured || false,
        expiredDate: dto.expiredDate ? new Date(dto.expiredDate) : null,
      },
    });
  }

  // Candidate/Public: Chỉ lấy tin ACTIVE và CÒN HẠN
  async findAll(query: any) {
    const now = new Date();
    return this.prisma.job.findMany({
      where: {
        isDeleted: false,
        status: JobStatus.ACTIVE,
        // Chỉ lấy tin chưa hết hạn hoặc không có ngày hết hạn
        OR: [
          { expiredDate: null },
          { expiredDate: { gt: now } }
        ],
        categoryId: query.categoryId || undefined,
        title: query.search ? { contains: query.search, mode: 'insensitive' } : undefined,
      },
      include: {
        company: { select: { name: true, logoUrl: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id, isDeleted: false },
      include: { company: true, category: true },
    });
    if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    await this.prisma.job.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return job;
  }

  // DÀNH CHO ADMIN: Lấy tất cả tin để duyệt
  async findAllForAdmin(status?: JobStatus) {
    return this.prisma.job.findMany({
      where: { status: status || undefined, isDeleted: false },
      include: { company: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatusByAdmin(id: string, status: JobStatus) {
    return this.prisma.job.update({ where: { id }, data: { status } });
  }

  // DÀNH CHO EMPLOYER: Lấy danh sách tin của công ty mình
  async findAllForEmployer(companyId: string) {
    return this.prisma.job.findMany({
      where: { companyId, isDeleted: false },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async closeJob(id: string, companyId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job || job.companyId !== companyId) {
      throw new ForbiddenException('Bạn không có quyền đóng tin này');
    }
    return this.prisma.job.update({ where: { id }, data: { status: JobStatus.CLOSED } });
  }

  async update(id: string, userId: string, role: string, dto: JobDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng');

    if (role !== Role.ADMIN) {
      if (job.createdById !== userId) throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        ...dto,
        expiredDate: dto.expiredDate ? new Date(dto.expiredDate) : undefined,
      },
    });
  }
}