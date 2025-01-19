import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateResumeProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isNameInclude: boolean;

  @IsString()
  job: string;

  @IsBoolean()
  isJobInclude: boolean;

  @IsEmail()
  email: string;

  @IsBoolean()
  isEmailInclude: boolean;

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  isPhoneNumberInclude: boolean;

  @IsString()
  address: string;

  @IsBoolean()
  isAddressInclude: boolean;

  @IsString()
  @IsOptional()
  coreAbility?: string;

  @IsBoolean()
  @IsOptional()
  isCoreAbilityInclude?: boolean;
}
