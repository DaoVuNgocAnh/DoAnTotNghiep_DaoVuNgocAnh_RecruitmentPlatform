import { IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @IsNotEmpty({ message: 'Mã tin tuyển dụng không được để trống' })
  @IsUUID()
  jobId!: string;

  @IsNotEmpty({ message: 'Vui lòng chọn CV để ứng tuyển' })
  @IsUUID()
  resumeId!: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  employerNote?: string;
}