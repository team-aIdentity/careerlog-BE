import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  detailImage: string;

  @IsString()
  category: string;

  @IsString()
  job: string;

  @IsString()
  jobChangeStage: string;
}
