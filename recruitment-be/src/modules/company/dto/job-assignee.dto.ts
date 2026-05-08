import { IsUUID } from 'class-validator';

export class JobAssigneeDto {
  @IsUUID()
  userId!: string;
}
