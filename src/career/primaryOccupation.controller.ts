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
import { PrimaryOccupationService } from './primaryOccupation.service';
import { CreatePrimaryOccupationDto } from './dto/createPrimaryOccupation.dto';
import { UpdatePrimaryOccupationDto } from './dto/updatePrimaryOccupation.dto';
import { UserService } from 'src/user/user.service';
@Controller('primary-occupation')
export class PrimaryOccupationController {
  constructor(
    private readonly primaryOccupationService: PrimaryOccupationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllPrimaryOccupations() {
    return await this.primaryOccupationService.findAll();
  }

  @Get(':id')
  async getPrimaryOccupationById(@Param('id') primaryOccupationId: number) {
    return await this.primaryOccupationService.findOne(primaryOccupationId);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async createPrimaryOccupation(
    @Req() req: any,
    @Body() createPrimaryOccupationDto: CreatePrimaryOccupationDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create primary occupation',
      );
    }
    return await this.primaryOccupationService.create(
      createPrimaryOccupationDto,
    );
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async updatePrimaryOccupation(
    @Req() req: any,
    @Param('id') primaryOccupationId: number,
    @Body() updatePrimaryOccupationDto: UpdatePrimaryOccupationDto,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update primary occupation',
      );
    }
    return await this.primaryOccupationService.update(
      primaryOccupationId,
      updatePrimaryOccupationDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async deletePrimaryOccupation(
    @Req() req: any,
    @Param('id') primaryOccupationId: number,
  ) {
    const userId = req.user.id;
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete primary occupation',
      );
    }
    return await this.primaryOccupationService.delete(primaryOccupationId);
  }
}
