import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { SecondaryOccupationService } from './secondaryOccupation.service';
import { CreateSecondaryOccupationDto } from './dto/createSecondaryOccupation.dto';
import { UpdateSecondaryOccupationDto } from './dto/updateSecondaryOccupation.dto';
import { UserService } from 'src/user/user.service';

@Controller('secondary-occupation')
export class SecondaryOccupationController {
  constructor(
    private readonly secondaryOccupationService: SecondaryOccupationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllSecondaryOccupations() {
    return await this.secondaryOccupationService.findAll();
  }

  @Get(':id')
  async getSecondaryOccupationById(@Param('id') secondaryOccupationId: number) {
    return await this.secondaryOccupationService.findOne(secondaryOccupationId);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async createSecondaryOccupation(
    @Req() req: any,
    @Body() createSecondaryOccupationDto: CreateSecondaryOccupationDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create secondary occupation',
      );
    }
    return await this.secondaryOccupationService.create(
      createSecondaryOccupationDto,
    );
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async updateSecondaryOccupation(
    @Req() req: any,
    @Param('id') secondaryOccupationId: number,
    @Body() updateSecondaryOccupationDto: UpdateSecondaryOccupationDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update secondary occupation',
      );
    }
    return await this.secondaryOccupationService.update(
      secondaryOccupationId,
      updateSecondaryOccupationDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteSecondaryOccupation(
    @Req() req: any,
    @Param('id') secondaryOccupationId: number,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete secondary occupation',
      );
    }
    return await this.secondaryOccupationService.delete(secondaryOccupationId);
  }
}
