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
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/createAcademic.dto';
import { UpdateAcademicDto } from './dto/updateAcademic.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('academic')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  /* 
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update academic visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { academicId: 1, isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.academicService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all academic resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of academic resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.academicService.getAllResume(userId);
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
        value: { academicId: 1, isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.academicService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.academicService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: 'Get all academic records for the authenticated user',
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiResponse({ status: 200, description: 'List of academic records.' })
  async findAll(
    @Req() req: any,
    @Query('pageSize') take: number,
    @Query('page') page: number,
  ) {
    return await this.academicService.findAll(req.user.id, take, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get a specific academic record by ID' })
  @ApiParam({ name: 'id', description: 'Academic ID' })
  @ApiResponse({ status: 200, description: 'Academic record details.' })
  async findOne(@Param('id') academicId: number, @Req() req: any) {
    return await this.academicService.findOne(academicId, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new academic record' })
  @ApiBody({
    description: 'Academic creation payload',
    type: CreateAcademicDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          kind: 'Master',
          status: '졸업',
          name: 'Example Institute',
          major: 'Data Science',
          startAt: '2024-01-01',
          endAt: '2026-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Academic record created successfully.',
  })
  async create(@Body() createAcademicDto: CreateAcademicDto, @Req() req: any) {
    return await this.academicService.create(createAcademicDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing academic record' })
  @ApiParam({ name: 'id', description: 'Academic ID' })
  @ApiBody({
    description: 'Academic update payload',
    type: UpdateAcademicDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          kind: 'Master',
          status: '졸업',
          name: 'Example Institute',
          major: 'Data Science',
          startAt: '2024-01-01',
          endAt: '2026-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Academic record updated successfully.',
  })
  async update(
    @Param('id') academicId: number,
    @Body() updateAcademicDto: UpdateAcademicDto,
    @Req() req: any,
  ) {
    return await this.academicService.update(
      academicId,
      updateAcademicDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete an academic record' })
  @ApiParam({ name: 'id', description: 'Academic ID' })
  @ApiResponse({
    status: 200,
    description: 'Academic record deleted successfully.',
  })
  async delete(@Param('id') academicId: number, @Req() req: any) {
    return await this.academicService.delete(academicId, req.user.id);
  }
}
