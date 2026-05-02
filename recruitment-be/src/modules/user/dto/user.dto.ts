import { IsEmail, IsEnum, IsOptional, IsString, IsPhoneNumber, IsUUID, IsDateString } from 'class-validator';
import { Role, UserStatus } from '@prisma/client';

export class UserDto {
  @IsOptional() @IsUUID()
  id?: string;

  @IsOptional()
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

  @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @IsOptional() @IsString()
  bio?: string;

  @IsOptional() @IsString()
  skills?: string;

  @IsOptional() @IsString()
  avatarUrl?: string;

  @IsOptional() @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional() @IsUUID()
  companyId?: string;
}