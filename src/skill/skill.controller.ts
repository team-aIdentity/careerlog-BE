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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('skill')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update skill visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { skillId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.skillService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all skill resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of skill resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.skillService.getAllResume(userId);
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
        value: { skillId: 1, isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.skillService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.skillService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all skills for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of skills.' })
  async findAll(@Req() req: any) {
    return await this.skillService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get a specific skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({ status: 200, description: 'Skill details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.skillService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiBody({
    description: 'Skill creation payload',
    type: CreateSkillDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'New Skill',
          level: 'Expert',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Skill created successfully.' })
  async create(@Body() createSkillDto: CreateSkillDto, @Req() req: any) {
    return await this.skillService.create(createSkillDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing skill' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiBody({
    description: 'Skill update payload',
    type: UpdateSkillDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Updated Skill',
          level: 'Intermediate',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Skill updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateSkillDto: UpdateSkillDto,
    @Req() req: any,
  ) {
    return await this.skillService.update(id, updateSkillDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.skillService.delete(id, req.user.id);
  }
}
