import { IsString, IsOptional, IsDate } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subTitle?: string;

  @IsString()
  description: string;

  @IsDate()
  @IsOptional()
  startAt?: Date;

  @IsDate()
  @IsOptional()
  endAt?: Date;
}
