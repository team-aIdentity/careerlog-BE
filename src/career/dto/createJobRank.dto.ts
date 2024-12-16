import { IsString } from 'class-validator';

export class CreateJobRankDto {
  @IsString()
  name: string;
}
