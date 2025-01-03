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
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { Profile } from './entity/profile.entity';
import { CreateCultureDto } from './dto/createCulture.dto';
import { UpdateCultureDto } from './dto/updateCulture.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
    methods for resume
  */
  @Put('resume/name/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeNameVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeNameVisibility(req.user.id, body);
  }

  @Put('resume/job/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeJobVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeJobVisibility(req.user.id, body);
  }

  @Put('resume/email/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeEmailVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeEmailVisibility(req.user.id, body);
  }

  @Put('resume/phone/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumePhoneVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumePhoneVisibility(req.user.id, body);
  }

  @Put('resume/address/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeAddressVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeAddressVisibility(req.user.id, body);
  }

  @Put('resume/core-ability/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeCoreAbilityVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeCoreAbilityVisibility(
      req.user.id,
      body,
    );
  }

  @Post('resume/core-ability')
  @UseGuards(JwtAccessAuthGuard)
  async updateResumeCoreAbility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeCoreAbility(req.user.id, body);
  }

  @Get('resume/:userId')
  async getResume(@Param('userId') userId: number) {
    return this.userService.getResume(userId);
  }

  /*
    methods for share link
  */

  @Put('share-link')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLink(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLink(req.user.id, body);
  }

  @Put('share-link/name/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkNameVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkNameVisibility(req.user.id, body);
  }

  @Put('share-link/job/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkJobVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkJobVisibility(req.user.id, body);
  }

  @Put('share-link/email/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkEmailVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkEmailVisibility(req.user.id, body);
  }

  @Put('share-link/phone/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkPhoneVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkPhoneVisibility(req.user.id, body);
  }

  @Put('share-link/address/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkAddressVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkAddressVisibility(req.user.id, body);
  }

  @Put('share-link/introduction/title/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkIntroductionTitleVisibility(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.userService.updateShareLinkIntroductionTitleVisibility(
      req.user.id,
      body,
    );
  }

  @Put('share-link/introduction/content/visibility')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkIntroductionContentVisibility(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.userService.updateShareLinkIntroductionContentVisibility(
      req.user.id,
      body,
    );
  }

  @Post('share-link/introduction')
  @UseGuards(JwtAccessAuthGuard)
  async updateShareLinkIntroduction(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkIntroduction(req.user.id, body);
  }

  @Get('share-link/:userId')
  async getShareLink(@Param('userId') userId: number) {
    return this.userService.getShareLink(userId);
  }

  // read User
  @Get('all')
  async getAllUser(
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ): Promise<any> {
    return this.userService.findAll(pageSize, page);
  }

  @Get('profile')
  @UseGuards(JwtAccessAuthGuard)
  async getProfile(@Req() req: any): Promise<any> {
    const userId = req.user.id;
    return this.userService.getProfile(userId);
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

  @Get('culture')
  async getAllCultures() {
    return await this.userService.findAllCultures();
  }

  @Get('culture/:id')
  async getCultureById(@Param('id') id: number) {
    return await this.userService.findCultureById(id);
  }

  @Post('culture')
  @UseGuards(JwtAccessAuthGuard)
  async createCulture(@Body() createCultureDto: CreateCultureDto) {
    return await this.userService.createCulture(createCultureDto);
  }

  @Put('culture/:id')
  @UseGuards(JwtAccessAuthGuard)
  async updateCulture(
    @Param('id') id: number,
    @Body() updateCultureDto: UpdateCultureDto,
  ) {
    return await this.userService.updateCulture(id, updateCultureDto);
  }

  @Delete('culture/:id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteCulture(@Param('id') id: number) {
    return await this.userService.deleteCulture(id);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new BadRequestException(`user with id ${userId} doesn't exist`);
    }

    return user;
  }
}
