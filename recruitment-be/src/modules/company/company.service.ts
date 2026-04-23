import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CompanyDto } from './dto/company.dto';
import { RequestStatus, CompanyStatus } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

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

  // 2. Tìm kiếm theo Mã số thuế (Cho HR xin gia nhập)
  async findByTaxCode(taxCode: string) {
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
    return company;
  }

  // 3. Gửi yêu cầu gia nhập
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

  // 4. Lấy danh sách yêu cầu gia nhập (Dành cho Owner quản lý)
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

  // 5. Duyệt/Từ chối HR gia nhập công ty
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

  // 6. Reset hồ sơ khi bị REJECTED (Dành cho Employer đăng ký lại)
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

  // ==========================================
  // LOGIC DÀNH CHO ADMIN (HỆ THỐNG)
  // ==========================================

  // 7. Admin lấy toàn bộ danh sách công ty để duyệt
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

  // 8. Admin cập nhật trạng thái (VERIFIED, REJECTED, BLACKLISH)
  async updateStatusByAdmin(companyId: string, newStatus: CompanyStatus) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Không tìm thấy công ty');

    const currentStatus = company.status;

    // THIẾT LẬP LUỒNG CHẶN (BÀI TOÁN STATE MACHINE)

    // 1. Nếu đang PENDING: Chỉ cho phép sang VERIFIED hoặc REJECTED
    if (currentStatus === 'PENDING') {
      if (newStatus !== 'VERIFIED' && newStatus !== 'REJECTED') {
        throw new BadRequestException(
          'Công ty đang chờ duyệt chỉ có thể Chấp nhận hoặc Từ chối',
        );
      }
    }

    // 2. Nếu đang VERIFIED: Chỉ cho phép sang BLACKLISH (Chặn)
    else if (currentStatus === 'VERIFIED') {
      if (newStatus !== 'BLACKLISH') {
        throw new BadRequestException(
          'Công ty đã duyệt chỉ có thể đưa vào Danh sách đen',
        );
      }
    }

    // 3. Nếu đang REJECTED hoặc BLACKLISH: Không cho phép đổi sang bất cứ gì khác qua API này
    else {
      throw new BadRequestException(
        'Không thể thay đổi trạng thái của hồ sơ đã bị Từ chối hoặc bị Chặn',
      );
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: { status: newStatus },
    });
  }

  async cancelJoinRequest(userId: string, requestId: string) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại');

    // Bảo mật: Chỉ người tạo ra yêu cầu mới được phép xóa nó
    if (request.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền rút lại yêu cầu này');
    }

    return this.prisma.joinRequest.delete({
      where: { id: requestId },
    });
  }
}
