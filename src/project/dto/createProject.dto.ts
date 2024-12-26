import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

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

  @IsString()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt?: string;

  @IsNumber()
  contribution: number;

  @IsNumber()
  satisfaction: number;
}
