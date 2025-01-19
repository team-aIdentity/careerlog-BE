import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateShareProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isNamePublic: boolean;

  @IsString()
  job: string;

  @IsBoolean()
  isJobPublic: boolean;

  @IsEmail()
  email: string;

  @IsBoolean()
  isEmailPublic: boolean;

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  isPhoneNumberPublic: boolean;

  @IsString()
  address: string;

  @IsBoolean()
  isAddressPublic: boolean;

  @IsString()
  @IsOptional()
  introductionTitle?: string;

  @IsBoolean()
  isIntroductionTitlePublic: boolean;

  @IsString()
  @IsOptional()
  introductionContent?: string;

  @IsBoolean()
  isIntroductionContentPublic: boolean;
}
