import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePremiumRequestDto {
  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @IsOptional()
  @IsString()
  note?: string;
}
