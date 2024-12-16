import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecondaryOccupation } from './entity/secondaryOccupation.entity';
import { CreateSecondaryOccupationDto } from './dto/createSecondaryOccupation.dto';
import { UpdateSecondaryOccupationDto } from './dto/updateSecondaryOccupation.dto';
import { PrimaryOccupation } from './entity/primaryOccupation.entity';

@Injectable()
export class SecondaryOccupationService {
  constructor(
    @InjectRepository(SecondaryOccupation)
    private secondaryOccupationRepository: Repository<SecondaryOccupation>,
    @InjectRepository(PrimaryOccupation)
    private primaryOccupationRepository: Repository<PrimaryOccupation>,
  ) {}

  async findAll() {
    return await this.secondaryOccupationRepository.find({
      relations: ['primaryOccupation'],
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
    const primaryOccupation = await this.primaryOccupationRepository.findOne({
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
      const primaryOccupation = await this.primaryOccupationRepository.findOne({
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
