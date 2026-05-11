import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyStatus,
  RequestStatus,
  Role,
  PremiumRequestStatus,
} from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CompanyDto } from './dto/company.dto';
import { CreatePremiumRequestDto } from './dto/premium-request.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findAllPublic(query: { search?: string }) {
    return this.prisma.company.findMany({
      where: {
        status: CompanyStatus.VERIFIED,
        isDeleted: false,
        name: query.search
          ? { contains: query.search, mode: 'insensitive' }
          : undefined,
      },
      include: {
        _count: {
          select: { jobs: { where: { status: 'ACTIVE', isDeleted: false } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePublic(id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, status: CompanyStatus.VERIFIED, isDeleted: false },
      include: {
        jobs: {
          where: { status: 'ACTIVE', isDeleted: false },
          include: { category: true },
        },
      },
    });
    if (!company) throw new NotFoundException('Khong tim thay cong ty');
    return company;
  }

  async findByTaxCode(taxCode: string) {
    const company = await this.prisma.company.findUnique({
      where: { taxCode },
      select: { id: true, name: true, logoUrl: true, status: true },
    });
    if (!company) throw new NotFoundException('Khong tim thay doanh nghiep');
    return company;
  }

  async create(userId: string, dto: CompanyDto) {
    // 1. Kiem tra xem user da co cong ty chua
    const existing = await this.prisma.company.findFirst({
      where: { ownerId: userId },
    });
    if (existing) throw new BadRequestException('Ban da so huu mot cong ty');

    // 2. Kiem tra xem user co phai HR cua cong ty khac khong
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Nguoi dung khong ton tai');
    if (user.companyId)
      throw new BadRequestException('Ban dang thuoc mot cong ty khac');

    // 3. Tao cong ty o trang thai PENDING
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        taxCode: dto.taxCode,
        description: dto.description,
        websiteUrl: dto.websiteUrl,
        logoUrl: dto.logoUrl,
        ownerId: userId,
        status: CompanyStatus.PENDING,
      },
    });

    // 4. Cap nhat user thanh HR cua chinh cong ty minh
    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    return company;
  }

  async sendJoinRequest(userId: string, companyId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Nguoi dung khong ton tai');
    if (user.companyId)
      throw new BadRequestException('Ban da thuoc mot cong ty');

    // Check existing request
    const existing = await this.prisma.joinRequest.findUnique({
      where: { userId_companyId: { userId, companyId } }
    });
    if (existing) throw new BadRequestException('Ban da gui yeu cau cho cong ty nay');

    return this.prisma.joinRequest.create({
      data: { userId, companyId, status: RequestStatus.PENDING },
    });
  }

  async getMyCompanyRequests(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCompany: true },
    });
    if (!user || !user.ownedCompany) throw new ForbiddenException('Ban khong phai Owner');

    return this.prisma.joinRequest.findMany({
      where: { companyId: user.ownedCompany.id, status: RequestStatus.PENDING },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async getMembers(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.companyId) throw new NotFoundException('Ban khong thuoc cong ty');

    return this.prisma.user.findMany({
      where: { companyId: user.companyId, isDeleted: false },
      select: { id: true, fullName: true, email: true, role: true },
    });
  }

  async handleJoinRequest(userId: string, requestId: string, status: RequestStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCompany: true },
    });
    if (!user || !user.ownedCompany) throw new ForbiddenException('Ban khong phai Owner');

    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.companyId !== user.ownedCompany.id)
      throw new NotFoundException();

    return this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.joinRequest.update({
        where: { id: requestId },
        data: { status },
      });

      if (status === RequestStatus.ACCEPTED) {
        await tx.user.update({
          where: { id: request.userId },
          data: { companyId: request.companyId },
        });
      }
      return updatedRequest;
    });
  }

  async findAllForAdmin(query: { status?: CompanyStatus; search?: string }) {
    return this.prisma.company.findMany({
      where: {
        status: query.status || undefined,
        isDeleted: false,
        name: query.search
          ? { contains: query.search, mode: 'insensitive' }
          : undefined,
      },
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatusByAdmin(id: string, status: CompanyStatus) {
    return this.prisma.company.update({
      where: { id },
      data: { status },
    });
  }

  async assignMemberToJob(ownerId: string, jobId: string, memberId: string) {
    const owner = await this.prisma.user.findUnique({
      where: { id: ownerId },
      include: { ownedCompany: true },
    });
    if (!owner || !owner.ownedCompany)
      throw new ForbiddenException('Chi chu cong ty moi co quyen phan cong');

    // Check if job belongs to company
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.companyId !== owner.ownedCompany.id) {
      throw new ForbiddenException('Tin tuyen dung nay khong thuoc cong ty cua ban');
    }

    const member = await this.prisma.user.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Khong tim thay nguoi dung');
    if (member.companyId !== owner.ownedCompany.id)
      throw new BadRequestException('Nguoi nay khong thuoc cong ty cua ban');

    // Check existing assignment to avoid unique constraint error
    const existing = await this.prisma.jobAssignee.findUnique({
      where: { jobId_userId: { jobId, userId: memberId } }
    });
    if (existing) return existing;

    return this.prisma.jobAssignee.create({
      data: { jobId, userId: memberId, assignedById: ownerId },
    });
  }

  async unassignMemberFromJob(ownerId: string, jobId: string, memberId: string) {
    const owner = await this.prisma.user.findUnique({
      where: { id: ownerId },
      include: { ownedCompany: true },
    });
    if (!owner || !owner.ownedCompany)
      throw new ForbiddenException('Chi chu cong ty moi co quyen go phan cong');

    // Check if job belongs to company
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.companyId !== owner.ownedCompany.id) {
      throw new ForbiddenException('Tin tuyen dung nay khong thuoc cong ty cua ban');
    }

    return this.prisma.jobAssignee.deleteMany({
      where: { jobId, userId: memberId },
    });
  }

  async cancelJoinRequest(userId: string, requestId: string) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.userId !== userId) throw new NotFoundException();
    if (request.status !== RequestStatus.PENDING)
      throw new BadRequestException('Yeu cau da duoc xu ly, khong the huy');

    return this.prisma.joinRequest.delete({ where: { id: requestId } });
  }

  async deleteRejectedCompany(userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { ownerId: userId },
    });
    if (!company) throw new NotFoundException('Khong tim thay cong ty');
    if (company.status !== CompanyStatus.REJECTED) {
      throw new BadRequestException('Chi co the xoa cong ty bi tu choi');
    }

    return this.prisma.company.delete({ where: { id: company.id } });
  }

  // ==========================================
  // PREMIUM REQUESTS LOGIC
  // ==========================================

  async createPremiumRequest(userId: string, dto: CreatePremiumRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCompany: true },
    });

    if (!user || !user.ownedCompany) {
      throw new ForbiddenException('Chi chu doanh nghiep moi co the dang ky');
    }

    // Kiem tra neu dang co yeu cau PENDING
    const existing = await this.prisma.premiumRequest.findFirst({
      where: {
        companyId: user.ownedCompany.id,
        status: PremiumRequestStatus.PENDING,
      },
    });

    if (existing) {
      throw new BadRequestException('Ban dang co mot yeu cau dang cho xu ly');
    }

    const request = await this.prisma.premiumRequest.create({
      data: {
        ...dto,
        companyId: user.ownedCompany.id,
        userId: userId,
        status: PremiumRequestStatus.PENDING,
      },
      include: { company: true },
    });

    await this.notificationService.sendToAdmins({
      senderId: userId,
      type: 'PREMIUM_UPGRADE_REQUEST',
      title: 'Yeu cau nang cap Doi tac uy tin',
      content: `Doanh nghiep ${request.company.name} muon nang cap len goi Premium.`,
      targetType: 'COMPANY',
      targetId: request.companyId,
    });

    return request;
  }

  async findAllPremiumRequests(status?: PremiumRequestStatus) {
    return this.prisma.premiumRequest.findMany({
      where: { status: status || undefined },
      include: {
        company: true,
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handlePremiumRequest(id: string, status: PremiumRequestStatus) {
    const request = await this.prisma.premiumRequest.update({
      where: { id },
      data: { status },
      include: { company: true },
    });

    if (status === PremiumRequestStatus.APPROVED) {
      // Tu dong nang cap cong ty
      await this.prisma.company.update({
        where: { id: request.companyId },
        data: { isPremium: true },
      });

      await this.notificationService.create({
        receiverId: request.userId,
        type: 'PREMIUM_APPROVED',
        title: 'Nang cap Doi tac uy tin thanh cong',
        content: `Chuc mung! Cong ty ${request.company.name} cua ban da tro thanh Doi tac uy tin.`,
        targetType: 'COMPANY',
        targetId: request.companyId,
      });
    }

    return request;
  }
}
