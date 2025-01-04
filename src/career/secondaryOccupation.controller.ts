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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { SecondaryOccupationService } from './secondaryOccupation.service';
import { CreateSecondaryOccupationDto } from './dto/createSecondaryOccupation.dto';
import { UpdateSecondaryOccupationDto } from './dto/updateSecondaryOccupation.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('secondary-occupation')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('secondary-occupation')
export class SecondaryOccupationController {
  constructor(
    private readonly secondaryOccupationService: SecondaryOccupationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all secondary occupations' })
  @ApiResponse({
    status: 200,
    description: 'List of all secondary occupations.',
  })
  async getAllSecondaryOccupations() {
    return await this.secondaryOccupationService.findAll();
  }

  @Get('primary-occupation/:id')
  @ApiOperation({ summary: 'Get primary occupation by ID' })
  @ApiParam({ name: 'id', description: 'Primary Occupation ID' })
  @ApiResponse({ status: 200, description: 'Primary occupation details.' })
  async getPrimaryOccupationById(@Param('id') primaryOccupationId: number) {
    return await this.secondaryOccupationService.findWithPrimaryOccupation(
      primaryOccupationId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get secondary occupation by ID' })
  @ApiParam({ name: 'id', description: 'Secondary Occupation ID' })
  @ApiResponse({ status: 200, description: 'Secondary occupation details.' })
  async getSecondaryOccupationById(@Param('id') secondaryOccupationId: number) {
    return await this.secondaryOccupationService.findOne(secondaryOccupationId);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new secondary occupation' })
  @ApiBody({
    description: 'Secondary occupation creation payload',
    type: CreateSecondaryOccupationDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Part-time Consultant',
          description: 'Provides consulting services on a part-time basis.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Secondary occupation created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Update an existing secondary occupation' })
  @ApiParam({ name: 'id', description: 'Secondary Occupation ID' })
  @ApiBody({
    description: 'Secondary occupation update payload',
    type: UpdateSecondaryOccupationDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Senior Consultant',
          description: 'Leads consulting projects and teams.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Secondary occupation updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'Delete a secondary occupation' })
  @ApiParam({ name: 'id', description: 'Secondary Occupation ID' })
  @ApiResponse({
    status: 200,
    description: 'Secondary occupation deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
