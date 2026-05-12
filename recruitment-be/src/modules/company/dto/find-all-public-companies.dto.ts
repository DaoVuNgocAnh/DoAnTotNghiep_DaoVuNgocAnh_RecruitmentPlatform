import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class FindAllPublicCompaniesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
