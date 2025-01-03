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

  async findOneWithUser(skillId: number, userId: number) {
    const skill = await this.skillRepository.findOne({
      where: { id: skillId, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    return skill;
  }

  /*
    method for resume
  */
  async updateVisibility(userId: number, body: any) {
    const skill = await this.findOneWithUser(body.skillId, userId);
    skill.isInclude = body.isInclude;
    await this.skillRepository.save(skill);
    return skill;
  }

  async getAllResume(userId: number) {
    const skills = await this.skillRepository.find({
      where: { user: { id: userId }, isInclude: true },
    });
    return skills;
  }

  /*
    method for share link
  */
  async updateShareLinkVisibility(userId: number, body: any) {
    const skill = await this.findOneWithUser(body.skillId, userId);
    skill.isPublic = body.isPublic;
    await this.skillRepository.save(skill);
    return skill;
  }

  async getAllShareLink(userId: number) {
    const skills = await this.skillRepository.find({
      where: { user: { id: userId }, isPublic: true },
    });
    return skills;
  }

  async findAll(userId: number): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
  }

  async findOne(id: number, userId: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'user.profile'],
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

  async delete(id: number, userId: number): Promise<any> {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
    return { message: 'Skill deleted successfully', skill };
  }
}
