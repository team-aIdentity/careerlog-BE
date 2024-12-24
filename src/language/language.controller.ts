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
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/createLanguage.dto';
import { UpdateLanguageDto } from './dto/updateLanguage.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(@Req() req: any) {
    return await this.languageService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.languageService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createLanguageDto: CreateLanguageDto, @Req() req: any) {
    return await this.languageService.create(createLanguageDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
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
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.languageService.delete(id, req.user.id);
  }
}
