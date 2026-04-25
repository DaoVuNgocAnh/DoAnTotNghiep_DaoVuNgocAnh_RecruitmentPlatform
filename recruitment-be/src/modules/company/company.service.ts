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

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
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

    return this.prisma.$transaction(async (tx) => {
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

  // ... (giữ nguyên các methods khác)

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

    // Clear cache
    await this.cacheManager.del(`company_taxcode_${company.taxCode}`);
    return updated;
  }

  // ... (giữ nguyên các methods khác)
  
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
      return this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: request.userId },
          data: { companyId: request.companyId },
        });
        return tx.joinRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        });
      });
    }

    return this.prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.companyId)
      throw new BadRequestException('Bạn đã là thành viên của một công ty!');

    const existingRequest = await this.prisma.joinRequest.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (existingRequest)
      throw new BadRequestException('Bạn đã gửi yêu cầu tới công ty này rồi');

    return this.prisma.joinRequest.create({
      data: { userId, companyId },
    });
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
