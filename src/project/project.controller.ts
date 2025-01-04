import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('project')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update project visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { projectId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.projectService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all project resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of project resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.projectService.getAllResume(userId);
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
        value: { projectId: 1, isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.projectService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.projectService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all projects for the authenticated user' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiResponse({ status: 200, description: 'List of projects.' })
  async findAll(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.projectService.findAll(req.user.id, pageSize, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get a specific project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.projectService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({
    description: 'Project creation payload',
    type: CreateProjectDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'New Project',
          description: 'This is a new project.',
          startAt: '2023-01-01',
          endAt: '2023-12-31',
          isPublic: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return await this.projectService.create(createProjectDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({
    description: 'Project update payload',
    type: UpdateProjectDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Updated Project',
          description: 'This is an updated project.',
          startAt: '2023-01-01',
          endAt: '2023-12-31',
          isPublic: false,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return await this.projectService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.projectService.delete(id, req.user.id);
  }
}
