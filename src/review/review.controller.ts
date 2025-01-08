import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@ApiTags('review')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of reviews per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'orderBy', required: false, description: 'Order by' })
  @ApiResponse({ status: 200, description: 'List of reviews for the product.' })
  async findByProductId(
    @Param('productId') productId: number,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('orderBy') orderBy: string,
  ) {
    return await this.reviewService.findByProductId(
      productId,
      pageSize,
      page,
      orderBy,
    );
  }

  @Get('my')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get my reviews' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'orderBy', description: 'Order by', required: false })
  @ApiResponse({ status: 200, description: 'List of my reviews.' })
  async getMyReviews(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('orderBy') orderBy: string,
  ) {
    return await this.reviewService.findByUserId(
      req.user.id,
      pageSize,
      page,
      orderBy,
    );
  }

  @Get('product/:productId/my')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get my reviews for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Review details.',
  })
  async getMyReviewsForProduct(
    @Req() req: any,
    @Param('productId') productId: number,
  ) {
    return await this.reviewService.findByUserIdAndProductId(
      req.user.id,
      productId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get a specific review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review details.' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.reviewService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({
    description: 'Review creation payload',
    type: CreateReviewDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          productId: 1,
          rating: 5,
          comment: 'Great product!',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return await this.reviewService.create(createReviewDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({
    description: 'Review update payload',
    type: UpdateReviewDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          rating: 4,
          comment: 'Updated review comment.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ) {
    return await this.reviewService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.reviewService.delete(id, req.user.id);
  }
}
