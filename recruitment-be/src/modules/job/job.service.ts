import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, Prisma, Role } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { GetJobsQueryDto, JobDto } from './dto/job.dto';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';

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
          salaryMin: dto.salaryMin,
          salaryMax: dto.salaryMax,
          isSalaryNegotiable: dto.isSalaryNegotiable || false,
          jobType: dto.jobType || 'FULL_TIME',
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

  async findAll(query: GetJobsQueryDto): Promise<PaginatedResponse<any>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `jobs_query_${JSON.stringify(query)}`;
    const cachedData =
      await this.cacheManager.get<PaginatedResponse<any>>(cacheKey);
    if (cachedData) return cachedData;

    const now = new Date();
    
    // Xây dựng điều kiện lọc
    const where: Prisma.JobWhereInput = {
      isDeleted: false,
      status: JobStatus.ACTIVE,
      // Đảm bảo tin còn hạn
      AND: [
        {
          OR: [
            { expiredDate: null },
            { expiredDate: { gt: now } },
          ],
        },
      ],
    };

    if (query.categoryId) {
      (where.AND as any[]).push({ categoryId: query.categoryId });
    }

    if (query.jobType) {
      (where.AND as any[]).push({ jobType: query.jobType });
    }

    if (query.location && query.location !== 'Tất cả địa điểm') {
      (where.AND as any[]).push({
        location: { contains: query.location, mode: 'insensitive' },
      });
    }

    // Xử lý lọc lương chuyên sâu
    if (query.isSalaryNegotiable === true) {
      // 1. Chỉ lấy các tin thỏa thuận
      (where.AND as any[]).push({ isSalaryNegotiable: true });
    } else if (query.salaryMin !== undefined || query.salaryMax !== undefined) {
      // 2. Lấy các tin có khoảng lương giao thoa và KHÔNG phải là thỏa thuận
      (where.AND as any[]).push({ isSalaryNegotiable: false });
      
      const overlapConditions: any = { AND: [] };
      if (query.salaryMin !== undefined) {
        overlapConditions.AND.push({
          OR: [
            { salaryMax: { gte: query.salaryMin } },
            { salaryMax: null }
          ]
        });
      }
      if (query.salaryMax !== undefined) {
        overlapConditions.AND.push({
          OR: [
            { salaryMin: { lte: query.salaryMax } },
            { salaryMin: null }
          ]
        });
      }
      (where.AND as any[]).push(overlapConditions);
    }

    if (query.search) {
      (where.AND as any[]).push({
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { company: { name: { contains: query.search, mode: 'insensitive' } } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    // Xử lý sắp xếp
    let orderBy: any = [{ company: { isPremium: 'desc' } }, { createdAt: 'desc' }];
    
    if (query.sortBy === 'viewCount') {
      orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }];
    }

    const [total, jobs] = await this.prisma.$transaction([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logoUrl: true, isPremium: true } },
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const result = {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async getTrendingJobs(limit: number = 10) {
    const trendingJobs: any[] = await this.prisma.$queryRaw`
      SELECT 
        j.id,
        j.title,
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
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      isSalaryNegotiable: job.isSalaryNegotiable,
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

  async findAllForAdmin(
    pagination: PaginationQueryDto,
    status?: JobStatus,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = { status: status || undefined, isDeleted: false };

    const [total, jobs] = await this.prisma.$transaction([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        include: { company: true, category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      companyId,
      isDeleted: false,
      OR: isOwner
        ? undefined
        : [{ createdById: userId }, { assignees: { some: { userId } } }],
    };

    const [total, jobs] = await this.prisma.$transaction([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
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
        skip,
        take: limit,
      }),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
        jobType: dto.jobType,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        isSalaryNegotiable: dto.isSalaryNegotiable,
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
