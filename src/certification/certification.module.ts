import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from './entity/certification.entity';
import { UserModule } from 'src/user/user.module';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certification]), UserModule],
  providers: [
    CertificationService,
    JwtAccessAuthGuard,
    JwtService,
    UserService,
  ],
  controllers: [CertificationController],
})
export class CertificationModule {}
