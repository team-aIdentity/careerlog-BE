import { IsString, IsUrl, IsDate } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsDate()
  date: Date;
}
