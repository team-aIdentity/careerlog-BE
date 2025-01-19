import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { resume_profile } from './entity/resumeProfile.entity';
import { UserModule } from 'src/user/user.module';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([resume_profile]), UserModule],
  providers: [ResumeService, JwtAccessAuthGuard, JwtService, UserService],
  controllers: [ResumeController],
})
export class ResumeModule {}
