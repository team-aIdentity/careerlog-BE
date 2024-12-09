import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserOAuth } from './entity/userOAuth.entity';
import { Role } from './entity/role.entity';
import { UserRole } from './entity/userRole.entity';
import { OAuthProvider } from './entity/oAuthProvider.entity';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { Profile } from './entity/profile.entity';

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
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  // user feature

  async findAll(take: number, page: number): Promise<any> {
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['profile', 'roles', 'roles.role'],
    });

    return {
      data: users,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findOneByEmail(
    email: string,
    needPwd: boolean = false,
  ): Promise<User | null> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', { email });

    if (needPwd) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();

    return user || null;
  }

  async findOneWithProvider(
    provider: string,
    providerUserId: string,
  ): Promise<User> {
    const userOAuth = await this.userOAuthRepository.findOne({
      where: { provider: { name: provider }, providerUserId },
      relations: ['user'],
    });

    if (!userOAuth) {
      return null;
    }

    return this.findOne(userOAuth.user.id);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const profile: Profile = await this.profileRepository.findOne({
      where: {
        user: { id: userId },
      },
    });
    if (!profile) {
      throw new BadRequestException(
        `Profile with user id ${userId} doesn't exist`,
      );
    }

    if (updateProfileDto.name !== undefined)
      profile.name = updateProfileDto.name;
    if (updateProfileDto.image !== undefined)
      profile.image = updateProfileDto.image;
    if (updateProfileDto.phone !== undefined)
      profile.phone = updateProfileDto.phone;
    if (updateProfileDto.birthDate !== undefined)
      profile.birthDate = updateProfileDto.birthDate;
    if (updateProfileDto.careerGoal !== undefined)
      profile.careerGoal = updateProfileDto.careerGoal;
    if (updateProfileDto.expectSalary !== undefined)
      profile.expectSalary = updateProfileDto.expectSalary;

    await this.profileRepository.save(profile);
    return profile;
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
    providerUserId?: string,
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
        providerUserId,
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
      profile: {
        name,
        birthDate,
        phone,
      },
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

  async isAdmin(userId: number) {
    const userOAuth: UserRole[] = await this.userRoleRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['role'],
    });

    let isAdmin: boolean = false;
    userOAuth.forEach((item) => {
      if (item.role.name == 'admin') isAdmin = true;
    });

    return isAdmin;
  }
}
