import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entity/skill.entity';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async findAll(userId: number): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async create(createSkillDto: CreateSkillDto, userId: number): Promise<Skill> {
    const skill = this.skillRepository.create({
      ...createSkillDto,
      user: { id: userId },
    });
    return await this.skillRepository.save(skill);
  }

  async update(
    id: number,
    updateSkillDto: UpdateSkillDto,
    userId: number,
  ): Promise<Skill> {
    const skill = await this.findOne(id, userId);
    Object.assign(skill, updateSkillDto);
    return await this.skillRepository.save(skill);
  }

  async delete(id: number, userId: number): Promise<void> {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
  }
}
