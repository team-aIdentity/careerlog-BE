/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeRequestDto } from './dto/verifyCodeRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneVerify } from './entity/phoneVerify.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { ChangePwdDto } from './dto/changePwd.dto';
import { ForgetPasswordDto } from './dto/forgetPwd.dto';
import { ResetPasswordDto } from './dto/resetPwd.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @InjectRepository(PhoneVerify)
    private readonly phoneVerifyRepository: Repository<PhoneVerify>,
  ) {}

  // credential jwt logic

  /**
   * Step 1. validate login Info
   * @param email
   * @param password
   * @returns Promise<User>
   */
  async validateCredentialUser(loginDto: LoginDto): Promise<User> {
    const user: User = await this.userService.findOneByEmail(
      loginDto.email,
      true,
    );
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const isMatch: boolean = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  async validateKakaoUser(reqUser: any): Promise<any> {
    let user: User = await this.userService.findOneByEmail(reqUser.email);

    if (!user) {
      user = await this.userService.register(
        reqUser.email,
        null,
        reqUser.name,
        reqUser.birthDate,
        reqUser.phone,
        reqUser.isMarketing,
      );
      await this.userService.assignRole(user.id, 'user');
    }

    return { ...user, providerUserId: reqUser.providerUserId };
  }

  // common logic for authetication

  /**
   * Step2. generate AccessToken
   * @param user
   * @returns Promise<string>
   */
  async generateAccessToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email, name: user.profile.name };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  /**
   * Step3. generate RefreshToken
   * @param user
   * @param isMobile
   * @returns Promise<string>
   */
  async generateRefreshToken(user: User, isMobile: boolean): Promise<string> {
    const payload = { id: user.id, email: user.email, name: user.profile.name };
    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          isMobile
            ? 'JWT_MOBILE_REFRESH_EXPIRATION_TIME'
            : 'JWT_WEB_REFRESH_EXPIRATION_TIME',
        ),
      },
    );
  }

  /**
   * Step for refresh accessToken with refreshToken
   * @param refreshTokenDto
   * @returns
   */
  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, deviceId } = refreshTokenDto;

    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const userId = decodedRefreshToken.id;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
      deviceId,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid user!');
    }

    const accessToken = await this.generateAccessToken(user);

    return { accessToken };
  }

  /**
   * signUp method
   * @param registerDto
   * @returns
   */
  async signUp(registerDto: RegisterDto): Promise<User> {
    const { email, password, name, birthDate, phone, role, isMarketing } =
      registerDto;
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User Already Exists');
    }

    const hashedPwd = await this.generateHasedPwd(password);
    const user = await this.userService.register(
      email,
      hashedPwd,
      name,
      birthDate,
      phone,
      isMarketing,
    );
    await this.userService.assignRole(user.id, role);
    const roleAssingedUser = await this.userService.findOne(user.id);

    return roleAssingedUser;
  }

  /**
   * generate hashed password
   * @param password
   * @returns
   */
  async generateHasedPwd(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPwd = await bcrypt.hash(password, saltOrRounds);
    return hashedPwd;
  }

  async generatePhoneVerifyCode(): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  async sendPhoneVerifyCode(
    verifyCodeRequestDto: VerifyCodeRequestDto,
  ): Promise<{ verifyCode: string }> {
    const appKey = this.configService.get<string>('KAKAO_ALIMTALK_APP_KEY');
    const secretKey = this.configService.get<string>(
      'KAKAO_ALIMTALK_SECRET_KEY',
    );
    const senderKey = this.configService.get<string>(
      'KAKAO_ALIMTALK_SENDER_KEY',
    );

    const verifyCode = await this.generatePhoneVerifyCode();
    const phoneNumber = verifyCodeRequestDto.phoneNumber;
    const user = await this.userService.findOneByPhone(phoneNumber);
    if (user) {
      throw new BadRequestException('Phone number already exists');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requestCount = await this.phoneVerifyRepository.count({
      where: {
        phoneNumber,
        createdAt: MoreThanOrEqual(today),
      },
    });

    if (requestCount >= 5) {
      throw new BadRequestException('Request limit exceeded for today');
    }

    const phoneVerify = await this.phoneVerifyRepository.create({
      phoneNumber,
      verifyCode,
      expiredAt: new Date(Date.now() + 1000 * 60 * 5),
      isVerified: false,
    });
    await this.phoneVerifyRepository.save(phoneVerify);

    // send verify code to phone number
    try {
      const response = await fetch(
        `https://api-alimtalk.cloud.toast.com/alimtalk/v2.3/appkeys/${appKey}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Secret-Key': secretKey,
          },
          body: JSON.stringify({
            senderKey: senderKey,
            templateCode: 'phone_verify1',
            recipientList: [
              {
                recipientNo: phoneNumber,
                templateParameter: {
                  code: verifyCode,
                },
              },
            ],
          }),
        },
      );
      const json = await response.json();
      if (json.header.isSuccessful === false) {
        throw new InternalServerErrorException('Failed to send verify code');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send verify code');
    }

    return { verifyCode };
  }

  /**
   * verify phone number
   * @param verifyCodeRequestDto
   * @returns
   */
  async verifyPhoneNumber(
    verifyCodeRequestDto: VerifyCodeRequestDto,
  ): Promise<boolean> {
    const phoneVerification = await this.phoneVerifyRepository
      .createQueryBuilder('pv')
      .where('pv.phoneNumber = :phoneNumber', {
        phoneNumber: verifyCodeRequestDto.phoneNumber,
      })
      .andWhere('pv.verifyCode = :verifyCode', {
        verifyCode: verifyCodeRequestDto.code,
      })
      .andWhere('pv.isVerified = false')
      .andWhere('pv.expiredAt > :now', { now: new Date() })
      .orderBy('pv.createdAt', 'DESC')
      .getOne();

    console.log(phoneVerification);

    if (!phoneVerification) {
      throw new BadRequestException('Invalid verify code');
    }

    phoneVerification.isVerified = true;
    await this.phoneVerifyRepository.save(phoneVerification);

    return true;
  }

  /**
   * change password
   * @param changePwdDto
   * @param userId
   * @returns
   */
  async changePassword(
    changePwdDto: ChangePwdDto,
    userId: number,
  ): Promise<User> {
    const { password, newPassword, verifyNewPassword } = changePwdDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userWithPwd = await this.userService.findOneByEmail(user.email, true);

    const isMatch = await bcrypt.compare(password, userWithPwd.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    const isMatchNewPassword = newPassword === verifyNewPassword;
    if (!isMatchNewPassword) {
      throw new BadRequestException('New password does not match');
    }

    const hashedNewPassword = await this.generateHasedPwd(newPassword);

    return await this.userService.updatePassword(userId, hashedNewPassword);
  }

  /**
   * delete user
   * @param deleteUserDto
   * @param userId
   * @returns
   */
  async deleteUser(
    deleteUserDto: DeleteUserDto,
    userId: number,
  ): Promise<User> {
    const { password } = deleteUserDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userWithPwd = await this.userService.findOneByEmail(user.email, true);

    const isMatch = await bcrypt.compare(password, userWithPwd.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return await this.userService.delete(userId);
  }

  /**
   * forget password
   * @param forgetPasswordDto
   * @returns
   */
  async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ code: string; token: string }> {
    const { email, name, birth, phoneNumber } = forgetPasswordDto;
    const appKey = this.configService.get<string>('KAKAO_ALIMTALK_APP_KEY');
    const secretKey = this.configService.get<string>(
      'KAKAO_ALIMTALK_SECRET_KEY',
    );
    const senderKey = this.configService.get<string>(
      'KAKAO_ALIMTALK_SENDER_KEY',
    );
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch =
      user.profile.name === name &&
      user.profile.birthDate === birth &&
      user.profile.phone === phoneNumber;
    if (!isMatch) {
      throw new BadRequestException('Invalid user information');
    }

    const code = await this.generatePhoneVerifyCode();

    const phoneVerify = await this.phoneVerifyRepository.create({
      phoneNumber,
      verifyCode: code,
      expiredAt: new Date(Date.now() + 1000 * 60 * 5),
      isVerified: false,
    });
    await this.phoneVerifyRepository.save(phoneVerify);

    // send verify code to phone number
    try {
      const response = await fetch(
        `https://api-alimtalk.cloud.toast.com/alimtalk/v2.3/appkeys/${appKey}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Secret-Key': secretKey,
          },
          body: JSON.stringify({
            senderKey: senderKey,
            templateCode: 'phone_verify1',
            recipientList: [
              {
                recipientNo: phoneNumber,
                templateParameter: {
                  code: code,
                },
              },
            ],
          }),
        },
      );
      const json = await response.json();
      if (json.header.isSuccessful === false) {
        throw new InternalServerErrorException('Failed to send verify code');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send verify code');
    }

    return { code, token: await this.generateOneTimeToken(user) };
  }

  async generateOneTimeToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email, name: user.profile.name };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '10m',
    });
  }

  /**
   * reset password
   * @param resetPasswordDto
   * @returns
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const { token, password, confirmPassword } = resetPasswordDto;

    const decodedToken = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    const user = await this.userService.findOne(decodedToken.id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = password === confirmPassword;
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    const hashedPassword = await this.generateHasedPwd(password);
    await this.userService.updatePassword(user.id, hashedPassword);

    return true;
  }
}
