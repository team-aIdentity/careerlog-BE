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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('uploads')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseGuards(JwtAccessAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully.' })
  async saveImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return await this.uploadsService.imageUpload(file);
  }

  @Post('file')
  @UseGuards(JwtAccessAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File uploaded successfully.' })
  async savePdf(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return await this.uploadsService.fileUpload(file);
  }
}
