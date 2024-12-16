import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  company: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  @IsOptional()
  endAt: string;

  @IsInt()
  @IsOptional()
  totalYear: number;

  @IsInt()
  occupationId: number;

  @IsInt()
  jobRankId: number;
}
