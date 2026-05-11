import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, Role } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { JobDto } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(userId: string, companyId: string, dto: JobDto) {
    const job = await this.prisma.$transaction(async (tx) => {
      const createdJob = await tx.job.create({
        data: {
          title: dto.title,
          description: dto.description,
          requirement: dto.requirement,
          salary: dto.salary,
          location: dto.location,
          categoryId: dto.categoryId,
          companyId,
          createdById: userId,
          status: JobStatus.PENDING,
          isFeatured: dto.isFeatured || false,
          expiredDate: dto.expiredDate ? new Date(dto.expiredDate) : null,
        },
        include: { company: true },
      });

      await tx.jobAssignee.create({
        data: {
          jobId: createdJob.id,
          userId,
          assignedById: userId,
        },
      });

      return createdJob;
    });

    await this.notificationService.sendToAdmins({
      senderId: userId,
      type: 'NEW_JOB_CREATED',
      title: 'Yeu cau duyet tin tuyen dung',
      content: `Doanh nghiep ${job.company.name} vua dang tin "${job.title}" va dang cho duyet.`,
      targetType: 'JOB',
      targetId: job.id,
    });

    await this.cacheManager.del('jobs_all');
    return job;
  }

  async findAll(query: any) {
    const cacheKey = `jobs_query_${JSON.stringify(query)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const now = new Date();
    const jobs = await this.prisma.job.findMany({
      where: {
        isDeleted: false,
        status: JobStatus.ACTIVE,
        OR: [{ expiredDate: null }, { expiredDate: { gt: now } }],
        categoryId: query.categoryId || undefined,
        title: query.search
          ? { contains: query.search, mode: 'insensitive' }
          : undefined,
      },
      include: {
        company: { select: { name: true, logoUrl: true, isPremium: true } },
        category: true,
      },
      orderBy: [{ company: { isPremium: 'desc' } }, { createdAt: 'desc' }],
    });

    await this.cacheManager.set(cacheKey, jobs, 300);
    return jobs;
  }

  async getTrendingJobs(limit: number = 10) {
    const trendingJobs: any[] = await this.prisma.$queryRaw`
      SELECT 
        j.id,
        j.title,
        j.salary,
        j.location,
        j.view_count as "viewCount",
        j.created_at as "createdAt",
        j.expired_date as "expiredDate",
        j.status,
        c.id as "companyId",
        c.company_name as "companyName",
        c.logo_url as "companyLogo",
        c.is_premium as "isPremiumCompany",
        cat.id as "categoryId",
        cat.category_name as "categoryName",
        (
          (j.view_count * 0.4 + (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.is_deleted = false) * 0.6) /
          pow(EXTRACT(EPOCH FROM (NOW() - j.created_at)) / 3600 + 2, 1.5)
        ) as "hotScore"
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      JOIN job_categories cat ON j.category_id = cat.id
      WHERE j.status = 'ACTIVE' 
        AND j.is_deleted = false
        AND (j.expired_date IS NULL OR j.expired_date > NOW())
      ORDER BY "hotScore" DESC
      LIMIT ${limit}
    `;

    // Map the results to match the Job interface expected by Frontend
    return trendingJobs.map((job) => ({
      id: job.id,
      title: job.title,
      salary: job.salary,
      location: job.location,
      status: job.status,
      viewCount: job.viewCount,
      createdAt: job.createdAt,
      expiredDate: job.expiredDate,
      company: {
        id: job.companyId,
        name: job.companyName,
        logoUrl: job.companyLogo,
        isPremium: job.isPremiumCompany,
      },
      category: {
        id: job.categoryId,
        name: job.categoryName,
      },
    }));
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
      if (!job) throw new NotFoundException('Khong tim thay tin tuyen dung');
      await this.cacheManager.set(cacheKey, job, 600);
    }

    await this.prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return job;
  }

  async findAllForAdmin(status?: JobStatus) {
    return this.prisma.job.findMany({
      where: { status: status || undefined, isDeleted: false },
      include: { company: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatusByAdmin(id: string, status: JobStatus) {
    const job = await this.prisma.job.update({
      where: { id },
      data: {
        status,
      },
      include: { company: true },
    });

    let title = '';
    let content = '';
    if (status === JobStatus.ACTIVE) {
      title = 'Tin tuyen dung da duoc duyet';
      content = `Tin tuyen dung "${job.title}" cua ban da duoc Admin phe duyet va hien thi cong khai.`;
    } else if (status === JobStatus.REJECTED) {
      title = 'Tin tuyen dung bi tu choi';
      content = `Tin tuyen dung "${job.title}" cua ban da bi tu choi phe duyet.`;
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
    await this.cacheManager.del('jobs_all');
    return job;
  }

  async findAllForEmployer(
    companyId: string,
    userId: string,
    isOwner: boolean,
  ) {
    return this.prisma.job.findMany({
      where: {
        companyId,
        isDeleted: false,
        OR: isOwner
          ? undefined
          : [{ createdById: userId }, { assignees: { some: { userId } } }],
      },
      include: {
        category: true,
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async closeJob(
    id: string,
    companyId: string,
    userId: string,
    isOwner: boolean,
  ) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { assignees: true },
    });

    if (!this.canManageJob(job, companyId, userId, isOwner)) {
      throw new ForbiddenException('Ban khong co quyen dong tin nay');
    }

    const updatedJob = await this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.CLOSED },
    });
    await this.cacheManager.del(`job_detail_${id}`);
    return updatedJob;
  }

  async update(
    id: string,
    userId: string,
    role: string,
    companyId: string,
    isOwner: boolean,
    dto: JobDto,
  ) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { assignees: true },
    });
    if (!job) throw new NotFoundException('Khong tim thay tin tuyen dung');

    if (
      role !== Role.ADMIN &&
      !this.canManageJob(job, companyId, userId, isOwner)
    ) {
      throw new ForbiddenException('Khong co quyen');
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

  private canManageJob(
    job: any,
    companyId: string,
    userId: string,
    isOwner: boolean,
  ) {
    return (
      !!job &&
      job.companyId === companyId &&
      (isOwner ||
        job.createdById === userId ||
        job.assignees?.some((assignee) => assignee.userId === userId))
    );
  }
}
