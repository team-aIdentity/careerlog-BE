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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { CreateJobRankDto } from './dto/createJobRank.dto';
import { UpdateJobRankDto } from './dto/updateJobRank.dto';
import { JobRankService } from './jobRank.service';
import { UserService } from 'src/user/user.service';

@ApiTags('job-rank')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('job-rank')
export class JobRankController {
  constructor(
    private readonly jobRankService: JobRankService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all job ranks' })
  @ApiResponse({ status: 200, description: 'List of all job ranks.' })
  async getAllJobRanks() {
    return await this.jobRankService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job rank by ID' })
  @ApiParam({ name: 'id', description: 'Job Rank ID' })
  @ApiResponse({ status: 200, description: 'Job rank details.' })
  async getJobRankById(@Param('id') jobRankId: number) {
    return await this.jobRankService.findOne(jobRankId);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new job rank' })
  @ApiBody({
    description: 'Job rank creation payload',
    type: CreateJobRankDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Senior Developer',
          description: 'Responsible for leading development teams.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Job rank created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Update an existing job rank' })
  @ApiParam({ name: 'id', description: 'Job Rank ID' })
  @ApiBody({
    description: 'Job rank update payload',
    type: UpdateJobRankDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Lead Developer',
          description: 'Oversees all development projects.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Job rank updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateJobRank(
    @Req() req: any,
    @Param('id') jobRankId: number,
    @Body() updateJobRankDto: UpdateJobRankDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update job rank',
      );
    }
    return await this.jobRankService.update(jobRankId, updateJobRankDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a job rank' })
  @ApiParam({ name: 'id', description: 'Job Rank ID' })
  @ApiResponse({ status: 200, description: 'Job rank deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
