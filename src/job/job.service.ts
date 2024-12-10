import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateJobDto } from './dto/createJob.dto';
import { UpdateJobDto } from './dto/updateJob.dto';

@Injectable()
export class JobService {
  constructor(
    private userService: UserService,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll() {
    return await this.jobRepository.find();
  }

  async findOne(jobName: string) {
    return await this.jobRepository.findOne({ where: { name: jobName } });
  }

  async createOne(userId: number, createJobDto: CreateJobDto) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    const newJob = this.jobRepository.create({
      name: createJobDto.name,
    });
    this.jobRepository.save(newJob);
    return newJob;
  }

  async updateOne(userId: number, updateJobDto: UpdateJobDto, jobId: number) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    const job = await this.jobRepository.findOne({ where: { id: jobId } });

    if (updateJobDto.name) job.name = updateJobDto.name;

    await this.jobRepository.save(job);
    return job;
  }

  async deleteOne(userId: number, jobId: number) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not admin');

    return this.jobRepository.delete({ id: jobId });
  }
}
