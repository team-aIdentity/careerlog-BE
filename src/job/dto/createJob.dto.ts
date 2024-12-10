import { IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  name: string;
}
