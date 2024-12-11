import { IsOptional, IsString } from 'class-validator';

export class UpdateJobChangeStageDto {
  @IsString()
  @IsOptional()
  name: string;
}
