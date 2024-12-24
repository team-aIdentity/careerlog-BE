import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entity/language.entity';
import { CreateLanguageDto } from './dto/createLanguage.dto';
import { UpdateLanguageDto } from './dto/updateLanguage.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async findAll(userId: number): Promise<Language[]> {
    return await this.languageRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }

  async create(
    createLanguageDto: CreateLanguageDto,
    userId: number,
  ): Promise<Language> {
    const language = this.languageRepository.create({
      ...createLanguageDto,
      user: { id: userId },
    });
    return await this.languageRepository.save(language);
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
    userId: number,
  ): Promise<Language> {
    const language = await this.findOne(id, userId);
    Object.assign(language, updateLanguageDto);
    return await this.languageRepository.save(language);
  }

  async delete(id: number, userId: number): Promise<void> {
    const language = await this.findOne(id, userId);
    await this.languageRepository.remove(language);
  }
}
