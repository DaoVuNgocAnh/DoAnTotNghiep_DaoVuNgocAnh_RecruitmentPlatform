import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { JobStatus } from '@prisma/client';

export class JobDto {
  @IsOptional() @IsUUID() id?: string; // job_id

  @IsNotEmpty() @IsUUID() companyId!: string; // company_id

  @IsNotEmpty() @IsUUID() categoryId!: string; // category_id

  @IsNotEmpty() @IsString() title!: string;

  @IsNotEmpty() @IsString() description!: string;

  @IsNotEmpty() @IsString() requirement!: string;

  @IsNotEmpty() @IsString() salary!: string;

  @IsNotEmpty() @IsString() location!: string;

  @IsOptional() @IsEnum(JobStatus) status?: JobStatus;

  @IsOptional() @IsBoolean() isFeatured?: boolean; // is_featured

  @IsOptional() @IsNumber() viewCount?: number; // view_count

  @IsOptional() @IsUUID() createdById?: string; // created_by

  @IsOptional() @IsBoolean() isDeleted?: boolean; // is_deleted
}
