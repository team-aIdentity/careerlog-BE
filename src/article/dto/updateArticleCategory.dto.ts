import { IsOptional, IsString } from 'class-validator';

export class updateArticleCategoryDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  name: string;
}
