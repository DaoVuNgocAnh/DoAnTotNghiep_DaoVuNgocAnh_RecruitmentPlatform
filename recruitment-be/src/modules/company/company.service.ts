import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CompanyDto } from './dto/company.dto';
import { RequestStatus, CompanyStatus } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // 1. Tạo công ty (Dành cho Owner)
  async create(ownerId: string, dto: CompanyDto) {
    const exist = await this.prisma.company.findUnique({
      where: { taxCode: dto.taxCode },
    });
    if (exist) throw new ConflictException('Mã số thuế này đã được đăng ký!');

    const user = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (user?.companyId)
      throw new BadRequestException('Bạn đã thuộc về một công ty khác!');

    const company = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name,
          taxCode: dto.taxCode,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          logoUrl: dto.logoUrl,
          ownerId: ownerId,
        },
      });

      await tx.user.update({
        where: { id: ownerId },
        data: { companyId: company.id },
      });

      return company;
    });

    // Thông báo cho Admin có công ty mới đăng ký
    await this.notificationService.sendToAdmins({
      senderId: ownerId,
      type: 'NEW_COMPANY_REGISTERED',
      title: 'Yêu cầu duyệt công ty mới',
      content: `Doanh nghiệp ${company.name} vừa đăng ký và đang chờ duyệt.`,
      targetType: 'COMPANY',
      targetId: company.id,
    });

    return company;
  }

  // 2. Tìm kiếm theo Mã số thuế (Cho HR xin gia nhập) - Caching
  async findByTaxCode(taxCode: string) {
    const cacheKey = `company_taxcode_${taxCode}`;
    const cachedCompany = await this.cacheManager.get(cacheKey);
    if (cachedCompany) return cachedCompany;

    const company = await this.prisma.company.findUnique({
      where: { taxCode },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        taxCode: true,
        status: true,
        description: true,
      },
    });
    if (!company)
      throw new NotFoundException('Không tìm thấy công ty với mã số thuế này');
    
    await this.cacheManager.set(cacheKey, company, 3600); // Cache 1 tiếng
    return company;
  }

  // 8. Admin cập nhật trạng thái - Clear cache
  async updateStatusByAdmin(companyId: string, newStatus: CompanyStatus) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Không tìm thấy công ty');

    const currentStatus = company.status;

    if (currentStatus === 'PENDING') {
      if (newStatus !== 'VERIFIED' && newStatus !== 'REJECTED') {
        throw new BadRequestException(
          'Công ty đang chờ duyệt chỉ có thể Chấp nhận hoặc Từ chối',
        );
      }
    }
    else if (currentStatus === 'VERIFIED') {
      if (newStatus !== 'BLACKLISH') {
        throw new BadRequestException(
          'Công ty đã duyệt chỉ có thể đưa vào Danh sách đen',
        );
      }
    }
    else {
      throw new BadRequestException(
        'Không thể thay đổi trạng thái của hồ sơ đã bị Từ chối hoặc bị Chặn',
      );
    }

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: { status: newStatus },
    });

    // Thông báo cho chủ sở hữu công ty
    let title = '';
    let content = '';
    let type = '';

    if (newStatus === 'VERIFIED') {
      type = 'COMPANY_VERIFIED';
      title = 'Công ty đã được duyệt';
      content = `Chúc mừng! Công ty ${company.name} của bạn đã được Admin phê duyệt.`;
    } else if (newStatus === 'REJECTED') {
      type = 'COMPANY_REJECTED';
      title = 'Yêu cầu duyệt công ty bị từ chối';
      content = `Rất tiếc, hồ sơ công ty ${company.name} đã bị từ chối. Vui lòng kiểm tra lại thông tin.`;
    }

    if (type) {
      await this.notificationService.create({
        receiverId: company.ownerId,
        type,
        title,
        content,
        targetType: 'COMPANY',
        targetId: company.id,
      });
    }

    // Clear cache
    await this.cacheManager.del(`company_taxcode_${company.taxCode}`);
    return updated;
  }

  async handleJoinRequest(
    ownerId: string,
    requestId: string,
    status: RequestStatus,
  ) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { company: true },
    });

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại');
    if (request.company.ownerId !== ownerId)
      throw new ForbiddenException('Bạn không có quyền duyệt yêu cầu này');

    if (status === 'ACCEPTED') {
      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: request.userId },
          data: { companyId: request.companyId },
        });
        await tx.joinRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        });
      });

      // Thông báo cho HR
      await this.notificationService.create({
        receiverId: request.userId,
        senderId: ownerId,
        type: 'JOIN_REQUEST_ACCEPTED',
        title: 'Yêu cầu gia nhập được chấp nhận',
        content: `Bạn đã trở thành thành viên của công ty ${request.company.name}`,
        targetType: 'COMPANY',
        targetId: request.companyId,
      });

      return { message: 'Đã chấp nhận yêu cầu' };
    }

    await this.prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    // Thông báo cho HR
    await this.notificationService.create({
      receiverId: request.userId,
      senderId: ownerId,
      type: 'JOIN_REQUEST_REJECTED',
      title: 'Yêu cầu gia nhập bị từ chối',
      content: `Yêu cầu gia nhập công ty ${request.company.name} của bạn đã bị từ chối.`,
      targetType: 'COMPANY',
      targetId: request.companyId,
    });

    return { message: 'Đã từ chối yêu cầu' };
  }

  async getMyCompanyRequests(ownerId: string) {
    const company = await this.prisma.company.findUnique({
      where: { ownerId },
    });
    if (!company) throw new NotFoundException('Bạn chưa sở hữu công ty nào');

    return this.prisma.joinRequest.findMany({
      where: { companyId: company.id, status: 'PENDING' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
      },
    });
  }

  async sendJoinRequest(userId: string, companyId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { company: true } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user?.companyId)
      throw new BadRequestException('Bạn đã là thành viên của một công ty!');

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Công ty không tồn tại');

    const existingRequest = await this.prisma.joinRequest.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (existingRequest)
      throw new BadRequestException('Bạn đã gửi yêu cầu tới công ty này rồi');

    const request = await this.prisma.joinRequest.create({
      data: { userId, companyId },
    });

    // Thông báo cho chủ sở hữu công ty
    await this.notificationService.create({
      receiverId: company.ownerId,
      senderId: userId,
      type: 'JOIN_REQUEST_SENT',
      title: 'Yêu cầu gia nhập mới',
      content: `Ứng viên ${user.fullName} muốn gia nhập công ty của bạn.`,
      targetType: 'COMPANY',
      targetId: companyId,
    });

    return request;
  }

  async deleteRejectedCompany(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user || !user.companyId || !user.company) {
      throw new NotFoundException('Không tìm thấy hồ sơ công ty');
    }

    if (user.company.status !== 'REJECTED') {
      throw new BadRequestException(
        'Chỉ có thể tạo lại hồ sơ khi trạng thái hiện tại là REJECTED',
      );
    }

    if (user.company.ownerId !== userId) {
      throw new ForbiddenException(
        'Chỉ chủ sở hữu mới có quyền thực hiện thao tác này',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.joinRequest.deleteMany({
        where: { companyId: user.companyId as string },
      });
      await tx.company.delete({ where: { id: user.companyId as string } });
      return tx.user.update({
        where: { id: userId },
        data: { companyId: null },
      });
    });
  }

  async findAllForAdmin(query: { status?: CompanyStatus; search?: string }) {
    return this.prisma.company.findMany({
      where: {
        status: query.status || undefined,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: 'insensitive' } },
              { taxCode: { contains: query.search } },
            ]
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelJoinRequest(userId: string, requestId: string) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại');

    if (request.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền rút lại yêu cầu này');
    }

    return this.prisma.joinRequest.delete({
      where: { id: requestId },
    });
  }
}
