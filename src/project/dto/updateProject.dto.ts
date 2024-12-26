import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startAt?: string;

  @IsString()
  @IsOptional()
  endAt?: string;

  @IsNumber()
  @IsOptional()
  contribution?: number;

  @IsNumber()
  @IsOptional()
  satisfaction?: number;
}
