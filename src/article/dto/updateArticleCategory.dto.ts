import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleCategoryDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  name: string;
}
