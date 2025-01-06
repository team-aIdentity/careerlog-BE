import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { RecommendKeywordService } from './recommend-keyword.service';
import { CreateRecommendKeywordDto } from './dto/createRecommendKeyword.dto';
import { UpdateRecommendKeywordDto } from './dto/updateRecommendKeyword.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { UserService } from 'src/user/user.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('recommend-keyword')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('recommend-keyword')
@UseGuards(JwtAccessAuthGuard)
export class RecommendKeywordController {
  constructor(
    private readonly recommendKeywordService: RecommendKeywordService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new recommend keyword' })
  @ApiBody({
    description: 'Recommend keyword creation payload',
    type: CreateRecommendKeywordDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          keyword: 'New Keyword',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Keyword created successfully.' })
  async create(@Body() createDto: CreateRecommendKeywordDto, @Req() req: any) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to create a keyword',
      );
    }
    return await this.recommendKeywordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recommend keywords' })
  @ApiResponse({ status: 200, description: 'List of recommend keywords.' })
  async findAll() {
    return await this.recommendKeywordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific recommend keyword by ID' })
  @ApiParam({ name: 'id', description: 'Recommend Keyword ID' })
  @ApiResponse({ status: 200, description: 'Recommend keyword details.' })
  async findOne(@Param('id') id: number) {
    return await this.recommendKeywordService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing recommend keyword' })
  @ApiParam({ name: 'id', description: 'Recommend Keyword ID' })
  @ApiBody({
    description: 'Recommend keyword update payload',
    type: UpdateRecommendKeywordDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          keyword: 'Updated Keyword',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Keyword updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateRecommendKeywordDto,
    @Req() req: any,
  ) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to update a keyword',
      );
    }
    return await this.recommendKeywordService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a recommend keyword' })
  @ApiParam({ name: 'id', description: 'Recommend Keyword ID' })
  @ApiResponse({ status: 200, description: 'Keyword deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete a keyword',
      );
    }
    return await this.recommendKeywordService.delete(id);
  }
}
