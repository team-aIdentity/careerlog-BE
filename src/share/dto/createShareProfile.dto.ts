import { IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class CreateShareProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isNamePublic?: boolean;

  @IsString()
  @IsOptional()
  job?: string;

  @IsBoolean()
  @IsOptional()
  isJobPublic?: boolean;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isEmailPublic?: boolean;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isPhoneNumberPublic?: boolean;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isAddressPublic?: boolean;

  @IsString()
  @IsOptional()
  introductionTitle?: string;

  @IsBoolean()
  @IsOptional()
  isIntroductionTitlePublic?: boolean;

  @IsString()
  @IsOptional()
  introductionContent?: string;

  @IsBoolean()
  @IsOptional()
  isIntroductionContentPublic?: boolean;
}
