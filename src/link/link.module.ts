import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entity/link.entity';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), UserModule],
  providers: [LinkService, UserService, JwtAccessAuthGuard, JwtService],
  controllers: [LinkController],
})
export class LinkModule {}
