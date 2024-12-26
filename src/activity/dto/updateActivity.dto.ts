import { IsString, IsOptional } from 'class-validator';

export class UpdateActivityDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subTitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startAt?: string;

  @IsString()
  @IsOptional()
  endAt?: string;
}
