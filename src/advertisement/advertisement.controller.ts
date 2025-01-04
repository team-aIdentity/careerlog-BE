import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
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
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { AdvertisementService } from './advertisement.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { CreateAdDto } from './dto/createAd.dto';
import { UpdateAdDto } from './dto/updateAd.dto';

@ApiTags('advertisement')
@ApiBearerAuth()
@Controller('advertisement')
export class AdvertisementController {
  constructor(
    private readonly userService: UserService,
    private readonly advertisementService: AdvertisementService,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all advertisements' })
  @ApiResponse({ status: 200, description: 'List of all advertisements.' })
  async getAdAll() {
    return await this.advertisementService.findAll();
  }

  @Get('/data/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get advertisement by ID' })
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiResponse({ status: 200, description: 'Advertisement details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAdById(@Req() req: any, @Param('id') adId: number) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.findOne(adId);
  }

  @Post('/add')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Add a new advertisement' })
  @ApiBody({
    description: 'Advertisement creation payload',
    type: CreateAdDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'New Ad',
          description: 'This is a new advertisement.',
          imageUrl: 'http://example.com/image.png',
          link: 'http://example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Advertisement created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async uploadAd(@Req() req: any, @Body() createAdDto: CreateAdDto) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.create(createAdDto);
  }

  @Put('/update/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing advertisement' })
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiBody({
    description: 'Advertisement update payload',
    type: UpdateAdDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Updated Ad',
          description: 'This is an updated advertisement.',
          imageUrl: 'http://example.com/updated-image.png',
          link: 'http://example.com/updated',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Advertisement updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async modifyAd(
    @Req() req: any,
    @Param('id') adId: number,
    @Body() updateAdDto: UpdateAdDto,
  ) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.update(adId, updateAdDto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete an advertisement' })
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiResponse({
    status: 200,
    description: 'Advertisement deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Delete ad failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteAd(@Req() req: any, @Param('id') adId, @Res() res: Response) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    const result = await this.advertisementService.deleteAd(adId);
    if (!result.affected) {
      throw new BadRequestException('delete ad failed');
    }
    return res.send({ message: 'delete ad successful' });
  }
}
