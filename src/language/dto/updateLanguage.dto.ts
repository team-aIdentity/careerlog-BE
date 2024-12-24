import { IsString, IsOptional } from 'class-validator';

export class UpdateLanguageDto {
  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  level?: string;
}
