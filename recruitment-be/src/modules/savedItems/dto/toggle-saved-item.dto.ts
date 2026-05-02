import { IsEnum, IsUUID } from 'class-validator';
import { TargetType } from '@prisma/client';

export class ToggleSavedItemDto {
  @IsUUID()
  targetId: string;

  @IsEnum(TargetType)
  targetType: TargetType;
}
