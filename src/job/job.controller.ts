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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Response } from 'express';
import { CreateJobDto } from './dto/createJob.dto';
import { UpdateJobDto } from './dto/updateJob.dto';

@ApiTags('job')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'List of all jobs.' })
  async getAll() {
    return this.jobService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({
    description: 'Job creation payload',
    type: CreateJobDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Software Developer',
          description: 'Develops software solutions.',
          location: 'Remote',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Job created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Req() req: any, @Body() createJobDto: CreateJobDto) {
    return await this.jobService.createOne(req.user.id, createJobDto);
  }

  @Put('update/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiBody({
    description: 'Job update payload',
    type: UpdateJobDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Senior Software Developer',
          description: 'Leads software development projects.',
          location: 'On-site',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Job updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Req() req: any,
    @Body() updateJobDto: UpdateJobDto,
    @Param('id') jobId: number,
  ) {
    return await this.jobService.updateOne(req.user.id, updateJobDto, jobId);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to delete job.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async delete(
    @Req() req: any,
    @Param('id') jobId: number,
    @Res() res: Response,
  ) {
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
