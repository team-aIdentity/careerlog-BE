import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entity/career.entity';
import { CreateCareerDto } from './dto/createCareer.dto';
import { UpdateCareerDto } from './dto/updateCareer.dto';
import { JobRank } from './entity/jobRank.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(JobRank)
    private jobRankRepository: Repository<JobRank>,
  ) {}

  async findOneWithUser(careerId: number, userId: number) {
    const career = await this.careerRepository.findOne({
      where: { id: careerId, user: { id: userId } },
      relations: ['jobRank', 'user'],
    });
    return career;
  }

  async updateVisibility(userId: number, body: any) {
    const career = await this.findOneWithUser(body.careerId, userId);
    if (!career) {
      throw new BadRequestException('Career not found');
    }
    career.isInclude = body.isInclude;
    await this.careerRepository.save(career);
    return career;
  }

  async getAllResume(userId: number) {
    const careers = await this.careerRepository.find({
      where: { user: { id: userId }, isInclude: true },
      relations: ['jobRank'],
    });
    return careers;
  }

  async updateShareLinkVisibility(userId: number, body: any) {
    const career = await this.findOneWithUser(body.careerId, userId);
    if (!career) {
      throw new BadRequestException('Career not found');
    }
    career.isPublic = body.isPublic;
    await this.careerRepository.save(career);
    return career;
  }

  async getAllShareLink(userId: number) {
    const careers = await this.careerRepository.find({
      where: { user: { id: userId }, isPublic: true },
      relations: ['jobRank'],
    });
    return careers;
  }

  async findAll(userId: number, take: number, page: number) {
    const [careers, total] = await this.careerRepository.findAndCount({
      where: { user: { id: userId } },
      order: { startAt: 'DESC' },
      take,
      skip: (page - 1) * take,
      relations: ['jobRank'],
    });

    let totalCareerYears = 0;
    let totalCareerMonths = 0;

    if (total != 0) {
      const oldestCareer = careers[careers.length - 1];
      const newestCareer = careers[0];
      const endAt = newestCareer.endAt
        ? new Date(newestCareer.endAt)
        : new Date();
      const startAt = new Date(oldestCareer.startAt);
      const totalYears = endAt.getFullYear() - startAt.getFullYear();
      const totalMonths =
        endAt.getMonth() - startAt.getMonth() + totalYears * 12;
      totalCareerYears = Math.floor(totalMonths / 12);
      totalCareerMonths = totalMonths % 12;
    }

    return {
      data: careers,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        totalCareerYears,
        totalCareerMonths,
      },
    };
  }

  async findOne(careerId: number, userId: number) {
    const career = await this.careerRepository.findOne({
      where: { id: careerId, user: { id: userId } },
      relations: ['jobRank', 'user'],
    });

    if (!career) {
      throw new BadRequestException('Career not found');
    }

    return career;
  }

  async create(createCareerDto: CreateCareerDto, userId: number) {
    const jobRank = await this.jobRankRepository.findOne({
      where: { id: createCareerDto.jobRankId },
    });
    if (!jobRank) {
      throw new BadRequestException('Job rank not found');
    }

    const career = this.careerRepository.create({
      ...createCareerDto,
      user: { id: userId },
      jobRank,
    });

    console.log(career);

    return await this.careerRepository.save(career);
  }

  async update(
    careerId: number,
    updateCareerDto: UpdateCareerDto,
    userId: number,
  ) {
    const career = await this.findOne(careerId, userId);

    const jobRank = await this.jobRankRepository.findOne({
      where: { id: updateCareerDto.jobRankId },
    });

    if (!jobRank) {
      throw new BadRequestException('Job rank not found');
    }

    career.jobRank = jobRank;

    Object.assign(career, updateCareerDto);

    return await this.careerRepository.save(career);
  }

  async delete(careerId: number, userId: number) {
    const career = await this.findOne(careerId, userId);
    return await this.careerRepository.remove(career);
  }

  async checkCareer(userId: number) {
    const careerCount = await this.careerRepository.count({
      where: { user: { id: userId } },
    });

    return {
      code: careerCount > 0 ? 1 : 0,
      message: careerCount > 0 ? 'Career exists' : 'Career not exists',
    };
  }
}
