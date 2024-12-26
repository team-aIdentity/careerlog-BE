import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './entity/certification.entity';
import { CreateCertificationDto } from './dto/createCertification.dto';
import { UpdateCertificationDto } from './dto/updateCertification.dto';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private certificationRepository: Repository<Certification>,
  ) {}

  async findAll(userId: number): Promise<Certification[]> {
    return await this.certificationRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Certification> {
    const certification = await this.certificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!certification) {
      throw new NotFoundException('Certification not found');
    }
    return certification;
  }

  async create(
    createCertificationDto: CreateCertificationDto,
    userId: number,
  ): Promise<Certification> {
    const certification = this.certificationRepository.create({
      ...createCertificationDto,
      user: { id: userId },
    });
    return await this.certificationRepository.save(certification);
  }

  async update(
    id: number,
    updateCertificationDto: UpdateCertificationDto,
    userId: number,
  ): Promise<Certification> {
    const certification = await this.findOne(id, userId);
    Object.assign(certification, updateCertificationDto);
    return await this.certificationRepository.save(certification);
  }

  async delete(id: number, userId: number): Promise<any> {
    const certification = await this.findOne(id, userId);
    await this.certificationRepository.remove(certification);
    return { message: 'Certification deleted successfully', certification };
  }
}
