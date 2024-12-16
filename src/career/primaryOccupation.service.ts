import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrimaryOccupation } from './entity/primaryOccupation.entity';
import { CreatePrimaryOccupationDto } from './dto/createPrimaryOccupation.dto';
import { UpdatePrimaryOccupationDto } from './dto/updatePrimaryOccupation.dto';

@Injectable()
export class PrimaryOccupationService {
  constructor(
    @InjectRepository(PrimaryOccupation)
    private primaryOccupationRepository: Repository<PrimaryOccupation>,
  ) {}

  async findAll() {
    return await this.primaryOccupationRepository.find();
  }

  async findOne(id: number) {
    const primaryOccupation = await this.primaryOccupationRepository.findOne({
      where: { id },
    });
    if (!primaryOccupation) {
      throw new NotFoundException('PrimaryOccupation not found');
    }
    return primaryOccupation;
  }

  async create(createPrimaryOccupationDto: CreatePrimaryOccupationDto) {
    const primaryOccupation = this.primaryOccupationRepository.create(
      createPrimaryOccupationDto,
    );
    return await this.primaryOccupationRepository.save(primaryOccupation);
  }

  async update(
    id: number,
    updatePrimaryOccupationDto: UpdatePrimaryOccupationDto,
  ) {
    const primaryOccupation = await this.findOne(id);
    Object.assign(primaryOccupation, updatePrimaryOccupationDto);
    return await this.primaryOccupationRepository.save(primaryOccupation);
  }

  async delete(id: number) {
    const primaryOccupation = await this.findOne(id);
    return await this.primaryOccupationRepository.remove(primaryOccupation);
  }
}
