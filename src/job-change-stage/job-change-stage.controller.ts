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
import { JobChangeStageService } from './job-change-stage.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Response } from 'express';
import { CreateJobChangeStageDto } from './dto/createJobChangeStage.dto';
import { UpdateJobChangeStageDto } from './dto/updateJobChangeStage.dto';

@Controller('job-change-stage')
export class JobChangeStageController {
  constructor(private readonly jobChangeStageService: JobChangeStageService) {}

  @Get('all')
  async getAll() {
    return this.jobChangeStageService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
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
  async update(
    @Req() req: any,
    @Body() updateJobChangeStageDto: UpdateJobChangeStageDto,
    @Param('id') jobId,
  ) {
    return await this.jobChangeStageService.updateOne(
      req.user.id,
      updateJobChangeStageDto,
      jobId,
    );
  }

  @Delete('delete/:id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Req() req: any, @Param('id') jobId, @Res() res: Response) {
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
