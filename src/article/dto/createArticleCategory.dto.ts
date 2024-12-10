import { IsString } from 'class-validator';

export class CreateArticleCategoryDto {
  @IsString()
  type: string;

  @IsString()
  name: string;
}
