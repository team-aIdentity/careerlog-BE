import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCareerDto {
  @IsString()
  @IsOptional()
  company: string;

  @IsDateString()
  @IsOptional()
  startAt: string;

  @IsDateString()
  @IsOptional()
  endAt: string;

  @IsInt()
  @IsOptional()
  totalYear: number;

  @IsInt()
  @IsOptional()
  occupationId: number;

  @IsInt()
  @IsOptional()
  jobRankId: number;
}
