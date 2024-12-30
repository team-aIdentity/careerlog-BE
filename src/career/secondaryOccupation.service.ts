import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecondaryOccupation } from './entity/secondaryOccupation.entity';
import { CreateSecondaryOccupationDto } from './dto/createSecondaryOccupation.dto';
import { UpdateSecondaryOccupationDto } from './dto/updateSecondaryOccupation.dto';
import { Job } from 'src/job/entity/job.entity';

@Injectable()
export class SecondaryOccupationService {
  constructor(
    @InjectRepository(SecondaryOccupation)
    private secondaryOccupationRepository: Repository<SecondaryOccupation>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll() {
    return await this.secondaryOccupationRepository.find({
      relations: ['primaryOccupation'],
    });
  }

  async findWithPrimaryOccupation(id: number) {
    return await this.secondaryOccupationRepository.find({
      where: { primaryOccupation: { id } },
    });
  }

  async findOne(id: number) {
    const secondaryOccupation =
      await this.secondaryOccupationRepository.findOne({
        where: { id },
        relations: ['primaryOccupation'],
      });
    if (!secondaryOccupation) {
      throw new NotFoundException('SecondaryOccupation not found');
    }
    return secondaryOccupation;
  }

  async create(createSecondaryOccupationDto: CreateSecondaryOccupationDto) {
    const primaryOccupation = await this.jobRepository.findOne({
      where: { id: createSecondaryOccupationDto.primaryOccupationId },
    });
    if (!primaryOccupation) {
      throw new NotFoundException('PrimaryOccupation not found');
    }
    const secondaryOccupation = this.secondaryOccupationRepository.create({
      ...createSecondaryOccupationDto,
      primaryOccupation,
    });
    return await this.secondaryOccupationRepository.save(secondaryOccupation);
  }

  async update(
    id: number,
    updateSecondaryOccupationDto: UpdateSecondaryOccupationDto,
  ) {
    const secondaryOccupation = await this.findOne(id);
    if (updateSecondaryOccupationDto.primaryOccupationId) {
      const primaryOccupation = await this.jobRepository.findOne({
        where: { id: updateSecondaryOccupationDto.primaryOccupationId },
      });
      if (!primaryOccupation) {
        throw new NotFoundException('PrimaryOccupation not found');
      }
      secondaryOccupation.primaryOccupation = primaryOccupation;
    }
    Object.assign(secondaryOccupation, updateSecondaryOccupationDto);
    return await this.secondaryOccupationRepository.save(secondaryOccupation);
  }

  async delete(id: number) {
    const secondaryOccupation = await this.findOne(id);
    return await this.secondaryOccupationRepository.remove(secondaryOccupation);
  }
}
