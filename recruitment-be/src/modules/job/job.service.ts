import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JobDto } from './dto/job.dto';
import { Role, JobStatus } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(userId: string, companyId: string, dto: JobDto) {
    const job = await this.prisma.job.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirement: dto.requirement,
        salary: dto.salary,
        location: dto.location,
        categoryId: dto.categoryId,
        companyId: companyId,
        createdById: userId,
        status: JobStatus.PENDING, 
        isFeatured: dto.isFeatured || false,
        expiredDate: dto.expiredDate ? new Date(dto.expiredDate) : null,
      },
      include: { company: true }
    });

    // Thông báo cho Admin có tin tuyển dụng mới chờ duyệt
    await this.notificationService.sendToAdmins({
      senderId: userId,
      type: 'NEW_JOB_CREATED',
      title: 'Yêu cầu duyệt tin tuyển dụng',
      content: `Doanh nghiệp ${job.company.name} vừa đăng tin "${job.title}" và đang chờ duyệt.`,
      targetType: 'JOB',
      targetId: job.id,
    });

    // Xóa cache danh sách khi có job mới
    await this.cacheManager.del('jobs_all');
    return job;
  }

  // Candidate/Public: Caching danh sách job
  async findAll(query: any) {
    const cacheKey = `jobs_query_${JSON.stringify(query)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const now = new Date();
    const jobs = await this.prisma.job.findMany({
      where: {
        isDeleted: false,
        status: JobStatus.ACTIVE,
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

    await this.cacheManager.set(cacheKey, jobs, 300); // Cache trong 5 phút
    return jobs;
  }

  async findOne(id: string) {
    const cacheKey = `job_detail_${id}`;
    const cachedJob = await this.cacheManager.get(cacheKey);

    let job: any = cachedJob;
    if (!job) {
      job = await this.prisma.job.findUnique({
        where: { id, isDeleted: false },
        include: { company: true, category: true },
      });
      if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng');
      await this.cacheManager.set(cacheKey, job, 600);
    }

    // Luôn cập nhật viewCount trực tiếp vào DB, không cần đợi cache
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
    const job = await this.prisma.job.update({ 
      where: { id }, 
      data: { status },
      include: { company: true } 
    });

    // Thông báo cho người tạo tin (Employer)
    let title = '';
    let content = '';
    if (status === JobStatus.ACTIVE) {
      title = 'Tin tuyển dụng đã được duyệt';
      content = `Tin tuyển dụng "${job.title}" của bạn đã được Admin phê duyệt và hiển thị công khai.`;
    } else if (status === JobStatus.REJECTED) {
      title = 'Tin tuyển dụng bị từ chối';
      content = `Tin tuyển dụng "${job.title}" của bạn đã bị từ chối phê duyệt.`;
    }

    if (title && job.createdById) {
      await this.notificationService.create({
        receiverId: job.createdById,
        type: 'JOB_STATUS_UPDATED',
        title,
        content,
        targetType: 'JOB',
        targetId: job.id,
      });
    }

    await this.cacheManager.del(`job_detail_${id}`);
    await this.cacheManager.del('jobs_all'); // Clear danh sách công khai
    return job;
  }

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
    const updatedJob = await this.prisma.job.update({ where: { id }, data: { status: JobStatus.CLOSED } });
    await this.cacheManager.del(`job_detail_${id}`);
    return updatedJob;
  }

  async update(id: string, userId: string, role: string, dto: JobDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng');

    if (role !== Role.ADMIN) {
      if (job.createdById !== userId) throw new ForbiddenException('Không có quyền');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        ...dto,
        expiredDate: dto.expiredDate ? new Date(dto.expiredDate) : undefined,
      },
    });

    await this.cacheManager.del(`job_detail_${id}`);
    return updated;
  }
}