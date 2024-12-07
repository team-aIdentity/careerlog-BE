import { IsBoolean, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  deviceId: string;

  @IsBoolean()
  isMobile: boolean;
}
