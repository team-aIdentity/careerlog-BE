import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    const awsRegion = this.configService.get('AWS_REGION');
    console.log(awsRegion);
    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
  }

  async imageUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type.');
    }

    const ext = file.originalname.split('.').pop();
    const imageName = `image-${uuidv4()}.${ext}`;
    const imageUrl = await this.imageUploadToS3(imageName, file, file.mimetype);

    return { imageUrl };
  }

  private async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    mimeType: string,
  ) {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: mimeType,
    });

    try {
      await this.s3Client.send(command);

      return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload image to S3: ${error.message}`);
    }
  }

  async fileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    const allowedMimeTypes = {
      'application/pdf': 'pdf',
      'application/haansoft-hwp': 'hwp',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
    };

    const fileExtension = allowedMimeTypes[file.mimetype];
    if (!fileExtension) {
      throw new BadRequestException('Unsupported file type.');
    }

    const fileName = `${uuidv4()}.${fileExtension}`;
    const fileUrl = await this.uploadToS3(fileName, file, file.mimetype);

    return { fileUrl };
  }

  private async uploadToS3(
    fileName: string,
    file: Express.Multer.File,
    mimeType: string,
  ) {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: mimeType,
    });

    try {
      await this.s3Client.send(command);

      return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
