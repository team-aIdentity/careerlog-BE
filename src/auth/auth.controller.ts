/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entity/user.entity';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { JwtAccessAuthGuard } from './jwt/jwtAccessAuth.guard';
import { JwtRefreshGuard } from './jwt/jwtRefresh.guard';
import { KakaoAuthGuard } from './kakao/kakaoAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.authService.validateCredentialUser(loginDto);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      loginDto.isMobile,
    );

    await this.userService.setUserOAuth(
      user.id,
      loginDto.deviceId,
      refreshToken,
      loginDto.isMobile,
      'credential',
    );

    const cookieOptions = { httpOnly: true, path: '/' };

    if (loginDto.isPermanant) {
      if (loginDto.isMobile)
        cookieOptions['maxAge'] = 3 * 28 * 24 * 60 * 60 * 1000;
      else cookieOptions['maxAge'] = 14 * 24 * 60 * 60 * 1000;
    }

    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('deviceId', loginDto.deviceId, cookieOptions);
    return {
      message: 'login success',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @Get('authenticate')
  @UseGuards(JwtAccessAuthGuard)
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: number = req.user.id;
    const verifiedUser: User = await this.userService.findOne(userId);
    return res.send(verifiedUser);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
        .accessToken;
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
      });
      res.send({ newAccessToken });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id, req.user.deviceId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.send({
      message: 'logout success',
    });
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = this.authService.signUp(registerDto);
    return user;
  }

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin1(@Req() req: Request) {
    // 이 부분은 Passport의 AuthGuard에 의해 카카오 로그인 페이지로 리다이렉트
  }

  @Get('callback/kakao')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(301)
  async kakaoLogin(@Req() req: any, @Res() res: Response) {
    const user = await this.authService.validateKakaoUser(req.user);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      true,
    );

    await this.userService.setUserOAuth(
      user.id,
      'kakao',
      refreshToken,
      true,
      'kakao',
      user.providerUserId,
    );

    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });
    res.cookie('deviceId', 'kakao', {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });

    return res.send({
      message: 'login success',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
