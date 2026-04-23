import { IsNotEmpty, IsString, IsOptional, IsUrl, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { CompanyStatus } from '@prisma/client';

export class CompanyDto {
  @IsOptional() @IsUUID()
  id?: string;

  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name!: string;

  @IsNotEmpty({ message: 'Mã số thuế không được để trống' })
  taxCode!: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description!: string;

  @IsOptional() @IsUrl()
  websiteUrl?: string;

  @IsOptional() @IsString()
  logoUrl?: string;

  @IsOptional() @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsOptional() @IsBoolean()
  isPremium?: boolean;

  @IsOptional() @IsUUID()
  ownerId?: string;
}