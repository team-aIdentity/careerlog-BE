import { IsString } from 'class-validator';

export class CreateRecommendKeywordDto {
  @IsString()
  keyword: string;
}
