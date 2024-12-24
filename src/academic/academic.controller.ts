import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/createAcademic.dto';
import { UpdateAcademicDto } from './dto/updateAcademic.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(
    @Req() req: any,
    @Query('pageSize') take: number,
    @Query('page') page: number,
  ) {
    return await this.academicService.findAll(req.user.id, take, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') academicId: number, @Req() req: any) {
    return await this.academicService.findOne(academicId, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createAcademicDto: CreateAcademicDto, @Req() req: any) {
    return await this.academicService.create(createAcademicDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('id') academicId: number,
    @Body() updateAcademicDto: UpdateAcademicDto,
    @Req() req: any,
  ) {
    return await this.academicService.update(
      academicId,
      updateAcademicDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Param('id') academicId: number, @Req() req: any) {
    return await this.academicService.delete(academicId, req.user.id);
  }
}
