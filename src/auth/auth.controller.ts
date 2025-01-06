/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
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
import { VerifyCodeRequestDto } from './dto/verifyCodeRequest.dto';
import { ChangePwdDto } from './dto/changePwd.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User login payload',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          email: 'user@example.com',
          password: 'password123',
          isMobile: true,
          deviceId: 'device123',
          isPermanant: true,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: number = req.user.id;
    const verifiedUser: User = await this.userService.findOne(userId);
    return res.send(verifiedUser);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    description: 'Refresh token payload',
    type: RefreshTokenDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          refreshToken: 'your-refresh-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh-token.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id, req.user.deviceId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.send({
      message: 'logout success',
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    description: 'User registration payload',
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = this.authService.signUp(registerDto);
    return user;
  }

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kakao login redirect' })
  @ApiResponse({ status: 301, description: 'Redirect to Kakao login page.' })
  async kakaoLogin1(@Req() req: Request) {
    // This part is handled by Passport's AuthGuard to redirect to Kakao login page
  }

  @Get('callback/kakao')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(301)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kakao login callback' })
  @ApiResponse({ status: 200, description: 'Kakao login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

  @Post('send-phone-verify-code')
  @ApiOperation({ summary: 'Send phone verify code' })
  @ApiResponse({
    status: 200,
    description: 'Phone verify code sent successfully.',
  })
  @ApiBody({
    description: 'Phone verify code request payload',
    type: VerifyCodeRequestDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          phoneNumber: '01012345678',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async sendPhoneVerifyCode(
    @Body() verifyCodeRequestDto: VerifyCodeRequestDto,
  ) {
    return this.authService.sendPhoneVerifyCode(verifyCodeRequestDto);
  }

  @Post('verify-phone-number')
  @ApiOperation({ summary: 'Verify phone number' })
  @ApiBody({
    description: 'Phone number verify payload',
    type: VerifyCodeRequestDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          phoneNumber: '01012345678',
          code: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Phone number verified successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async verifyPhoneNumber(@Body() verifyCodeRequestDto: VerifyCodeRequestDto) {
    return this.authService.verifyPhoneNumber(verifyCodeRequestDto);
  }

  @Put('change-password')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    description: 'Change password payload',
    type: ChangePwdDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          password: 'password123',
          newPassword: 'password456',
          verifyNewPassword: 'password456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async changePassword(@Body() changePwdDto: ChangePwdDto, @Req() req: any) {
    return this.authService.changePassword(changePwdDto, req.user.id);
  }

  @Delete('delete')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteUser(@Req() req: any, @Body() deleteUserDto: DeleteUserDto) {
    return this.authService.deleteUser(deleteUserDto, req.user.id);
  }
}
