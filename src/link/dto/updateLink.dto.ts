import { IsString, IsUrl, IsDate, IsOptional } from 'class-validator';

export class UpdateLinkDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsDate()
  @IsOptional()
  date?: Date;
}
