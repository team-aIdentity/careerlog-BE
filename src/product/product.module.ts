import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SavedProduct } from './entity/savedProduct.entity';
import { Cart } from './entity/cart.entity';
import { ProductCategory } from './entity/productCategory.entity';
import { JobService } from 'src/job/job.service';
import { JobChangeStageService } from 'src/job-change-stage/job-change-stage.service';
import { JobChangeStage } from 'src/job-change-stage/entity/jobChangeStage.entity';
import { JobChangeStageModule } from 'src/job-change-stage/job-change-stage.module';
import { Job } from 'src/job/entity/job.entity';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      Product,
      Cart,
      ProductCategory,
      JobChangeStage,
      Job,
    ]),
    UserModule,
    JwtModule,
    SavedProduct,
    JobChangeStageModule,
    JobModule,
  ],
  providers: [
    ProductService,
    UserService,
    JwtService,
    JobService,
    JobChangeStageService,
  ],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductModule],
})
export class ProductModule {}
