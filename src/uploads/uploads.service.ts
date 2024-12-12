import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uuid } from 'uuidv4';

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
    const imageName = `image-${uuid()}`;
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(command);

    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }
}
