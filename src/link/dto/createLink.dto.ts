import { IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;
}
