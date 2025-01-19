import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareProfileDto } from './dto/createShareProfile.dto';
import { UpdateShareProfileDto } from './dto/updateShareProfile.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('share')
@ApiBearerAuth()
@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new share profile' })
  @ApiBody({
    description: 'Share profile creation payload',
    type: CreateShareProfileDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          // Add example payload fields here
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Share profile created successfully.',
  })
  async create(
    @Body() createShareProfileDto: CreateShareProfileDto,
    @Req() req: any,
  ) {
    return await this.shareService.create(createShareProfileDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get the share profile for the specified user',
  })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Share profile details.' })
  async findOne(@Param('user_id') userId: number) {
    return await this.shareService.findOne(userId);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing share profile' })
  @ApiParam({ name: 'id', description: 'Share profile ID' })
  @ApiBody({
    description: 'Share profile update payload',
    type: UpdateShareProfileDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          // Add example payload fields here
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Share profile updated successfully.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateShareProfileDto: UpdateShareProfileDto,
    @Req() req: any,
  ) {
    return await this.shareService.update(
      id,
      updateShareProfileDto,
      req.user.id,
    );
  }
}
