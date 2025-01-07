import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCultureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
