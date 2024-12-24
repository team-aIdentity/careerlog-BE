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
