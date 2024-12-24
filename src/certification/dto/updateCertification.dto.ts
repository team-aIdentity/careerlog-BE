import { IsString, IsOptional } from 'class-validator';

export class UpdateCertificationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  jurisdiction?: string;
}
