import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { JobStatus } from '@prisma/client';

export class JobDto {
  @IsOptional() @IsUUID() id?: string; // job_id

  @IsOptional() @IsUUID() companyId?: string; // company_id

  @IsNotEmpty() @IsUUID() categoryId!: string; // category_id

  @IsNotEmpty() @IsString() title!: string;

  @IsNotEmpty() @IsString() description!: string;

  @IsNotEmpty() @IsString() requirement!: string;

  @IsNotEmpty() @IsString() salary!: string;

  @IsNotEmpty() @IsString() location!: string;

  @IsOptional() @IsEnum(JobStatus) status?: JobStatus;

  // TRƯỜNG MỚI: Thời hạn tuyển dụng
  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn không đúng định dạng ISO 8601' })
  expiredDate?: string;

  @IsOptional() @IsBoolean() isFeatured?: boolean; // is_featured

  @IsOptional() @IsNumber() viewCount?: number; // view_count

  @IsOptional() @IsUUID() createdById?: string; // created_by

  @IsOptional() @IsBoolean() isDeleted?: boolean; // is_deleted
}
