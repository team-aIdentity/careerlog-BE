import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Academic } from './entity/academic.entity';
import { Repository } from 'typeorm';
import { CreateAcademicDto } from './dto/createAcademic.dto';
import { UpdateAcademicDto } from './dto/updateAcademic.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Academic)
    private academicRepository: Repository<Academic>,
  ) {}

  async findAll(userId: number, take: number, page: number) {
    const [academics, total] = await this.academicRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'user.profile'],
      take,
      skip: (page - 1) * take,
    });

    return {
      data: academics,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findOne(academicId: number, userId: number) {
    const academic = await this.academicRepository.findOne({
      where: { id: academicId, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });

    if (!academic) {
      throw new BadRequestException('Academic not found');
    }

    return academic;
  }

  async create(createAcademicDto: CreateAcademicDto, userId: number) {
    const academic = this.academicRepository.create({
      ...createAcademicDto,
      user: { id: userId },
    });

    return await this.academicRepository.save(academic);
  }

  async update(
    academicId: number,
    updateAcademicDto: UpdateAcademicDto,
    userId: number,
  ) {
    const academic = await this.findOne(academicId, userId);

    Object.assign(academic, updateAcademicDto);

    return await this.academicRepository.save(academic);
  }

  async delete(academicId: number, userId: number) {
    const academic = await this.findOne(academicId, userId);
    return await this.academicRepository.remove(academic);
  }
}
