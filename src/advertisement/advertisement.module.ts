import { Module } from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertisement } from './entity/advertisement.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Advertisement]),
    UserModule,
  ],
  providers: [AdvertisementService, UserService, JwtService],
  controllers: [AdvertisementController],
  exports: [AdvertisementModule],
})
export class AdvertisementModule {}
