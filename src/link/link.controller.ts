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
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/createLink.dto';
import { UpdateLinkDto } from './dto/updateLink.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(@Req() req: any) {
    return await this.linkService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.linkService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createLinkDto: CreateLinkDto, @Req() req: any) {
    return await this.linkService.create(createLinkDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateLinkDto: UpdateLinkDto,
    @Req() req: any,
  ) {
    return await this.linkService.update(id, updateLinkDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.linkService.delete(id, req.user.id);
  }
}
