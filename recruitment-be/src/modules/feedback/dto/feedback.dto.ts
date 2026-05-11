import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsIn(['BUG', 'SUGGESTION', 'QUESTION', 'OTHER'])
  type!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pageUrl?: string;
}

export class FeedbackQueryDto {
  @IsOptional()
  @IsIn(['NEW', 'REVIEWING', 'RESOLVED'])
  status?: string;

  @IsOptional()
  @IsIn(['BUG', 'SUGGESTION', 'QUESTION', 'OTHER'])
  type?: string;
}

export class UpdateFeedbackStatusDto {
  @IsIn(['NEW', 'REVIEWING', 'RESOLVED'])
  status!: string;
}
