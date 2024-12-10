import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Response } from 'express';
import { CreateJobDto } from './dto/createJob.dto';
import { UpdateJobDto } from './dto/updateJob.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('all')
  async getAll() {
    return this.jobService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Req() req: any, @Body() createJobDto: CreateJobDto) {
    return await this.jobService.createOne(req.user.id, createJobDto);
  }

  @Put('update/:id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Req() req: any,
    @Body() updateJobDto: UpdateJobDto,
    @Param('id') jobId,
  ) {
    return await this.jobService.updateOne(req.user.id, updateJobDto, jobId);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Req() req: any, @Param('id') jobId, @Res() res: Response) {
    const result = await this.jobService.deleteOne(req.user.id, jobId);

    if (!result.affected) {
      return res.send({
        message: 'failed to delete job',
      });
    }

    return res.send({
      message: 'delete job successfully',
    });
  }
}
