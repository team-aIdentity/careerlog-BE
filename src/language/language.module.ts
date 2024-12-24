import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Language } from './entity/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), UserModule],
  providers: [LanguageService, JwtAccessAuthGuard, JwtService, UserService],
  controllers: [LanguageController],
})
export class LanguageModule {}
