import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CompanyStatus } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class GetCompaniesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;
}

export class AdminCompanyQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
