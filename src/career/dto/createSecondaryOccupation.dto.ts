import { IsInt, IsString } from 'class-validator';

export class CreateSecondaryOccupationDto {
  @IsString()
  name: string;

  @IsInt()
  primaryOccupationId: number;
}
