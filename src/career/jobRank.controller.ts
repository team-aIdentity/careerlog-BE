import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { CreateJobRankDto } from './dto/createJobRank.dto';
import { UpdateJobRankDto } from './dto/updateJobRank.dto';
import { JobRankService } from './jobRank.service';
import { UserService } from 'src/user/user.service';

@Controller('job-rank')
export class JobRankController {
  constructor(
    private readonly jobRankService: JobRankService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllJobRanks() {
    return await this.jobRankService.findAll();
  }

  @Get(':id')
  async getJobRankById(@Param('id') jobRankId: number) {
    return await this.jobRankService.findOne(jobRankId);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async createJobRank(
    @Req() req: any,
    @Body() createJobRankDto: CreateJobRankDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create job rank',
      );
    }
    return await this.jobRankService.create(createJobRankDto);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async updateJobRank(
    @Req() req: any,
    @Param('id') jobRankId: number,
    @Body() updateJobRankDto: UpdateJobRankDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create job rank',
      );
    }
    return await this.jobRankService.update(jobRankId, updateJobRankDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteJobRank(@Req() req: any, @Param('id') jobRankId: number) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete job rank',
      );
    }
    return await this.jobRankService.delete(jobRankId);
  }
}
