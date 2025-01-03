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

  async findOneWithUser(linkId: number, userId: number) {
    const link = await this.linkRepository.findOne({
      where: { id: linkId, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    return link;
  }

  /*
    method for resume
  */
  async updateVisibility(userId: number, body: any) {
    const link = await this.findOneWithUser(body.linkId, userId);
    link.isInclude = body.isInclude;
    await this.linkRepository.save(link);
    return link;
  }

  async getAllResume(userId: number) {
    const links = await this.linkRepository.find({
      where: { user: { id: userId }, isInclude: true },
    });
    return links;
  }

  /*
    method for share link
  */
  async updateShareLinkVisibility(userId: number, body: any) {
    const link = await this.findOneWithUser(body.linkId, userId);
    link.isPublic = body.isPublic;
    await this.linkRepository.save(link);
    return link;
  }

  async getAllShareLink(userId: number) {
    const links = await this.linkRepository.find({
      where: { user: { id: userId }, isPublic: true },
    });
    return links;
  }

  async findAll(userId: number): Promise<Link[]> {
    return await this.linkRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
  }

  async findOne(id: number, userId: number): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'user.profile'],
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

  async delete(id: number, userId: number): Promise<any> {
    const link = await this.findOne(id, userId);
    await this.linkRepository.remove(link);
    return { message: 'Link deleted successfully', link };
  }
}
