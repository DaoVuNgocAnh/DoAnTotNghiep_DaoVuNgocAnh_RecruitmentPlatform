import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(candidateId: string, dto: CreateApplicationDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
      include: { company: true },
    });
    if (!job || job.status !== 'ACTIVE' || job.isDeleted) {
      throw new BadRequestException(
        'Tin tuyen dung khong ton tai hoac da dong',
      );
    }

    const existing = await this.prisma.application.findFirst({
      where: { jobId: dto.jobId, candidateId, isDeleted: false },
    });
    if (existing)
      throw new BadRequestException('Ban da ung tuyen cong viec nay roi');

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        candidateId,
        resumeId: dto.resumeId,
        status: ApplicationStatus.PENDING,
      },
      include: {
        candidate: { select: { fullName: true } },
      },
    });

    await this.notificationService.create({
      receiverId: job.company.ownerId,
      senderId: candidateId,
      type: 'NEW_APPLICATION',
      title: 'Ung tuyen moi',
      content: `Ung vien ${application.candidate.fullName} da nop don cho vi tri ${job.title}`,
      targetType: 'APPLICATION',
      targetId: application.id,
    });

    return application;
  }

  async findByCandidate(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId, isDeleted: false },
      include: {
        job: { include: { company: true } },
        resume: true,
      },
      orderBy: { applyDate: 'desc' },
    });
  }

  async findByEmployer(companyId: string, userId: string, isOwner: boolean) {
    const applications = await this.prisma.application.findMany({
      where: {
        isDeleted: false,
        job: {
          companyId,
          OR: isOwner
            ? undefined
            : [{ createdById: userId }, { assignees: { some: { userId } } }],
        },
      },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            createdById: true,
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
        },
        resume: true,
        employerActionBy: { select: { id: true, fullName: true, email: true } },
        histories: {
          include: {
            actor: { select: { id: true, fullName: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { applyDate: 'desc' },
    });

    const pendingIds = applications
      .filter((app) => app.status === ApplicationStatus.PENDING)
      .map((app) => app.id);

    if (pendingIds.length > 0) {
      await this.prisma.application.updateMany({
        where: { id: { in: pendingIds } },
        data: { status: ApplicationStatus.REVIEWING },
      });

      applications.forEach((app) => {
        if (pendingIds.includes(app.id))
          app.status = ApplicationStatus.REVIEWING;
      });
    }

    return applications;
  }

  async updateStatus(
    applicationId: string,
    companyId: string,
    userId: string,
    isOwner: boolean,
    dto: UpdateApplicationStatusDto,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: true,
            assignees: true,
          },
        },
      },
    });

    if (!this.canAccessApplication(app, companyId, userId, isOwner)) {
      throw new ForbiddenException('Ban khong co quyen xu ly don nay');
    }

    const updatedApp = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: dto.status,
          employerNote: dto.employerNote,
          employerActionDate: new Date(),
          employerActionById: userId,
        },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId,
          actorId: userId,
          oldStatus: app!.status,
          newStatus: dto.status,
          note: dto.employerNote,
        },
      });

      return updated;
    });

    let statusText = '';
    switch (dto.status) {
      case ApplicationStatus.ACCEPTED:
        statusText = 'duoc chap nhan';
        break;
      case ApplicationStatus.REJECTED:
        statusText = 'bi tu choi';
        break;
      case ApplicationStatus.INTERVIEW:
        statusText = 'duoc moi phong van';
        break;
    }

    if (statusText) {
      await this.notificationService.create({
        receiverId: app!.candidateId,
        senderId: userId,
        type: 'APPLICATION_STATUS_UPDATED',
        title: 'Cap nhat trang thai ung tuyen',
        content: `Don ung tuyen cua ban cho vi tri ${app!.job.title} da ${statusText}`,
        targetType: 'MY-APPLICATION',
        targetId: applicationId,
      });
    }

    return updatedApp;
  }

  private canAccessApplication(
    app: any,
    companyId: string,
    userId: string,
    isOwner: boolean,
  ) {
    return (
      !!app &&
      !app.isDeleted &&
      app.job.companyId === companyId &&
      (isOwner ||
        app.job.createdById === userId ||
        app.job.assignees?.some((assignee) => assignee.userId === userId))
    );
  }
}
