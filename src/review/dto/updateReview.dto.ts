import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @IsOptional()
  rate?: number;

  @IsString()
  @IsOptional()
  review?: string;
}
