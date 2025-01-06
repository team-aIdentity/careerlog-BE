import { IsNotEmpty } from 'class-validator';

export class ChangePwdDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  verifyNewPassword: string;
}
