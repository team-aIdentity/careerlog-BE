import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/createCareer.dto';
import { UpdateCareerDto } from './dto/updateCareer.dto';

@ApiTags('career')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update career visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { careerId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.careerService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all career resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of career resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.careerService.getAllResume(userId);
  }

  @Put('share-link/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link visibility' })
  @ApiBody({
    description: 'Share link visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { shareLinkId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.careerService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.careerService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all careers' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'List of all careers.' })
  async getAllCareers(
    @Req() req: any,
    @Query('pageSize') take: number,
    @Query('page') page: number,
  ) {
    return await this.careerService.findAll(req.user.id, take, page);
  }

  @Get('check')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Check career' })
  @ApiResponse({ status: 200, description: 'Career check result.' })
  async checkCareer(@Req() req: any) {
    return await this.careerService.checkCareer(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get career by ID' })
  @ApiParam({ name: 'id', description: 'Career ID' })
  @ApiResponse({ status: 200, description: 'Career details.' })
  async getCareerById(@Param('id') careerId: number, @Req() req: any) {
    return await this.careerService.findOne(careerId, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new career' })
  @ApiBody({
    description: 'Career creation payload',
    type: CreateCareerDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Software Engineer',
          company: 'Tech Corp',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          description: 'Developed software solutions.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Career created successfully.' })
  async createCareer(
    @Body() createCareerDto: CreateCareerDto,
    @Req() req: any,
  ) {
    return await this.careerService.create(createCareerDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing career' })
  @ApiParam({ name: 'id', description: 'Career ID' })
  @ApiBody({
    description: 'Career update payload',
    type: UpdateCareerDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2023-01-01',
          endDate: '2024-12-31',
          description: 'Led software development projects.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Career updated successfully.' })
  async updateCareer(
    @Param('id') careerId: number,
    @Body() updateCareerDto: UpdateCareerDto,
    @Req() req: any,
  ) {
    return await this.careerService.update(
      careerId,
      updateCareerDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a career' })
  @ApiParam({ name: 'id', description: 'Career ID' })
  @ApiResponse({ status: 200, description: 'Career deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Delete career failed.' })
  async deleteCareer(@Param('id') careerId: number, @Req() req: any) {
    return await this.careerService.delete(careerId, req.user.id);
  }
}
