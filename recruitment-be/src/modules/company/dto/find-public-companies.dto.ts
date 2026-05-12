import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class FindPublicCompaniesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
