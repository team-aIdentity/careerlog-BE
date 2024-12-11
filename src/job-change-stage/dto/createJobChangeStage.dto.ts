import { IsString } from 'class-validator';

export class CreateJobChangeStageDto {
  @IsString()
  name: string;
}
