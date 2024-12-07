import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserOAuth } from './entity/userOAuth.entity';
import { Role } from './entity/role.entity';
import { UserRole } from './entity/userRole.entity';
import { OAuthProvider } from './entity/oAuthProvider.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserOAuth)
    private userOAuthRepository: Repository<UserOAuth>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(OAuthProvider)
    private oAuthProvider: Repository<OAuthProvider>,
  ) {}

  // user feature

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }

  // method for jwt authectication

  async setUserOAuth(
    userId: number,
    deviceId: string,
    refreshToken: string,
    isMobile: boolean,
    provider: string,
  ) {
    const currentRefreshToken =
      await this.getCurrentHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp =
      await this.getCurrentHashedRefreshTokenExp(isMobile);

    const existingSession = await this.userOAuthRepository.findOne({
      where: { user: { id: userId }, provider: { name: provider }, deviceId },
    });

    if (existingSession) {
      existingSession.refreshToken = currentRefreshToken;
      existingSession.refreshTokenExp = currentRefreshTokenExp;
      await this.userOAuthRepository.save(existingSession);
    } else {
      const existingProvider = await this.getExistingProvider(provider);
      await this.userOAuthRepository.save({
        user: { id: userId },
        provider: existingProvider,
        deviceId,
        refreshToken: currentRefreshToken,
        refreshTokenExp: currentRefreshTokenExp,
      });
    }
  }

  async getExistingProvider(name: string): Promise<OAuthProvider> {
    const existingProvider = await this.oAuthProvider.findOne({
      where: { name },
    });

    if (!existingProvider) {
      throw new Error('Provider not found');
    }

    return existingProvider;
  }

  async getCurrentHashedRefreshToken(refreshToken: string): Promise<string> {
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentHashedRefreshTokenExp(isMobile: boolean): Promise<Date> {
    const currentDate = new Date();

    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(
          this.configService.get<string>(
            isMobile
              ? 'JWT_MOBILE_REFRESH_EXPIRATION_TIME'
              : 'JWT_WEB_REFRESH_EXPIRATION_TIME',
          ),
          10,
        ) *
          1000,
    );
    return currentRefreshTokenExp;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
    deviceId: string,
  ): Promise<User> {
    const userOAuth: UserOAuth = await this.userOAuthRepository.findOne({
      where: {
        user: { id: userId },
        deviceId,
      },
    });

    if (!userOAuth.refreshToken) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      userOAuth.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return this.findOne(userId);
    }
  }

  async removeRefreshToken(userId: number, deviceId: string): Promise<any> {
    const userSession = await this.userOAuthRepository.findOne({
      where: { user: { id: userId }, deviceId },
    });

    userSession.refreshToken = null;
    userSession.refreshTokenExp = null;
    return await this.userOAuthRepository.save(userSession);
  }

  async register(
    email: string,
    password: string,
    name: string,
    birthDate: string,
    phone: string,
  ): Promise<User> {
    const createdUser = await this.userRepository.create({
      email,
      password,
      name,
      birthDate,
      phone,
    });
    await this.userRepository.save(createdUser);
    return createdUser;
  }

  async assignRole(userId: number, roleName: string) {
    const role: Role = await this.roleRepository.findOneBy({ name: roleName });
    await this.userRoleRepository.save({
      user: { id: userId },
      role: role,
    });
  }
}
