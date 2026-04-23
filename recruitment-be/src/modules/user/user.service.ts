// backend/src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    // Tận dụng sức mạnh của Prisma để lấy 1 lần duy nhất tất cả thông tin liên quan
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        company: true, // Để check status và isOwner
        joinRequests: {
          // Chỉ lấy yêu cầu đang chờ duyệt của User này
          where: { status: 'PENDING' },
          include: { 
            company: { 
              select: { id: true, name: true, taxCode: true } 
            } 
          },
          take: 1, // Tại 1 thời điểm User chỉ nên có 1 request Pending theo logic @@unique
        }
      },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const { password, joinRequests, company, ...result } = user;

    return {
      ...result,
      companyId: user.companyId,
      // 1. Trạng thái phê duyệt của công ty (VERIFIED, PENDING, REJECTED, BLACKLISH)
      companyStatus: company?.status || null,
      
      // 2. Logic check Owner: Nếu ID của User trùng với ownerId của Company
      isOwner: company ? company.ownerId === userId : false,

      // 3. Thông tin yêu cầu gia nhập đang chờ (nếu có)
      // Nếu có, FE sẽ hiện màn hình JoinPendingPage
      pendingJoinRequest: joinRequests.length > 0 ? {
        id: joinRequests[0].id,
        companyId: joinRequests[0].companyId,
        companyName: joinRequests[0].company.name,
        taxCode: joinRequests[0].company.taxCode,
      } : null,
    };
  }

  async updateProfile(userId: string, data: UserDto) {
    // Chỉ lấy các trường được phép update, tránh ghi đè email/password/role bừa bãi
    const { fullName, phone, address, avatarUrl } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: { fullName, phone, address, avatarUrl },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        role: true,
        companyId: true,
      },
    });
  }
}