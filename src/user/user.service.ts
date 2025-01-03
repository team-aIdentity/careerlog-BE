import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Career } from 'src/career/entity/career.entity';
import { Culture } from './entity/culture.entity';
import { CreateCultureDto } from './dto/createCulture.dto';
import { UpdateCultureDto } from './dto/updateCulture.dto';
import { SecondaryOccupation } from 'src/career/entity/secondaryOccupation.entity';

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
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(Culture)
    private cultureRepository: Repository<Culture>,
    @InjectRepository(SecondaryOccupation)
    private secondaryOccupationRepository: Repository<SecondaryOccupation>,
  ) {}

  async findOneWithProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'profile.job'],
    });
  }

  // methods for resume

  async updateResumeNameVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isNameInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumeJobVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isJobInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumeEmailVisibility(userId: number, body: any) {
    const user = await this.findOne(userId);
    user.isEmailInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumePhoneVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isPhoneInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumeAddressVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isAddressInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumeCoreAbility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.coreAbility = body.coreAbility;
    await this.userRepository.save(user);
    return user;
  }

  async updateResumeCoreAbilityVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isCoreAbilityInclude = body.isInclude;
    await this.userRepository.save(user);
    return user;
  }

  async getResume(userId: number) {
    const user = await this.findOneWithProfile(userId);

    const responseDto = {
      name: user.profile.isNameInclude ? user.profile.name : null,
      job: user.profile.isJobInclude ? user.profile.job.name : null,
      email: user.isEmailInclude ? user.email : null,
      phone: user.profile.isPhoneInclude ? user.profile.phone : null,
      address: user.profile.isAddressInclude ? user.profile.address : null,
      coreAbility: user.profile.isCoreAbilityInclude
        ? user.profile.coreAbility
        : null,
    };

    return responseDto;
  }

  // methods for share link

  async updateShareLinkNameVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isNamePublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkJobVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isJobPublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkEmailVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.isEmailPublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkPhoneVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isPhonePublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkAddressVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isAddressPublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLink(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isShareLink = body.isShareLink;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkIntroduction(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.introductionTitle = body.title;
    user.profile.introductionContent = body.content;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkIntroductionTitleVisibility(userId: number, body: any) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isIntroductionTitlePublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async updateShareLinkIntroductionContentVisibility(
    userId: number,
    body: any,
  ) {
    const user = await this.findOneWithProfile(userId);
    user.profile.isIntroductionContentPublic = body.isPublic;
    await this.userRepository.save(user);
    return user;
  }

  async getShareLink(userId: number) {
    const user = await this.findOneWithProfile(userId);
    const responseDto = {
      name: user.profile.isNamePublic ? user.profile.name : null,
      job: user.profile.isJobPublic ? user.profile.job.name : null,
      email: user.isEmailPublic ? user.email : null,
      phone: user.profile.isPhonePublic ? user.profile.phone : null,
      address: user.profile.isAddressPublic ? user.profile.address : null,
      introductionTitle: user.profile.isIntroductionTitlePublic
        ? user.profile.introductionTitle
        : null,
      introductionContent: user.profile.isIntroductionContentPublic
        ? user.profile.introductionContent
        : null,
    };
    return user.profile.isShareLink
      ? responseDto
      : {
          message: '공유링크가 비공개로 설정되어 있습니다.',
          code: 404,
        };
  }

  // user feature

  async findAll(take: number, page: number): Promise<any> {
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: [
        'profile',
        'userRoles',
        'userRoles.role',
        'providers',
        'providers.provider',
        'products',
        'articles',
        'savedArticles',
        'savedProducts',
        'careers',
        'academics',
      ],
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
      relations: [
        'profile',
        'userRoles',
        'userRoles.role',
        'providers',
        'providers.provider',
        'products',
        'articles',
        'savedArticles',
        'savedProducts',
        'careers',
        'academics',
      ],
    });
  }

  async findOneByEmail(
    email: string,
    needPwd: boolean = false,
  ): Promise<User | null> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .leftJoinAndSelect('user.providers', 'providers')
      .leftJoinAndSelect('providers.provider', 'provider')
      .leftJoinAndSelect('user.careers', 'careers')
      .leftJoinAndSelect('user.academics', 'academics')
      .leftJoinAndSelect('user.articles', 'articles')
      .leftJoinAndSelect('user.savedArticles', 'savedArticles')
      .leftJoinAndSelect('user.products', 'products')
      .leftJoinAndSelect('user.savedProducts', 'savedProducts')
      .where('user.email = :email', { email });

    if (needPwd) {
      query.addSelect('user.password');
    }

    try {
      const user = await query.getOne();
      return user || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Could not fetch user by email');
    }
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
    if (updateProfileDto.description !== undefined)
      profile.description = updateProfileDto.description;
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
    if (updateProfileDto.isShareLink !== undefined)
      profile.isShareLink = updateProfileDto.isShareLink || false;
    if (updateProfileDto.isNeedOffer !== undefined)
      profile.isNeedOffer = updateProfileDto.isNeedOffer || false;
    if (updateProfileDto.address !== undefined)
      profile.address = updateProfileDto.address;
    if (updateProfileDto.job !== undefined) {
      const secondaryOccupation =
        await this.secondaryOccupationRepository.findOne({
          where: { id: updateProfileDto.job },
        });
      profile.job = secondaryOccupation;
    }

    if (updateProfileDto.expectedOrganizationCulture !== undefined) {
      const expectedOrganizationCulture = await this.cultureRepository.findOne({
        where: { id: updateProfileDto.expectedOrganizationCulture },
      });
      profile.expectCulture = expectedOrganizationCulture;
    }

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
    const userOAuth = await this.userOAuthRepository
      .createQueryBuilder('userOAuth')
      .addSelect('userOAuth.refreshToken') // refreshToken 명시적으로 포함
      .leftJoin('userOAuth.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('userOAuth.deviceId = :deviceId', { deviceId })
      .getOne();

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
    isMarketing: boolean,
  ): Promise<User> {
    const createdUser = await this.userRepository.create({
      email,
      password,
      isMarketing,
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

  async updateLastActiveDate(user: any) {
    const existingUser: User = await this.findOne(user.id);
    existingUser.lastActiveDate = new Date();
    this.userRepository.save(existingUser);
    return existingUser;
  }

  async getProfile(userId: number): Promise<any> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['expectCulture', 'job'],
    });
    const user = await this.findOne(userId);

    const secondaryOccupation =
      await this.secondaryOccupationRepository.findOne({
        where: { profiles: { user: { id: userId } } },
        relations: ['profiles', 'primaryOccupation'],
      });

    const responseDto = {
      image: profile.image,
      name: profile.name,
      email: user.email,
      phone: profile.phone,
      address: profile.address,
      primaryOccupationId: secondaryOccupation?.primaryOccupation?.id,
      primaryOccupation: secondaryOccupation?.primaryOccupation?.name,
      secondaryOccupationId: secondaryOccupation?.id,
      secondaryOccupation: secondaryOccupation?.name,
      expectedSalary: profile.expectSalary,
      expectedOrganizationCultureId: profile.expectCulture?.id,
      expectedOrganizationCultureImage: '',
      expectedOrganizationCultureTitle: profile.expectCulture?.name,
      expectedOrganizationCultureDescription:
        profile.expectCulture?.description,
      careerGoal: profile.careerGoal,
      isNeedOffer: profile.isNeedOffer,
    };

    const isCompleteProfile = [
      responseDto.name,
      responseDto.email,
      responseDto.phone,
      responseDto.address,
      responseDto.expectedSalary,
      responseDto.careerGoal,
      responseDto.primaryOccupationId,
      responseDto.secondaryOccupationId,
    ].every((value) => value !== undefined && value !== null);

    return {
      code: isCompleteProfile ? 1 : 0,
      data: responseDto,
    };
  }

  async findAllCultures(): Promise<Culture[]> {
    return await this.cultureRepository.find();
  }

  async findCultureById(id: number): Promise<Culture> {
    const culture = await this.cultureRepository.findOne({ where: { id } });
    if (!culture) {
      throw new NotFoundException('Culture not found');
    }
    return culture;
  }

  async createCulture(createCultureDto: CreateCultureDto): Promise<Culture> {
    const culture = this.cultureRepository.create(createCultureDto);
    return await this.cultureRepository.save(culture);
  }

  async updateCulture(
    id: number,
    updateCultureDto: UpdateCultureDto,
  ): Promise<Culture> {
    const culture = await this.findCultureById(id);
    Object.assign(culture, updateCultureDto);
    return await this.cultureRepository.save(culture);
  }

  async deleteCulture(id: number): Promise<any> {
    const culture = await this.findCultureById(id);
    await this.cultureRepository.remove(culture);
    return { message: 'Culture deleted successfully', culture };
  }
}
