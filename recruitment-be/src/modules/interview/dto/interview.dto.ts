import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { InterviewStatus } from '@prisma/client';

export class CreateInterviewDto {
  @IsNotEmpty({ message: 'ID đơn ứng tuyển không được để trống' })
  @IsString()
  applicationId: string;

  @IsNotEmpty({ message: 'Ngày phỏng vấn không được để trống' })
  @IsDateString({}, { message: 'Ngày phỏng vấn không đúng định dạng' })
  interviewDate: string;

  @IsNotEmpty({ message: 'Địa điểm phỏng vấn không được để trống' })
  @IsString()
  location: string;
}

export class UpdateInterviewStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(InterviewStatus)
  status: InterviewStatus;
}
