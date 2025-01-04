import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
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
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('activity')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /* 
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update activity visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { activityId: 1, isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.activityService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all activity resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of activity resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.activityService.getAllResume(userId);
  }

  /* 
    method for share link
  */
  @Put('share-link/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link visibility' })
  @ApiBody({
    description: 'Share link visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { activityId: 1, isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.activityService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.activityService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all activities for the authenticated user' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiResponse({ status: 200, description: 'List of activities.' })
  async findAll(
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Req() req: any,
  ) {
    return await this.activityService.findAll(req.user.id, pageSize, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get a specific activity by ID' })
  @ApiParam({ name: 'id', description: 'Activity ID' })
  @ApiResponse({ status: 200, description: 'Activity details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.activityService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiBody({
    description: 'Activity creation payload',
    type: CreateActivityDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Example Activity',
          description: 'This is an example activity description.',
          startAt: '2023-01-01',
          endAt: '2023-12-31',
          isPublic: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Activity created successfully.' })
  async create(@Body() createActivityDto: CreateActivityDto, @Req() req: any) {
    return await this.activityService.create(createActivityDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing activity' })
  @ApiParam({ name: 'id', description: 'Activity ID' })
  @ApiBody({
    description: 'Activity update payload',
    type: UpdateActivityDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Updated Activity',
          description: 'This is an updated activity description.',
          startAt: '2023-01-01',
          endAt: '2023-12-31',
          isPublic: false,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Activity updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @Req() req: any,
  ) {
    return await this.activityService.update(
      id,
      updateActivityDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiParam({ name: 'id', description: 'Activity ID' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.activityService.delete(id, req.user.id);
  }
}
