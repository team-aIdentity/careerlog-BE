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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  async findByProductId(
    @Param('productId') productId: number,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.reviewService.findByProductId(productId, pageSize, page);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    return await this.reviewService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return await this.reviewService.create(createReviewDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ) {
    return await this.reviewService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async delete(@Param('id') id: number, @Req() req: any) {
    return await this.reviewService.delete(id, req.user.id);
  }
}
