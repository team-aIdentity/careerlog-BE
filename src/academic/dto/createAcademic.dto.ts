import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateAcademicDto {
  @IsNotEmpty()
  kind: string;

  @IsBoolean()
  @IsOptional()
  isGraduated: boolean;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  major: string;

  @IsNotEmpty()
  startAt: string;

  @IsOptional()
  endAt: string;
}
