import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApplicationStatus, InterviewStatus } from '@prisma/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import {
  CreateInterviewDto,
  UpdateInterviewStatusDto,
} from './dto/interview.dto';

@Injectable()
export class InterviewService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(
    employerId: string,
    companyId: string,
    isOwner: boolean,
    dto: CreateInterviewDto,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        job: { include: { company: true, assignees: true } },
        candidate: { select: { fullName: true } },
      },
    });

    if (!this.canAccessApplication(app, companyId, employerId, isOwner)) {
      throw new ForbiddenException(
        'Ban khong co quyen tao lich phong van cho don nay',
      );
    }

    const interview = await this.prisma.$transaction(async (tx) => {
      const interviewRecord = await tx.interview.create({
        data: {
          applicationId: dto.applicationId,
          interviewDate: new Date(dto.interviewDate),
          location: dto.location,
          employerId,
          status: InterviewStatus.PENDING,
        },
      });

      await tx.application.update({
        where: { id: dto.applicationId },
        data: {
          status: ApplicationStatus.INTERVIEW,
          employerActionDate: new Date(),
          employerActionById: employerId,
        },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId: dto.applicationId,
          actorId: employerId,
          oldStatus: app!.status,
          newStatus: ApplicationStatus.INTERVIEW,
          note: `Scheduled interview at ${dto.location}`,
        },
      });

      return interviewRecord;
    });

    const dateFormatted = format(
      new Date(dto.interviewDate),
      'HH:mm dd/MM/yyyy',
      { locale: vi },
    );
    await this.notificationService.create({
      receiverId: app!.candidateId,
      senderId: employerId,
      type: 'INTERVIEW_SCHEDULED',
      title: 'Lich moi phong van moi',
      content: `Ban co lich phong van cho vi tri ${app!.job.title} vao luc ${dateFormatted} tai ${dto.location}`,
      targetType: 'INTERVIEW',
      targetId: interview.id,
    });

    return interview;
  }

  async findByEmployer(
    companyId: string,
    employerId: string,
    isOwner: boolean,
  ) {
    return this.prisma.interview.findMany({
      where: {
        isDeleted: false,
        application: {
          job: {
            companyId,
            OR: isOwner
              ? undefined
              : [
                  { createdById: employerId },
                  { assignees: { some: { userId: employerId } } },
                ],
          },
        },
      },
      include: {
        employer: { select: { id: true, fullName: true, email: true } },
        application: {
          include: {
            candidate: {
              select: { id: true, fullName: true, email: true, phone: true },
            },
            job: {
              select: {
                id: true,
                title: true,
                assignees: {
                  include: {
                    user: { select: { id: true, fullName: true, email: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { interviewDate: 'asc' },
    });
  }

  async findByCandidate(candidateId: string) {
    return this.prisma.interview.findMany({
      where: { application: { candidateId }, isDeleted: false },
      include: {
        application: {
          include: {
            job: {
              include: { company: { select: { name: true, logoUrl: true } } },
            },
          },
        },
      },
      orderBy: { interviewDate: 'asc' },
    });
  }

  async updateStatus(
    candidateId: string,
    interviewId: string,
    dto: UpdateInterviewStatusDto,
  ) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: { include: { company: true } },
            candidate: { select: { fullName: true } },
          },
        },
      },
    });

    if (!interview || interview.application.candidateId !== candidateId) {
      throw new ForbiddenException(
        'Ban khong co quyen xu ly loi moi phong van nay',
      );
    }

    const updatedInterview = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: dto.status,
        responseDate: new Date(),
      },
    });

    const statusText =
      dto.status === InterviewStatus.CONFIRMED
        ? 'da xac nhan tham gia'
        : 'da tu choi';
    await this.notificationService.create({
      receiverId: interview.application.job.company.ownerId,
      senderId: candidateId,
      type: 'INTERVIEW_RESPONSE',
      title: 'Phan hoi phong van',
      content: `Ung vien ${interview.application.candidate.fullName} ${statusText} buoi phong van vi tri ${interview.application.job.title}`,
      targetType: 'INTERVIEW',
      targetId: interviewId,
    });

    return updatedInterview;
  }

  private canAccessApplication(
    app: any,
    companyId: string,
    employerId: string,
    isOwner: boolean,
  ) {
    return (
      !!app &&
      !app.isDeleted &&
      app.job.companyId === companyId &&
      (isOwner ||
        app.job.createdById === employerId ||
        app.job.assignees?.some((assignee) => assignee.userId === employerId))
    );
  }
}
