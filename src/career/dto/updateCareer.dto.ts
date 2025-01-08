import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isCurrent: boolean;

  @IsString()
  @IsOptional()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt: string;

  @IsInt()
  @IsOptional()
  jobRankId: number;
}
