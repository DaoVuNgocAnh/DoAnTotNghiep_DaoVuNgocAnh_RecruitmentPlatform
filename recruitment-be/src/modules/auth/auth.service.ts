import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/core/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Kiểm tra email tồn tại chưa (kể cả những user đã bị soft delete)
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExist) {
      throw new ConflictException('Email này đã được đăng ký!');
    }

    // 2. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Lưu vào Database (ID tự sinh UUID)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role,
        status: UserStatus.ACTIVE, // Mặc định hoạt động
      },
    });

    // 4. Gửi email chào mừng
    this.mailService
      .sendUserWelcome(user.email, user.fullName)
      .catch((err) => console.error('Lỗi gửi mail: ', err));

    const { password, ...result } = user;
    return {
      message: 'Đăng ký tài khoản thành công!',
      user: result,
    };
  }

  async login(dto: LoginDto) {
    // 1. Tìm user bao gồm cả trạng thái
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true }
    });

    // 2. Kiểm tra tồn tại và Soft Delete
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 3. Kiểm tra trạng thái tài khoản (Bị khóa)
    if (user.status === UserStatus.LOCKED) {
      throw new ForbiddenException('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.');
    }

    // 4. Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 5. Tạo Token (payload chứa ID UUID)
    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      companyId: user.companyId // Thêm companyId vào payload
    };

    return {
      message: 'Đăng nhập thành công!',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyId: user.companyId, // Trả thêm ID công ty để FE xử lý logic
        isOwner: user.company ? user.company.ownerId === user.id : false,
        companyStatus: user.company?.status,
      },
    };
  }
}