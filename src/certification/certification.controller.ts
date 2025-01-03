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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/createCertification.dto';
import { UpdateCertificationDto } from './dto/updateCertification.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.certificationService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  async getAllResume(@Param('userId') userId: number) {
    return this.certificationService.getAllResume(userId);
  }

  /*
    method for share link
  */
  @Put('share-link/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.certificationService.updateShareLinkVisibility(
      req.user.id,
      body,
    );
  }

  @Get('share-link/all/:userId')
  async getAllShareLink(@Param('userId') userId: number) {
    return this.certificationService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(@Req() req: any) {
    return await this.certificationService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.certificationService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
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
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.certificationService.delete(id, req.user.id);
  }
}
