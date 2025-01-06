import { IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyCodeRequestDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  code?: string;
}
