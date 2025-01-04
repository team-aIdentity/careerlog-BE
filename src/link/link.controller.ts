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
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/createLink.dto';
import { UpdateLinkDto } from './dto/updateLink.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('link')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update link visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { linkId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.linkService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all link resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of link resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.linkService.getAllResume(userId);
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
    return this.linkService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.linkService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all links' })
  @ApiResponse({ status: 200, description: 'List of all links.' })
  async findAll(@Req() req: any) {
    return await this.linkService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get link by ID' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.linkService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({
    description: 'Link creation payload',
    type: CreateLinkDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          url: 'https://example.com',
          description: 'Example link',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Link created successfully.' })
  async create(@Body() createLinkDto: CreateLinkDto, @Req() req: any) {
    return await this.linkService.create(createLinkDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing link' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiBody({
    description: 'Link update payload',
    type: UpdateLinkDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          url: 'https://updated-example.com',
          description: 'Updated example link',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Link updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateLinkDto: UpdateLinkDto,
    @Req() req: any,
  ) {
    return await this.linkService.update(id, updateLinkDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Link deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.linkService.delete(id, req.user.id);
  }
}
