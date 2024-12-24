import { IsString } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  language: string;

  @IsString()
  level: string;
}
