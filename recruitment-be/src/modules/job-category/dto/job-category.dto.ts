import { IsNotEmpty, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export class JobCategoryDto {
  @IsOptional() @IsUUID() id?: string;

  @IsNotEmpty({ message: 'Tên ngành nghề không được để trống' })
  @IsString()
  categoryName!: string; 

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsBoolean()
  isDeleted?: boolean; 
}