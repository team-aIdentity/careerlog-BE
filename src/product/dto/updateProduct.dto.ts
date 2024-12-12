import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  detailImage: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  productLink: string;

  @IsString()
  @IsOptional()
  productGeneralLink: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  jobChangeStage: string;
}
