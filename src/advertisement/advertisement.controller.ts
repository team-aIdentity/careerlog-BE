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
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { AdvertisementService } from './advertisement.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { CreateAdDto } from './dto/createAd.dto';
import { UpdateAdDto } from './dto/updateAd.dto';

@Controller('advertisement')
export class AdvertisementController {
  constructor(
    private readonly userService: UserService,
    private readonly advertisementService: AdvertisementService,
  ) {}

  @Get('/all')
  async getAdAll(@Req() req: any) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.findAll();
  }

  @Get('/data/:id')
  @UseGuards(JwtAccessAuthGuard)
  async getAdById(@Req() req: any, @Param('id') adId: number) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.findOne(adId);
  }

  // @Get('/id /:id')
  // @UseGuards(JwtAccessAuthGuard)
  // async redirectAdById(@Req() req: any, @Param('id') adId: number) {
  //   const isAdmin = await this.userService.isAdmin(req.user.id);
  //   if (!isAdmin) throw new UnauthorizedException('user is not admin');
  // }

  @Post('/add')
  @UseGuards(JwtAccessAuthGuard)
  async uploadAd(@Req() req: any, @Body() createAdDto: CreateAdDto) {
    const isAdmin = await this.userService.isAdmin(req.user.id);
    if (!isAdmin) throw new UnauthorizedException('user is not admin');
    return await this.advertisementService.create(createAdDto);
  }

  @Put('/update/:id')
  @UseGuards(JwtAccessAuthGuard)
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
