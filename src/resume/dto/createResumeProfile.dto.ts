import { IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class CreateResumeProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isNameInclude?: boolean;

  @IsString()
  @IsOptional()
  job?: string;

  @IsBoolean()
  @IsOptional()
  isJobInclude?: boolean;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isEmailInclude?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isPhoneNumberInclude?: boolean;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isAddressInclude?: boolean;

  @IsString()
  @IsOptional()
  coreAbility?: string;

  @IsBoolean()
  @IsOptional()
  isCoreAbilityInclude?: boolean;
}
