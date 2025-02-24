import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { share_profile } from './entity/shareProfile.entity';
import { CreateShareProfileDto } from './dto/createShareProfile.dto';
import { UpdateShareProfileDto } from './dto/updateShareProfile.dto';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(share_profile)
    private shareRepository: Repository<share_profile>,
  ) {}

  async create(
    createShareProfileDto: CreateShareProfileDto,
    userId: number,
  ): Promise<share_profile> {
    const shareProfile = this.shareRepository.create({
      ...createShareProfileDto,
      user: { id: userId },
    });
    return await this.shareRepository.save(shareProfile);
  }

  async findAll(): Promise<share_profile[]> {
    return await this.shareRepository.find();
  }

  async findOne(userId: number): Promise<any> {
    const shareProfile = await this.shareRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!shareProfile) {
      throw new NotFoundException('Share profile not found');
    }

    const result = {
      name: shareProfile.isNamePublic ? shareProfile.name : '',
      isNamePublic: shareProfile.isNamePublic,
      job: shareProfile.isJobPublic ? shareProfile.job : '',
      isJobPublic: shareProfile.isJobPublic,
      email: shareProfile.isEmailPublic ? shareProfile.email : '',
      isEmailPublic: shareProfile.isEmailPublic,
      phoneNumber: shareProfile.isPhoneNumberPublic
        ? shareProfile.phoneNumber
        : '',
      isPhoneNumberPublic: shareProfile.isPhoneNumberPublic,
      address: shareProfile.isAddressPublic ? shareProfile.address : '',
      isAddressPublic: shareProfile.isAddressPublic,
      introductionTitle: shareProfile.isIntroductionTitlePublic
        ? shareProfile.introductionTitle
        : '',
      isIntroductionTitlePublic: shareProfile.isIntroductionTitlePublic,
      introductionContent: shareProfile.isIntroductionContentPublic
        ? shareProfile.introductionContent
        : '',
      isIntroductionContentPublic: shareProfile.isIntroductionContentPublic,
    };
    return result;
  }

  async update(
    id: number,
    updateShareProfileDto: UpdateShareProfileDto,
    userId: number,
  ): Promise<share_profile> {
    const shareProfile = await this.findOne(id);
    if (shareProfile.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this share profile',
      );
    }
    Object.assign(shareProfile, updateShareProfileDto);
    return await this.shareRepository.save(shareProfile);
  }

  async delete(id: number, userId: number): Promise<void> {
    const shareProfile = await this.findOne(id);
    if (shareProfile.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this share profile',
      );
    }
    await this.shareRepository.remove(shareProfile);
  }
}
