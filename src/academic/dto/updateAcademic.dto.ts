import { IsOptional } from 'class-validator';

export class UpdateAcademicDto {
  @IsOptional()
  kind: string;

  @IsOptional()
  status: string;

  @IsOptional()
  name: string;

  @IsOptional()
  major: string;

  @IsOptional()
  startAt: string;

  @IsOptional()
  endAt: string;
}
