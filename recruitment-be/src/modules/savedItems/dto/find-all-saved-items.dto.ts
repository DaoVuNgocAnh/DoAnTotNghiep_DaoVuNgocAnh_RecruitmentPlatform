import { IsEnum, IsOptional } from 'class-validator';
import { TargetType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class FindAllSavedItemsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(TargetType)
  type?: TargetType;
}
