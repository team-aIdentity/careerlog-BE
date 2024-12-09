import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  detailImage: string;
}
