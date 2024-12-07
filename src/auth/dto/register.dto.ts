import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  birthDate: string;

  @IsString()
  phone: string;

  @IsString()
  role: string;
}
