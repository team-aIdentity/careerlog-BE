import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  description: string;

  @IsDate()
  startAt: Date;

  @IsDate()
  @IsOptional()
  endAt?: Date;

  @IsNumber()
  contribution: number;

  @IsNumber()
  satisfaction: number;
}
