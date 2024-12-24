import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entity/link.entity';
import { CreateLinkDto } from './dto/createLink.dto';
import { UpdateLinkDto } from './dto/updateLink.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async findAll(userId: number): Promise<Link[]> {
    return await this.linkRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }

  async create(createLinkDto: CreateLinkDto, userId: number): Promise<Link> {
    const link = this.linkRepository.create({
      ...createLinkDto,
      user: { id: userId },
    });
    return await this.linkRepository.save(link);
  }

  async update(
    id: number,
    updateLinkDto: UpdateLinkDto,
    userId: number,
  ): Promise<Link> {
    const link = await this.findOne(id, userId);
    Object.assign(link, updateLinkDto);
    return await this.linkRepository.save(link);
  }

  async delete(id: number, userId: number): Promise<void> {
    const link = await this.findOne(id, userId);
    await this.linkRepository.remove(link);
  }
}
