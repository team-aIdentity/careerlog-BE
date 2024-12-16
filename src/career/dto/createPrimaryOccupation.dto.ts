import { IsString } from 'class-validator';

export class CreatePrimaryOccupationDto {
  @IsString()
  name: string;
}
