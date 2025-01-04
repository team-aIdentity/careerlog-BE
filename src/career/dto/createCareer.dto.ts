import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateCareerDto {
  @IsString()
  company: string;

  @IsString()
  color: string;

  @IsString()
  team: string;

  @IsBoolean()
  isCurrent: boolean;

  @IsDateString()
  startAt: string;

  @IsDateString()
  @IsOptional()
  endAt: string;

  @IsInt()
  jobRankId: number;
}
