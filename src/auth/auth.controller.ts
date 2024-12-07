/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
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
    const acessToken = await this.authService.generateAccessToken(user);
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

    res.setHeader('Authorization', 'Bearer ' + [acessToken, refreshToken]);
    res.cookie('accessToken', acessToken, {
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
    res.cookie('deviceId', loginDto.deviceId, {
      httpOnly: true,
    });
    return {
      message: 'login success',
      acessToken: acessToken,
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
}
