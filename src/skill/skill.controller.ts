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
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  /*
    method for resume
  */
  @Put('update/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateVisibility(@Req() req: any, @Body() body: any) {
    return this.skillService.updateVisibility(req.user.id, body);
  }

  @Get('resume/all/:userId')
  async getAllResume(@Param('userId') userId: number) {
    return this.skillService.getAllResume(userId);
  }

  /*
    method for share link
  */
  @Put('share-link/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkVisibility(@Req() req: any, @Body() body: any) {
    return this.skillService.updateShareLinkVisibility(req.user.id, body);
  }

  @Get('share-link/all/:userId')
  async getAllShareLink(@Param('userId') userId: number) {
    return this.skillService.getAllShareLink(userId);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(@Req() req: any) {
    return await this.skillService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.skillService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createSkillDto: CreateSkillDto, @Req() req: any) {
    return await this.skillService.create(createSkillDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateSkillDto: UpdateSkillDto,
    @Req() req: any,
  ) {
    return await this.skillService.update(id, updateSkillDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.skillService.delete(id, req.user.id);
  }
}
