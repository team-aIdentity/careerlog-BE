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
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/createCareer.dto';
import { UpdateCareerDto } from './dto/updateCareer.dto';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  /* 
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.careerService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  async getAllResume(@Param('userId') userId: number) {
    return this.careerService.getAllResume(userId);
  }

  /* 
    method for share link
  */
  @Put('share-link/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.careerService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  async getAllShareLink(@Param('userId') userId: number) {
    return this.careerService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async getAllCareers(
    @Req() req: any,
    @Query('pageSize') take: number,
    @Query('page') page: number,
  ) {
    return await this.careerService.findAll(req.user.id, take, page);
  }

  @Get('check')
  @UseGuards(JwtAccessAuthGuard)
  async checkCareer(@Req() req: any) {
    return await this.careerService.checkCareer(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async getCareerById(@Param('id') careerId: number, @Req() req: any) {
    return await this.careerService.findOne(careerId, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async createCareer(
    @Body() createCareerDto: CreateCareerDto,
    @Req() req: any,
  ) {
    return await this.careerService.create(createCareerDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
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
  async deleteCareer(@Param('id') careerId: number, @Req() req: any) {
    return await this.careerService.delete(careerId, req.user.id);
  }
}
