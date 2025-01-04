import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAcademicDto {
  @IsNotEmpty()
  kind: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  major: string;

  @IsNotEmpty()
  startAt: string;

  @IsOptional()
  endAt: string;
}
