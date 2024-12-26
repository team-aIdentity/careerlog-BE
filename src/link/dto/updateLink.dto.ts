import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateLinkDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  url?: string;
}
