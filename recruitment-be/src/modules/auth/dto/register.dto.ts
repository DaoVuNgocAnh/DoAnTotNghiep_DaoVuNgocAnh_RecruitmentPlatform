import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password!: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  fullName!: string; 

  @IsEnum(Role, { message: 'Role không hợp lệ' })
  @IsOptional()
  role?: Role = Role.CANDIDATE;
}