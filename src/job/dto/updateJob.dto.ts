import { IsOptional, IsString } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  name: string;
}
