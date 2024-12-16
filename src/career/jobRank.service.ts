import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRank } from './entity/jobRank.entity';
import { CreateJobRankDto } from './dto/createJobRank.dto';
import { UpdateJobRankDto } from './dto/updateJobRank.dto';

@Injectable()
export class JobRankService {
  constructor(
    @InjectRepository(JobRank)
    private jobRankRepository: Repository<JobRank>,
  ) {}

  async findAll() {
    return await this.jobRankRepository.find();
  }

  async findOne(id: number) {
    const jobRank = await this.jobRankRepository.findOne({ where: { id } });
    if (!jobRank) {
      throw new NotFoundException('JobRank not found');
    }
    return jobRank;
  }

  async create(createJobRankDto: CreateJobRankDto) {
    const jobRank = this.jobRankRepository.create(createJobRankDto);
    return await this.jobRankRepository.save(jobRank);
  }

  async update(id: number, updateJobRankDto: UpdateJobRankDto) {
    const jobRank = await this.findOne(id);
    Object.assign(jobRank, updateJobRankDto);
    return await this.jobRankRepository.save(jobRank);
  }

  async delete(id: number) {
    const jobRank = await this.findOne(id);
    return await this.jobRankRepository.remove(jobRank);
  }
}
