import { IsEmail, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  birth: string;

  @IsString()
  phoneNumber: string;
}
