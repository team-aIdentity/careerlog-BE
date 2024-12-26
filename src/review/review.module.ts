import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { JobService } from 'src/job/job.service';
import { JobChangeStageService } from 'src/job-change-stage/job-change-stage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UserModule, ProductModule],
  providers: [
    ReviewService,
    JwtAccessAuthGuard,
    JwtService,
    UserService,
    ProductService,
    JobService,
    JobChangeStageService,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
