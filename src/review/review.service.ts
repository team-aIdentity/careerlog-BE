import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly productService: ProductService,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findByProductId(
    productId: number,
    pageSize: number,
    page: number,
    orderBy: string,
  ): Promise<any> {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.productId = :productId', { productId })
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile');

    switch (orderBy) {
      case 'latest':
        query.orderBy('review.createdAt', 'DESC');
        break;
      case 'oldest':
        query.orderBy('review.createdAt', 'ASC');
        break;
      case 'rate':
        query.orderBy('review.rate', 'DESC');
        break;
      default:
        query.orderBy('review.createdAt', 'DESC');
    }

    const [reviews, total] = await query
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getManyAndCount();

    return {
      data: reviews,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<Review> {
    const product = await this.productService.findOne(
      createReviewDto.productId,
    );
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: userId },
      product: product,
    });
    return await this.reviewRepository.save(review);
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: number,
  ): Promise<Review> {
    const review = await this.findOne(id, userId);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async delete(id: number, userId: number): Promise<any> {
    const review = await this.findOne(id, userId);
    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully', review };
  }

  async findByUserId(
    userId: number,
    pageSize: number,
    page: number,
    orderBy: string,
  ): Promise<any> {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.userId = :userId', { userId })
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile');

    switch (orderBy) {
      case 'latest':
        query.orderBy('review.createdAt', 'DESC');
        break;
      case 'oldest':
        query.orderBy('review.createdAt', 'ASC');
        break;
      case 'rate':
        query.orderBy('review.rate', 'DESC');
        break;
      default:
        query.orderBy('review.createdAt', 'DESC');
    }

    const [reviews, total] = await query
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getManyAndCount();

    return {
      data: reviews,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / pageSize),
      },
    };
  }

  async findByUserIdAndProductId(
    userId: number,
    productId: number,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['user', 'user.profile', 'product'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
}
