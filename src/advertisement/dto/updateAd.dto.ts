import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdDto {
  @IsString()
  @IsOptional()
  imagePc: string;

  @IsString()
  @IsOptional()
  imageMobile: string;

  @IsNumber()
  @IsOptional()
  adNumber: number;

  @IsString()
  @IsOptional()
  memo: string;

  @IsString()
  @IsOptional()
  link: string;
}
