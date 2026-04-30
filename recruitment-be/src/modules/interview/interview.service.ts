import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateInterviewDto, UpdateInterviewStatusDto } from './dto/interview.dto';
import { ApplicationStatus, InterviewStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

@Injectable()
export class InterviewService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // 1. Employer tạo lịch phỏng vấn
  async create(employerId: string, companyId: string, dto: CreateInterviewDto) {
    const app = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { 
        job: { include: { company: true } },
        candidate: { select: { fullName: true } } 
      }
    });

    if (!app || app.job.companyId !== companyId) {
      throw new ForbiddenException('Bạn không có quyền tạo lịch phỏng vấn cho đơn này');
    }

    const interview = await this.prisma.$transaction(async (tx) => {
      // Tạo bản ghi Interview
      const interviewRecord = await tx.interview.create({
        data: {
          applicationId: dto.applicationId,
          interviewDate: new Date(dto.interviewDate),
          location: dto.location,
          employerId: employerId,
          status: InterviewStatus.PENDING,
        }
      });

      // Cập nhật trạng thái Application sang INTERVIEW
      await tx.application.update({
        where: { id: dto.applicationId },
        data: { status: ApplicationStatus.INTERVIEW }
      });

      return interviewRecord;
    });

    // Thông báo cho ứng viên
    const dateFormatted = format(new Date(dto.interviewDate), 'HH:mm dd/MM/yyyy', { locale: vi });
    await this.notificationService.create({
      receiverId: app.candidateId,
      senderId: employerId,
      type: 'INTERVIEW_SCHEDULED',
      title: 'Lịch mời phỏng vấn mới',
      content: `Bạn có lịch phỏng vấn cho vị trí ${app.job.title} vào lúc ${dateFormatted} tại ${dto.location}`,
      targetType: 'INTERVIEW',
      targetId: interview.id,
    });

    return interview;
  }

  // 2. Lấy danh sách phỏng vấn (cho Employer)
  async findByEmployer(companyId: string) {
    return this.prisma.interview.findMany({
      where: { application: { job: { companyId } }, isDeleted: false },
      include: {
        application: {
          include: {
            candidate: { select: { fullName: true, email: true, phone: true } },
            job: { select: { title: true } }
          }
        }
      },
      orderBy: { interviewDate: 'asc' }
    });
  }

  // 3. Lấy danh sách phỏng vấn (cho Candidate)
  async findByCandidate(candidateId: string) {
    return this.prisma.interview.findMany({
      where: { application: { candidateId }, isDeleted: false },
      include: {
        application: {
          include: {
            job: { include: { company: { select: { name: true, logoUrl: true } } } }
          }
        }
      },
      orderBy: { interviewDate: 'asc' }
    });
  }

  // 4. Candidate xác nhận hoặc từ chối phỏng vấn
  async updateStatus(candidateId: string, interviewId: string, dto: UpdateInterviewStatusDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: { 
        application: { 
          include: { 
            job: { include: { company: true } },
            candidate: { select: { fullName: true } }
          } 
        } 
      }
    });

    if (!interview || interview.application.candidateId !== candidateId) {
      throw new ForbiddenException('Bạn không có quyền xử lý lời mời phỏng vấn này');
    }

    const updatedInterview = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: dto.status,
        responseDate: new Date()
      }
    });

    // Thông báo cho nhà tuyển dụng
    const statusText = dto.status === InterviewStatus.CONFIRMED ? 'đã xác nhận tham gia' : 'đã từ chối';
    await this.notificationService.create({
      receiverId: interview.application.job.company.ownerId,
      senderId: candidateId,
      type: 'INTERVIEW_RESPONSE',
      title: 'Phản hồi phỏng vấn',
      content: `Ứng viên ${interview.application.candidate.fullName} ${statusText} buổi phỏng vấn vị trí ${interview.application.job.title}`,
      targetType: 'INTERVIEW',
      targetId: interviewId,
    });

    return updatedInterview;
  }
}
