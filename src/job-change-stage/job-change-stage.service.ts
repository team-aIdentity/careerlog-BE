import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JobChangeStage } from './entity/jobChangeStage.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJobChangeStageDto } from './dto/createJobChangeStage.dto';
import { UpdateJobChangeStageDto } from './dto/updateJobChangeStage.dto';

@Injectable()
export class JobChangeStageService {
  constructor(
    private userService: UserService,

    @InjectRepository(JobChangeStage)
    private jobChangeStageRepository: Repository<JobChangeStage>,
  ) {}

  async findAll() {
    return await this.jobChangeStageRepository.find();
  }

  async findOne(jobName: string) {
    return await this.jobChangeStageRepository.findOne({
      where: { name: jobName },
    });
  }

  async createOne(
    userId: number,
    createJobChangeStageDto: CreateJobChangeStageDto,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    const newJob = this.jobChangeStageRepository.create({
      name: createJobChangeStageDto.name,
    });
    this.jobChangeStageRepository.save(newJob);
    return newJob;
  }

  async updateOne(
    userId: number,
    updateJobChangeStageDto: UpdateJobChangeStageDto,
    jobId: number,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    const job = await this.jobChangeStageRepository.findOne({
      where: { id: jobId },
    });

    if (updateJobChangeStageDto.name) job.name = updateJobChangeStageDto.name;

    await this.jobChangeStageRepository.save(job);
    return job;
  }

  async deleteOne(userId: number, jobId: number) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    return this.jobChangeStageRepository.delete({ id: jobId });
  }
}
