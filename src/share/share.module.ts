import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { share_profile } from './entity/shareProfile.entity';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([share_profile]), UserModule],
  providers: [ShareService, JwtAccessAuthGuard, JwtService, UserService],
  controllers: [ShareController],
})
export class ShareModule {}
