import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class JoinRequestDto {
  @IsOptional() @IsUUID()
  id?: string;

  @IsUUID()
  userId!: string;

  @IsUUID()
  companyId!: string;

  @IsOptional() @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional() @IsString()
  message?: string;
}