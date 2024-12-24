import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCareerDto {
  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  team: string;

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
