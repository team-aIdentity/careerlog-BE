import { Module } from '@nestjs/common';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Academic } from './entity/academic.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { UserOAuth } from 'src/user/entity/userOAuth.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Academic, User, UserOAuth]),
    UserModule,
  ],
  controllers: [AcademicController],
  providers: [AcademicService, JwtService, UserService],
})
export class AcademicModule {}
