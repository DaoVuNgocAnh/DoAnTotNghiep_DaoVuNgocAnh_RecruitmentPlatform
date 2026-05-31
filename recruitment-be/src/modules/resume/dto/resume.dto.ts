import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Tên gợi nhớ cho CV không được để trống' })
  @IsString()
  resumeName!: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  parsedJobTitle?: string;

  @IsOptional()
  @IsString()
  parsedSkills?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @IsString()
  draftData?: string;

  @IsOptional()
  @IsString()
  id?: string;
}
