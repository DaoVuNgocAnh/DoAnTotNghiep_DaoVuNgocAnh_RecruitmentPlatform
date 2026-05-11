// backend/src/modules/user/user.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserDto } from './dto/user.dto';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getCandidateById(candidateId: string, requesterId: string) {
    // 1. Lấy thông tin người yêu cầu (Để biết họ thuộc công ty nào)
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { role: true, companyId: true },
    });

    // 2. Lấy thông tin ứng viên
    const user = await this.prisma.user.findUnique({
      where: { id: candidateId },
      include: {
        // Chỉ lấy những Application nộp vào công ty của người đang xem (nếu người xem là EMPLOYER)
        applications:
          requester?.role === Role.EMPLOYER && requester.companyId
            ? {
                where: {
                  job: { companyId: requester.companyId },
                  isDeleted: false,
                },
                include: {
                  resume: true,
                  job: { select: { title: true } },
                },
              }
            : false,
      },
    });

    if (!user || user.role !== 'CANDIDATE')
      throw new NotFoundException('Không tìm thấy ứng viên');

    // 3. Xử lý logic bảo mật: Chỉ trả về thông tin public + hồ sơ đã nộp cho công ty này
    const { password, ...result } = user;

    // Chuyển đổi applications thành list resumes rút gọn để FE dễ dùng
    const submittedResumes =
      (user as any).applications?.map((app) => ({
        id: app.resume.id,
        resumeName: app.resume.resumeName,
        fileUrl: app.resume.fileUrl,
        jobTitle: app.job.title,
        applyDate: app.applyDate,
      })) || [];

    return {
      ...result,
      resumes: submittedResumes, // Chỉ ghi đè resumes bằng những cái đã nộp
      applications: undefined, // Ẩn bớt field thừa
    };
  }

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
              select: { id: true, name: true, taxCode: true },
            },
          },
          take: 1, // Tại 1 thời điểm User chỉ nên có 1 request Pending theo logic @@unique
        },
      },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const { password, joinRequests, company, ...result } = user;

    return {
      ...result,
      companyId: user.companyId,
      name: company?.name || null, // Trả về name thay vì companyName để FE dễ dùng chung cho cả Candidate/Employer
      logo_url: company?.logoUrl || null, // Trả về logo_url để FE dễ dùng chung cho cả Candidate/Employer
      // 1. Trạng thái phê duyệt của công ty (VERIFIED, PENDING, REJECTED, BLACKLIST)
      companyStatus: company?.status || null,

      // Check xem công ty có phải Premium không
      isPremium: company?.isPremium || false,

      // 2. Logic check Owner: Nếu ID của User trùng với ownerId của Company
      isOwner: company ? company.ownerId === userId : false,

      // 3. Thông tin yêu cầu gia nhập đang chờ (nếu có)
      // Nếu có, FE sẽ hiện màn hình JoinPendingPage
      pendingJoinRequest:
        joinRequests.length > 0
          ? {
              id: joinRequests[0].id,
              companyId: joinRequests[0].companyId,
              companyName: joinRequests[0].company.name,
              taxCode: joinRequests[0].company.taxCode,
            }
          : null,
    };
  }

  async findAllForAdmin() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        phone: true,
        companyId: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatusByAdmin(userId: string, status: UserStatus) {
    if (!Object.values(UserStatus).includes(status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isDeleted: true },
    });

    if (!user || user.isDeleted)
      throw new NotFoundException('Người dùng không tồn tại');
    if (user.role === Role.ADMIN && status === UserStatus.LOCKED) {
      throw new BadRequestException('Không thể khóa tài khoản Admin khác');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        phone: true,
        companyId: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: UserDto) {
    // Chỉ lấy các trường được phép update, tránh ghi đè email/password/role bừa bãi
    const { fullName, phone, address, dateOfBirth, bio, skills, avatarUrl } =
      data;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        bio,
        skills,
        avatarUrl,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        bio: true,
        skills: true,
        avatarUrl: true,
        role: true,
        companyId: true,
      },
    });
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const uploadResult = await this.cloudinary.uploadFile(file);

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploadResult.secure_url },
      select: { avatarUrl: true },
    });
  }
}
