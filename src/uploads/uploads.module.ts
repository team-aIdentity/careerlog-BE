import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule, UserModule],
  providers: [UploadsService, JwtService, UserService],
  controllers: [UploadsController],
})
export class UploadsModule {}
