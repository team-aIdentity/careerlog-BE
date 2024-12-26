import { IsString, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subTitle?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  startAt?: string;

  @IsString()
  @IsOptional()
  endAt?: string;
}
