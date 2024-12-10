import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  careerGoal?: string;

  @IsOptional()
  @IsString()
  expectSalary?: string;

  @IsOptional()
  @IsBoolean()
  isNeedOffer?: boolean;

  @IsOptional()
  @IsBoolean()
  isShareLink?: boolean;
}
