import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resume_profile } from './entity/resumeProfile.entity';
import { CreateResumeProfileDto } from './dto/createResumeProfile.dto';
import { UpdateResumeProfileDto } from './dto/updateResumeProfile.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(resume_profile)
    private resumeRepository: Repository<resume_profile>,
  ) {}

  async create(
    createResumeProfileDto: CreateResumeProfileDto,
    userId: number,
  ): Promise<resume_profile> {
    const resumeProfile = this.resumeRepository.create({
      ...createResumeProfileDto,
      user: { id: userId },
    });
    return await this.resumeRepository.save(resumeProfile);
  }

  async findOne(userId: number): Promise<any> {
    const resumeProfile = await this.resumeRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!resumeProfile) {
      throw new NotFoundException('Resume profile not found');
    }

    const result = {
      name: resumeProfile.isNameInclude ? resumeProfile.name : '',
      isNameInclude: resumeProfile.isNameInclude,
      job: resumeProfile.isJobInclude ? resumeProfile.job : '',
      isJobInclude: resumeProfile.isJobInclude,
      email: resumeProfile.isEmailInclude ? resumeProfile.email : '',
      isEmailInclude: resumeProfile.isEmailInclude,
      phoneNumber: resumeProfile.isPhoneNumberInclude
        ? resumeProfile.phoneNumber
        : '',
      isPhoneNumberInclude: resumeProfile.isPhoneNumberInclude,
      address: resumeProfile.isAddressInclude ? resumeProfile.address : '',
      isAddressInclude: resumeProfile.isPhoneNumberInclude,
      coreAbility: resumeProfile.isCoreAbilityInclude
        ? resumeProfile.coreAbility
        : '',
      isCoreAbilityInclude: resumeProfile.isCoreAbilityInclude,
    };
    return result;
  }

  async update(
    id: number,
    updateResumeProfileDto: UpdateResumeProfileDto,
    userId: number,
  ): Promise<resume_profile> {
    const resumeProfile = await this.findOne(id);
    if (resumeProfile.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this resume',
      );
    }
    Object.assign(resumeProfile, updateResumeProfileDto);
    return await this.resumeRepository.save(resumeProfile);
  }
}
