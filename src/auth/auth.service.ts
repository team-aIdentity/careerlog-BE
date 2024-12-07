import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    let user: User = await this.userService.findOneWithProvider(
      reqUser.provider,
      reqUser.providerUserId,
    );

    if (!user) {
      user = await this.userService.register(
        reqUser.email,
        null,
        reqUser.name,
        reqUser.birthDate,
        reqUser.phone,
      );
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
    const { email, password, name, birthDate, phone, role } = registerDto;
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
}
