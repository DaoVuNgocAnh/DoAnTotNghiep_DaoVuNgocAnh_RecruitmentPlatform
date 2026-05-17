import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
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
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('AI_QUEUE') private aiQueue: Queue,
  ) {}

  async create(userId: string, companyId: string, dto: JobDto) {
    const job = await this.prisma.$transaction(async (tx) => {
      const createdJob = await tx.job.create({
        data: {
          title: dto.title,
          description: dto.description,
          requirement: dto.requirement,
          salaryMin: dto.salaryMin ? Math.round(dto.salaryMin) : null,
          salaryMax: dto.salaryMax ? Math.round(dto.salaryMax) : null,
          isSalaryNegotiable: dto.isSalaryNegotiable || false,
          jobType: dto.jobType || 'FULL_TIME',
          requiredExperience: dto.requiredExperience,
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

      // Đẩy vào hàng đợi AI ngay trong transaction (hoặc ngay sau đó)
      this.logger.log(
        `Pushing Job ID ${createdJob.id} to AI_QUEUE for analysis...`,
      );
      await this.aiQueue.add('analyze-job', {
        jobId: createdJob.id,
        type: 'job',
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
          OR: [{ expiredDate: null }, { expiredDate: { gt: now } }],
        },
      ],
    };

    if (query.categoryId) {
      (where.AND as any[]).push({ categoryId: query.categoryId });
    }

    if (query.companyId) {
      (where.AND as any[]).push({ companyId: query.companyId });
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
          OR: [{ salaryMax: { gte: query.salaryMin } }, { salaryMax: null }],
        });
      }
      if (query.salaryMax !== undefined) {
        overlapConditions.AND.push({
          OR: [{ salaryMin: { lte: query.salaryMax } }, { salaryMin: null }],
        });
      }
      (where.AND as any[]).push(overlapConditions);
    }

    if (query.search) {
      (where.AND as any[]).push({
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          {
            company: { name: { contains: query.search, mode: 'insensitive' } },
          },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    // Xử lý sắp xếp
    let orderBy: any = [
      { company: { isPremium: 'desc' } },
      { createdAt: 'desc' },
    ];

    if (query.sortBy === 'viewCount') {
      orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }];
    }

    const [total, jobs] = await this.prisma.$transaction([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true, isPremium: true },
          },
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

  async getRecommendedJobs(userId: string, limit: number = 6) {
    // 1. Lấy CV mặc định hoặc mới nhất đã được parse
    const resume = await this.prisma.resume.findFirst({
      where: {
        candidateId: userId,
        isDeleted: false,
        parsedSkills: { not: null },
      },
      orderBy: [{ isDefault: 'desc' }, { uploadedAt: 'desc' }],
    });

    let candidateSkills: string[] = [];
    let candidateJobTitle = '';

    if (resume?.parsedSkills) {
      candidateSkills = resume.parsedSkills
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      candidateJobTitle = resume.parsedJobTitle?.toLowerCase() || '';
      this.logger.log(
        `Matching using Resume: ${resume.resumeName} (ID: ${resume.id})`,
      );
    } else {
      // Fallback: Lấy kỹ năng từ profile user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.skills) {
        candidateSkills = user.skills
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
      }
      this.logger.log(
        `Matching using User Profile Skills (No AI Resume found)`,
      );
    }

    this.logger.debug(`Candidate Skills: [${candidateSkills.join(', ')}]`);
    this.logger.debug(`Candidate Job Title: ${candidateJobTitle}`);

    if (candidateSkills.length === 0 && !candidateJobTitle) {
      return this.getFallbackJobs(limit);
    }

    // 2. Lấy tất cả Job Active để tính điểm (Có thể tối ưu bằng FTS sau này)
    const activeJobs = await this.prisma.job.findMany({
      where: {
        status: JobStatus.ACTIVE,
        isDeleted: false,
        OR: [{ expiredDate: null }, { expiredDate: { gt: new Date() } }],
      },
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, isPremium: true },
        },
        category: true,
      },
    });

    // 3. Thuật toán tính điểm (Scoring Engine)
    const scoredJobs = activeJobs.map((job) => {
      let score = 0;
      const jobParsedSkills = job.parsedSkills
        ? job.parsedSkills
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
        : [];

      const jobTitle = job.title.toLowerCase();

      // Tiêu chí 1: Khớp Job Title (Trọng số cao: 50đ)
      if (candidateJobTitle && jobTitle.includes(candidateJobTitle)) {
        score += 50;
      } else if (candidateJobTitle) {
        // Khớp từng từ trong job title (vd: "Frontend" trong "Frontend Developer")
        const titleWords = candidateJobTitle
          .split(/\s+/)
          .filter((w) => w.length > 2);
        for (const word of titleWords) {
          if (jobTitle.includes(word)) score += 15;
        }
      }

      // Tiêu chí 2: Khớp Kỹ năng (Trọng số: 10đ/kỹ năng)
      for (const skill of candidateSkills) {
        // Kiểm tra trong parsedSkills của Job (đã qua AI)
        if (jobParsedSkills.includes(skill)) {
          score += 15;
        }
        // Kiểm tra trong title/requirement (phòng trường hợp AI chưa parse kịp)
        else if (
          jobTitle.includes(skill) ||
          job.requirement.toLowerCase().includes(skill)
        ) {
          score += 5;
        }
      }

      // Tiêu chí 3: Ưu tiên công ty Premium (+5đ)
      if (job.company.isPremium) score += 5;

      return { ...job, score };
    });

    // 4. Lọc bỏ job điểm 0 và sắp xếp
    let results = scoredJobs
      .filter((j) => j.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((j) => ({ ...j, isAiMatched: true }));

    // Fallback nếu không tìm thấy gì
    if (results.length === 0) {
      results = await this.getFallbackJobs(limit);
    }

    return results;
  }

  private async getFallbackJobs(limit: number) {
    const fallbackJobs = await this.prisma.job.findMany({
      where: { status: JobStatus.ACTIVE, isDeleted: false },
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, isPremium: true },
        },
        category: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    return fallbackJobs.map((job) => ({
      ...job,
      isAiMatched: false,
      score: 0,
    }));
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
        salaryMin: dto.salaryMin ? Math.round(dto.salaryMin) : null,
        salaryMax: dto.salaryMax ? Math.round(dto.salaryMax) : null,
        isSalaryNegotiable: dto.isSalaryNegotiable,
      },
    });

    // Nếu thay đổi các trường quan trọng, trigger AI phân tích lại Job
    if (dto.title || dto.description || dto.requirement) {
      await this.aiQueue.add('analyze-job', {
        jobId: updated.id,
        type: 'job',
      });
    }

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
