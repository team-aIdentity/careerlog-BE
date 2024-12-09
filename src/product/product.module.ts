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

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Product, Cart]),
    UserModule,
    JwtModule,
    SavedProduct,
  ],
  providers: [ProductService, UserService, JwtService],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductModule],
})
export class ProductModule {}
