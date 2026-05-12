import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class CompanyPaginationDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
