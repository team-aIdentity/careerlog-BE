import {
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseGuards(JwtAccessAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async saveImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return await this.uploadsService.imageUpload(file);
  }

  @Post('file')
  @UseGuards(JwtAccessAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async savePdf(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return await this.uploadsService.fileUpload(file);
  }
}
