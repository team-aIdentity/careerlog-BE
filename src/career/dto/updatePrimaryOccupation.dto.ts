import { IsOptional, IsString } from 'class-validator';

export class UpdatePrimaryOccupationDto {
  @IsString()
  @IsOptional()
  name: string;
}
