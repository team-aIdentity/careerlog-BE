import { IsOptional, IsString } from 'class-validator';

export class UpdateJobRankDto {
  @IsString()
  @IsOptional()
  name: string;
}
