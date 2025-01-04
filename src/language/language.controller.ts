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
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/createLanguage.dto';
import { UpdateLanguageDto } from './dto/updateLanguage.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('language')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update language visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { languageId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.languageService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all language resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of language resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.languageService.getAllResume(userId);
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
        value: { shareLinkId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share link visibility updated successfully.',
  })
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.languageService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.languageService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'List of all languages.' })
  async findAll(@Req() req: any) {
    return await this.languageService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get language by ID' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Language details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.languageService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new language' })
  @ApiBody({
    description: 'Language creation payload',
    type: CreateLanguageDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'English',
          proficiency: 'Fluent',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Language created successfully.' })
  async create(@Body() createLanguageDto: CreateLanguageDto, @Req() req: any) {
    return await this.languageService.create(createLanguageDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing language' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiBody({
    description: 'Language update payload',
    type: UpdateLanguageDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Spanish',
          proficiency: 'Intermediate',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Language updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
    @Req() req: any,
  ) {
    return await this.languageService.update(
      id,
      updateLanguageDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a language' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.languageService.delete(id, req.user.id);
  }
}
