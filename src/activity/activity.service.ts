import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entity/activity.entity';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async findAll(userId: number, take: number, page: number) {
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'user.profile'],
      take,
      skip: (page - 1) * take,
    });

    return {
      data: activities,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    return activity;
  }

  async create(
    createActivityDto: CreateActivityDto,
    userId: number,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      user: { id: userId },
    });
    return await this.activityRepository.save(activity);
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
    userId: number,
  ): Promise<Activity> {
    const activity = await this.findOne(id, userId);
    Object.assign(activity, updateActivityDto);
    return await this.activityRepository.save(activity);
  }

  async delete(id: number, userId: number): Promise<any> {
    const activity = await this.findOne(id, userId);
    await this.activityRepository.remove(activity);
    return { message: 'Activity deleted successfully', activity };
  }
}
