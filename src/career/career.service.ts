import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entity/career.entity';
import { CreateCareerDto } from './dto/createCareer.dto';
import { UpdateCareerDto } from './dto/updateCareer.dto';
import { SecondaryOccupation } from './entity/secondaryOccupation.entity';
import { JobRank } from './entity/jobRank.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(SecondaryOccupation)
    private occupationRepository: Repository<SecondaryOccupation>,
    @InjectRepository(JobRank)
    private jobRankRepository: Repository<JobRank>,
  ) {}

  async findAll(userId: number, take: number, page: number) {
    const [careers, total] = await this.careerRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
      relations: ['occupation', 'jobRank'],
    });

    return {
      data: careers,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findOne(careerId: number, userId: number) {
    const career = await this.careerRepository.findOne({
      where: { id: careerId, user: { id: userId } },
      relations: ['occupation', 'jobRank'],
    });

    if (!career) {
      throw new BadRequestException('Career not found');
    }

    return career;
  }

  async create(createCareerDto: CreateCareerDto, userId: number) {
    const occupation = await this.occupationRepository.findOne({
      where: { id: createCareerDto.occupationId },
    });
    const jobRank = await this.jobRankRepository.findOne({
      where: { id: createCareerDto.jobRankId },
    });

    if (!occupation || !jobRank) {
      throw new BadRequestException('Invalid occupation or job rank');
    }

    const career = this.careerRepository.create({
      ...createCareerDto,
      occupation,
      jobRank,
      user: { id: userId },
    });

    return await this.careerRepository.save(career);
  }

  async update(
    careerId: number,
    updateCareerDto: UpdateCareerDto,
    userId: number,
  ) {
    const career = await this.findOne(careerId, userId);

    if (updateCareerDto.occupationId) {
      const occupation = await this.occupationRepository.findOne({
        where: { id: updateCareerDto.occupationId },
      });
      if (!occupation) {
        throw new BadRequestException('Invalid occupation');
      }
      career.occupation = occupation;
    }

    if (updateCareerDto.jobRankId) {
      const jobRank = await this.jobRankRepository.findOne({
        where: { id: updateCareerDto.jobRankId },
      });
      if (!jobRank) {
        throw new BadRequestException('Invalid job rank');
      }
      career.jobRank = jobRank;
    }

    Object.assign(career, updateCareerDto);

    return await this.careerRepository.save(career);
  }

  async delete(careerId: number, userId: number) {
    const career = await this.findOne(careerId, userId);
    return await this.careerRepository.remove(career);
  }
}
