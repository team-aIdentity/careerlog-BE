import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateAcademicDto {
  @IsOptional()
  kind: string;

  @IsBoolean()
  @IsOptional()
  isGraduated: boolean;

  @IsOptional()
  name: string;

  @IsOptional()
  major: string;

  @IsOptional()
  startAt: string;

  @IsOptional()
  endAt: string;
}
