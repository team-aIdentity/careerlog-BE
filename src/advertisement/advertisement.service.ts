import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advertisement } from './entity/advertisement.entity';
import { CreateAdDto } from './dto/createAd.dto';
import { UpdateAdDto } from './dto/updateAd.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(Advertisement)
    private advertisementRepository: Repository<Advertisement>,
  ) {}

  async findAll() {
    const ads = await this.advertisementRepository.find();

    const groupedAds = ads.reduce((result, category) => {
      const { adNumber, ...data } = category;
      if (!result[adNumber]) {
        result[adNumber] = [];
      }
      result[adNumber].push(data);
      return result;
    }, {});

    return groupedAds;
  }

  async findOne(adId: number) {
    const ad = await this.advertisementRepository.findOne({
      where: { id: adId },
    });
    if (!ad) throw new BadRequestException('no ad found');
    return ad;
  }

  async create(createAdDto: CreateAdDto) {
    const ad = this.advertisementRepository.create({
      ...createAdDto,
    });
    await this.advertisementRepository.save(ad);
    return ad;
  }

  async update(adId: number, updateAdDto: UpdateAdDto) {
    const ad = await this.findOne(adId);

    const updateFields: Partial<Advertisement> = {
      ...(updateAdDto.imagePc && { imagePc: updateAdDto.imagePc }),
      ...(updateAdDto.imageMobile && { imageMobile: updateAdDto.imageMobile }),
      ...(updateAdDto.adNumber && { adNumber: updateAdDto.adNumber }),
      ...(updateAdDto.memo && { memo: updateAdDto.memo }),
      ...(updateAdDto.link && { link: updateAdDto.link }),
    };

    Object.assign(ad, updateFields);

    await this.advertisementRepository.save(ad);
    return ad;
  }

  async deleteAd(adId: number) {
    return await this.advertisementRepository.delete(adId);
  }
}
