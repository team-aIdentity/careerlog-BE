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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { CreateResumeProfileDto } from './dto/createResumeProfile.dto';
import { UpdateResumeProfileDto } from './dto/updateResumeProfile.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('resume')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new resume profile' })
  @ApiBody({
    description: 'Resume profile creation payload',
    type: CreateResumeProfileDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'John Doe',
          isNameInclude: true,
          job: 'Software Engineer',
          isJobInclude: true,
          email: 'john.doe@example.com',
          isEmailInclude: true,
          phoneNumber: '123-456-7890',
          isPhoneNumberInclude: true,
          address: '123 Main St, Anytown, USA',
          isAddressInclude: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Resume profile created successfully.',
  })
  async create(
    @Body() createResumeProfileDto: CreateResumeProfileDto,
    @Req() req: any,
  ) {
    return await this.resumeService.create(createResumeProfileDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: 'Get the resume profile for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Resume profile details.' })
  async findOne(@Req() req: any) {
    return await this.resumeService.findOne(req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing resume profile' })
  @ApiParam({ name: 'id', description: 'Resume profile ID' })
  @ApiBody({
    description: 'Resume profile update payload',
    type: UpdateResumeProfileDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Jane Doe',
          isNameInclude: false,
          job: 'Product Manager',
          isJobInclude: true,
          email: 'jane.doe@example.com',
          isEmailInclude: false,
          phoneNumber: '987-654-3210',
          isPhoneNumberInclude: true,
          address: '456 Elm St, Othertown, USA',
          isAddressInclude: false,
          coreAbility: 'Core ability',
          isCoreAbilityInclude: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resume profile updated successfully.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateResumeProfileDto: UpdateResumeProfileDto,
    @Req() req: any,
  ) {
    return await this.resumeService.update(
      id,
      updateResumeProfileDto,
      req.user.id,
    );
  }
}
