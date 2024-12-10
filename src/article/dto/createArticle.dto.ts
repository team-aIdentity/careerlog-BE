import { IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsString()
  category: string;

  @IsString()
  job: string;
}
