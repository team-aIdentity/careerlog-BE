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
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.projectService.findAll(req.user.id, pageSize, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.projectService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return await this.projectService.create(createProjectDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return await this.projectService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.projectService.delete(id, req.user.id);
  }
}
