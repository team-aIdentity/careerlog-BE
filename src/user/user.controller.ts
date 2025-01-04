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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
    methods for resume
  */
  @Put('resume/name/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume name visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateResumeNameVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeNameVisibility(req.user.id, body);
  }

  @Put('resume/job/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume job visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateResumeJobVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeJobVisibility(req.user.id, body);
  }

  @Put('resume/email/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume email visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateResumeEmailVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeEmailVisibility(req.user.id, body);
  }

  @Put('resume/phone/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume phone visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateResumePhoneVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumePhoneVisibility(req.user.id, body);
  }

  @Put('resume/address/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume address visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateResumeAddressVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeAddressVisibility(req.user.id, body);
  }

  @Put('resume/core-ability/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume core ability visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isInclude: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Visibility updated successfully.',
  })
  async updateResumeCoreAbilityVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeCoreAbilityVisibility(
      req.user.id,
      body,
    );
  }

  @Post('resume/core-ability')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update resume core ability' })
  @ApiBody({
    description: 'Core ability update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { coreAbility: 'test' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Core ability updated successfully.',
  })
  async updateResumeCoreAbility(@Req() req: any, @Body() body: any) {
    return this.userService.updateResumeCoreAbility(req.user.id, body);
  }

  @Get('resume/:userId')
  @ApiOperation({ summary: 'Get resume by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Resume details.' })
  async getResume(@Param('userId') userId: number) {
    return this.userService.getResume(userId);
  }

  /*
    methods for share link
  */
  @Put('share-link')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link' })
  @ApiBody({
    description: 'Share link update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Share link updated successfully.' })
  async updateShareLink(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLink(req.user.id, body);
  }

  @Put('share-link/name/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link name visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateShareLinkNameVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkNameVisibility(req.user.id, body);
  }

  @Put('share-link/job/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link job visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateShareLinkJobVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkJobVisibility(req.user.id, body);
  }

  @Put('share-link/email/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link email visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateShareLinkEmailVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkEmailVisibility(req.user.id, body);
  }

  @Put('share-link/phone/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link phone visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateShareLinkPhoneVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkPhoneVisibility(req.user.id, body);
  }

  @Put('share-link/address/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link address visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully.' })
  async updateShareLinkAddressVisibility(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkAddressVisibility(req.user.id, body);
  }

  @Put('share-link/introduction/title/visibility')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update share link introduction title visibility' })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Visibility updated successfully.',
  })
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
  @ApiOperation({
    summary: 'Update share link introduction content visibility',
  })
  @ApiBody({
    description: 'Visibility update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { isPublic: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Visibility updated successfully.',
  })
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
  @ApiOperation({ summary: 'Update share link introduction' })
  @ApiBody({
    description: 'Introduction update payload',
    type: Object,
    examples: {
      example1: {
        summary: 'Example payload',
        value: { title: 'test', content: 'test' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Introduction updated successfully.',
  })
  async updateShareLinkIntroduction(@Req() req: any, @Body() body: any) {
    return this.userService.updateShareLinkIntroduction(req.user.id, body);
  }

  @Get('share-link/:userId')
  @ApiOperation({ summary: 'Get share link by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Share link details.' })
  async getShareLink(@Param('userId') userId: number) {
    return this.userService.getShareLink(userId);
  }

  // read User
  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of users per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  async getAllUser(
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ): Promise<any> {
    return this.userService.findAll(pageSize, page);
  }

  @Get('profile')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile details.' })
  async getProfile(@Req() req: any): Promise<any> {
    const userId = req.user.id;
    return this.userService.getProfile(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user by email' })
  @ApiQuery({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'User details.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(`user with email ${email} doesn't exist`);
    }

    return user;
  }

  @Put('update/profile')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ description: 'Profile update payload', type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid profile data.' })
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const userId = req.user.id;
    if (!updateProfileDto) {
      throw new BadRequestException('updateProfileDto should not be null');
    }
    return await this.userService.updateProfile(userId, updateProfileDto);
  }

  @Get('culture')
  @ApiOperation({ summary: 'Get all cultures' })
  @ApiResponse({ status: 200, description: 'List of cultures.' })
  async getAllCultures() {
    return await this.userService.findAllCultures();
  }

  @Get('culture/:id')
  @ApiOperation({ summary: 'Get culture by ID' })
  @ApiParam({ name: 'id', description: 'Culture ID' })
  @ApiResponse({ status: 200, description: 'Culture details.' })
  async getCultureById(@Param('id') id: number) {
    return await this.userService.findCultureById(id);
  }

  @Post('culture')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new culture' })
  @ApiBody({ description: 'Culture creation payload', type: CreateCultureDto })
  @ApiResponse({ status: 201, description: 'Culture created successfully.' })
  async createCulture(@Body() createCultureDto: CreateCultureDto) {
    return await this.userService.createCulture(createCultureDto);
  }

  @Put('culture/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing culture' })
  @ApiParam({ name: 'id', description: 'Culture ID' })
  @ApiBody({ description: 'Culture update payload', type: UpdateCultureDto })
  @ApiResponse({ status: 200, description: 'Culture updated successfully.' })
  async updateCulture(
    @Param('id') id: number,
    @Body() updateCultureDto: UpdateCultureDto,
  ) {
    return await this.userService.updateCulture(id, updateCultureDto);
  }

  @Delete('culture/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a culture' })
  @ApiParam({ name: 'id', description: 'Culture ID' })
  @ApiResponse({ status: 200, description: 'Culture deleted successfully.' })
  async deleteCulture(@Param('id') id: number) {
    return await this.userService.deleteCulture(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async getUserById(@Param('id') userId: number): Promise<User> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new BadRequestException(`user with id ${userId} doesn't exist`);
    }

    return user;
  }
}
