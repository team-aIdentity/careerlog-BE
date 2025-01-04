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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/createCertification.dto';
import { UpdateCertificationDto } from './dto/updateCertification.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('certification')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update certification visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { certificationId: 1, isVisible: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.certificationService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  @ApiOperation({ summary: 'Get all certification resumes for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of certification resumes.' })
  async getAllResume(@Param('userId') userId: number) {
    return this.certificationService.getAllResume(userId);
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
    return this.certificationService.updateShareLinkVisibility(
      req.user.id,
      body,
    );
  }

  @Get('share-link/all/:userId')
  @ApiOperation({ summary: 'Get all share links for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of share links.' })
  async getAllShareLink(@Param('userId') userId: number) {
    return this.certificationService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get all certifications' })
  @ApiResponse({ status: 200, description: 'List of all certifications.' })
  async findAll(@Req() req: any) {
    return await this.certificationService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get certification by ID' })
  @ApiParam({ name: 'id', description: 'Certification ID' })
  @ApiResponse({ status: 200, description: 'Certification details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.certificationService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new certification' })
  @ApiBody({
    description: 'Certification creation payload',
    type: CreateCertificationDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Certified Kubernetes Administrator',
          issuer: 'CNCF',
          issueDate: '2023-01-01',
          expirationDate: '2025-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Certification created successfully.',
  })
  async create(
    @Body() createCertificationDto: CreateCertificationDto,
    @Req() req: any,
  ) {
    return await this.certificationService.create(
      createCertificationDto,
      req.user.id,
    );
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing certification' })
  @ApiParam({ name: 'id', description: 'Certification ID' })
  @ApiBody({
    description: 'Certification update payload',
    type: UpdateCertificationDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Certified Kubernetes Administrator',
          issuer: 'CNCF',
          issueDate: '2023-01-01',
          expirationDate: '2025-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Certification updated successfully.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateCertificationDto: UpdateCertificationDto,
    @Req() req: any,
  ) {
    return await this.certificationService.update(
      id,
      updateCertificationDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a certification' })
  @ApiParam({ name: 'id', description: 'Certification ID' })
  @ApiResponse({
    status: 200,
    description: 'Certification deleted successfully.',
  })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.certificationService.delete(id, req.user.id);
  }
}
