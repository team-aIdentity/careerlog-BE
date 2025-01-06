import { IsString, IsOptional } from 'class-validator';

export class UpdateRecommendKeywordDto {
  @IsString()
  @IsOptional()
  keyword?: string;
}
