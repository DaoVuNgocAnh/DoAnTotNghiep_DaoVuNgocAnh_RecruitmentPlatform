import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;

  // Thêm dòng này để Backend chấp nhận trường rememberMe
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}