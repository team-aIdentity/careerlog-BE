import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Profile } from './entity/profile.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // read User
  @Get('all')
  async getAllUser(
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ): Promise<any> {
    return this.userService.findAll(pageSize, page);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new BadRequestException(`user with id ${userId} doesn't exist`);
    }

    return user;
  }

  @Get()
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(`user with email ${email} doesn't exist`);
    }

    return user;
  }

  @Put('update/profile')
  @UseGuards(JwtAccessAuthGuard)
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const userId = req.user.id;
    if (!updateProfileDto) {
      throw new BadRequestException('updatePorfile Dto should not be null');
    }
    return await this.userService.updateProfile(userId, updateProfileDto);
  }
}
