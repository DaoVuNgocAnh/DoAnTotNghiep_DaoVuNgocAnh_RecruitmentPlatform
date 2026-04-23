import { IsEmail, IsEnum, IsOptional, IsString, IsPhoneNumber, IsUUID } from 'class-validator';
import { Role, UserStatus } from '@prisma/client';

export class UserDto {
  @IsOptional() @IsUUID()
  id?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsString()
  @IsOptional() // Optional để dùng cho Update/View
  password?: string;

  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName!: string;

  @IsOptional() @IsEnum(Role)
  role?: Role;

  @IsOptional() @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  avatarUrl?: string;

  @IsOptional() @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional() @IsUUID()
  companyId?: string;
}