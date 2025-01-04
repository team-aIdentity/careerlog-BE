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
import { JobChangeStageService } from './job-change-stage.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Response } from 'express';
import { CreateJobChangeStageDto } from './dto/createJobChangeStage.dto';
import { UpdateJobChangeStageDto } from './dto/updateJobChangeStage.dto';

@ApiTags('job-change-stage')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('job-change-stage')
export class JobChangeStageController {
  constructor(private readonly jobChangeStageService: JobChangeStageService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all job change stages' })
  @ApiResponse({ status: 200, description: 'List of all job change stages.' })
  async getAll() {
    return this.jobChangeStageService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new job change stage' })
  @ApiBody({
    description: 'Job change stage creation payload',
    type: CreateJobChangeStageDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          stageName: 'Initial Interview',
          description: 'The first interview stage.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job change stage created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Req() req: any,
    @Body() createJobChangeStageDto: CreateJobChangeStageDto,
  ) {
    return await this.jobChangeStageService.createOne(
      req.user.id,
      createJobChangeStageDto,
    );
  }

  @Put('update/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing job change stage' })
  @ApiParam({ name: 'id', description: 'Job Change Stage ID' })
  @ApiBody({
    description: 'Job change stage update payload',
    type: UpdateJobChangeStageDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          stageName: 'Final Interview',
          description: 'The final interview stage.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job change stage updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Req() req: any,
    @Body() updateJobChangeStageDto: UpdateJobChangeStageDto,
    @Param('id') jobId: number,
  ) {
    return await this.jobChangeStageService.updateOne(
      req.user.id,
      updateJobChangeStageDto,
      jobId,
    );
  }

  @Delete('delete/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a job change stage' })
  @ApiParam({ name: 'id', description: 'Job Change Stage ID' })
  @ApiResponse({
    status: 200,
    description: 'Job change stage deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to delete job change stage.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async delete(
    @Req() req: any,
    @Param('id') jobId: number,
    @Res() res: Response,
  ) {
    const result = await this.jobChangeStageService.deleteOne(
      req.user.id,
      jobId,
    );

    if (!result.affected) {
      return res.send({
        message: 'failed to delete job change stage',
      });
    }

    return res.send({
      message: 'delete job change stage successfully',
    });
  }
}
