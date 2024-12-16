import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSecondaryOccupationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @IsOptional()
  primaryOccupationId: number;
}
