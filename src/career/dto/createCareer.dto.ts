import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  company: string;

  @IsString()
  color: string;

  @IsString()
  team: string;

  @IsBoolean()
  isCurrent: boolean;

  @IsString()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt: string;

  @IsInt()
  jobRankId: number;
}
