import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';

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

  @IsDate()
  @IsOptional()
  startAt?: Date;

  @IsDate()
  @IsOptional()
  endAt?: Date;

  @IsNumber()
  @IsOptional()
  contribution?: number;

  @IsNumber()
  @IsOptional()
  satisfaction?: number;
}
