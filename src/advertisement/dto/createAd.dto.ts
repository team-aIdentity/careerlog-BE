import { IsNumber, IsString } from 'class-validator';

export class CreateAdDto {
  @IsString()
  imagePc: string;

  @IsString()
  imageMobile: string;

  @IsNumber()
  adNumber: number;

  @IsString()
  memo: string;

  @IsString()
  link: string;
}
