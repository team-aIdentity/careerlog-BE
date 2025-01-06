import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendKeyword } from './entity/recommendKeyword.entity';
import { CreateRecommendKeywordDto } from './dto/createRecommendKeyword.dto';
import { UpdateRecommendKeywordDto } from './dto/updateRecommendKeyword.dto';

@Injectable()
export class RecommendKeywordService {
  constructor(
    @InjectRepository(RecommendKeyword)
    private recommendKeywordRepository: Repository<RecommendKeyword>,
  ) {}

  async create(
    createDto: CreateRecommendKeywordDto,
  ): Promise<RecommendKeyword> {
    const keyword = this.recommendKeywordRepository.create({
      ...createDto,
    });
    return await this.recommendKeywordRepository.save(keyword);
  }

  async findAll(): Promise<RecommendKeyword[]> {
    return await this.recommendKeywordRepository.find();
  }

  async findOne(id: number): Promise<RecommendKeyword> {
    const keyword = await this.recommendKeywordRepository.findOne({
      where: { id },
    });
    if (!keyword) {
      throw new NotFoundException('Keyword not found');
    }
    return keyword;
  }

  async update(
    id: number,
    updateDto: UpdateRecommendKeywordDto,
  ): Promise<RecommendKeyword> {
    const keyword = await this.findOne(id);
    Object.assign(keyword, updateDto);
    return await this.recommendKeywordRepository.save(keyword);
  }

  async delete(id: number): Promise<void> {
    const keyword = await this.findOne(id);
    await this.recommendKeywordRepository.remove(keyword);
  }
}
