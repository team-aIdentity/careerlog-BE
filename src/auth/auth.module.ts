import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtRefreshStrategy } from './jwt/jwtRefresh.strategy';
import { JwtAccessAuthGuard } from './jwt/jwtAccessAuth.guard';
import { JwtRefreshGuard } from './jwt/jwtRefresh.guard';
import { KakaoAuthGuard } from './kakao/kakaoAuth.guard';
import { KakaoStrategy } from './kakao/kakao.strategy';
import { JwtAccessAuthGuard2 } from './jwt/jwtAccessAuth2.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    JwtRefreshStrategy,
    JwtAccessAuthGuard,
    JwtRefreshGuard,
    KakaoAuthGuard,
    KakaoStrategy,
    JwtAccessAuthGuard2,
  ],
  controllers: [AuthController],
  exports: [UserService, AuthService],
})
export class AuthModule {}
