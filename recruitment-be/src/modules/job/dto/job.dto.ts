import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { JobStatus, JobType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { Type, Transform } from 'class-transformer';

export class JobDto {
  @IsOptional() @IsUUID() id?: string; // job_id

  @IsOptional() @IsUUID() companyId?: string; // company_id

  @IsNotEmpty() @IsUUID() categoryId!: string; // category_id

  @IsNotEmpty() @IsString() title!: string;

  @IsNotEmpty() @IsString() description!: string;

  @IsNotEmpty() @IsString() requirement!: string;

  @IsOptional() @IsInt() @Min(0) @Type(() => Number) salaryMin?: number;
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) salaryMax?: number;
  @IsOptional() @IsBoolean() isSalaryNegotiable?: boolean;

  @IsOptional() @IsEnum(JobType) jobType?: JobType;

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

export class UpdateJobStatusAdminDto {
  @IsNotEmpty()
  @IsEnum(JobStatus)
  status: JobStatus;
}

export class GetJobsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMax?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isSalaryNegotiable?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'viewCount';
}

export class AdminJobQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
