import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { ApplicationStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // 1. Candidate nộp đơn
  async create(candidateId: string, dto: CreateApplicationDto) {
    // Check xem job có tồn tại và đang ACTIVE không
    const job = await this.prisma.job.findUnique({ 
      where: { id: dto.jobId },
      include: { company: true } 
    });
    if (!job || job.status !== 'ACTIVE' || job.isDeleted) {
      throw new BadRequestException('Tin tuyển dụng không tồn tại hoặc đã đóng');
    }

    // Check xem đã nộp chưa
    const existing = await this.prisma.application.findFirst({
      where: { jobId: dto.jobId, candidateId, isDeleted: false }
    });
    if (existing) throw new BadRequestException('Bạn đã ứng tuyển công việc này rồi');

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        candidateId,
        resumeId: dto.resumeId,
        status: ApplicationStatus.PENDING,
      },
      include: {
        candidate: { select: { fullName: true } }
      }
    });

    // Thông báo cho nhà tuyển dụng (Chủ sở hữu công ty)
    await this.notificationService.create({
      receiverId: job.company.ownerId,
      senderId: candidateId,
      type: 'NEW_APPLICATION',
      title: 'Ứng tuyển mới',
      content: `Ứng viên ${application.candidate.fullName} đã nộp đơn cho vị trí ${job.title}`,
      targetType: 'APPLICATION',
      targetId: application.id,
    });

    return application;
  }

  // 2. Candidate xem danh sách đã nộp
  async findByCandidate(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId, isDeleted: false },
      include: {
        job: { include: { company: true } },
        resume: true
      },
      orderBy: { applyDate: 'desc' }
    });
  }

  // 3. Employer xem danh sách ứng viên nộp vào công ty mình
  async findByEmployer(companyId: string) {
    const applications = await this.prisma.application.findMany({
      where: { job: { companyId }, isDeleted: false },
      include: {
        candidate: { select: { fullName: true, email: true, phone: true, avatarUrl: true } },
        job: { select: { title: true } },
        resume: true
      },
      orderBy: { applyDate: 'desc' }
    });

    // Tự động chuyển PENDING -> REVIEWING
    const pendingIds = applications
      .filter(app => app.status === ApplicationStatus.PENDING)
      .map(app => app.id);

    if (pendingIds.length > 0) {
      await this.prisma.application.updateMany({
        where: { id: { in: pendingIds } },
        data: { status: ApplicationStatus.REVIEWING }
      });
      
      // Cập nhật lại list trả về để đồng bộ UI
      applications.forEach(app => {
        if (pendingIds.includes(app.id)) app.status = ApplicationStatus.REVIEWING;
      });
    }

    return applications;
  }

  // 4. Employer cập nhật trạng thái (Duyệt/Từ chối/Hẹn phỏng vấn)
  async updateStatus(applicationId: string, companyId: string, dto: UpdateApplicationStatusDto) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { company: true } } }
    });

    if (!app || app.job.companyId !== companyId) {
      throw new ForbiddenException('Bạn không có quyền xử lý đơn này');
    }

    const updatedApp = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: dto.status,
        employerNote: dto.employerNote,
        employerActionDate: new Date()
      }
    });

    // Thông báo cho ứng viên
    let statusText = '';
    switch(dto.status) {
      case ApplicationStatus.ACCEPTED: statusText = 'được chấp nhận'; break;
      case ApplicationStatus.REJECTED: statusText = 'bị từ chối'; break;
      case ApplicationStatus.INTERVIEW: statusText = 'được mời phỏng vấn'; break;
    }

    if (statusText) {
      await this.notificationService.create({
        receiverId: app.candidateId,
        senderId: app.job.company.ownerId,
        type: 'APPLICATION_STATUS_UPDATED',
        title: 'Cập nhật trạng thái ứng tuyển',
        content: `Đơn ứng tuyển của bạn cho vị trí ${app.job.title} đã ${statusText}`,
        targetType: 'APPLICATION',
        targetId: applicationId,
      });
    }

    return updatedApp;
  }
}
