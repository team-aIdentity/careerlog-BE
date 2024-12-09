import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Career } from 'src/career/entity/career.entity';
import { Academic } from './entity/academic.entity';
import { Culture } from './entity/culture.entity';
import { OAuthProvider } from './entity/oAuthProvider.entity';
import { Profile } from './entity/profile.entity';
import { Role } from './entity/role.entity';
import { UserOAuth } from './entity/userOAuth.entity';
import { UserRole } from './entity/userRole.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SavedArticle } from 'src/article/entity/savedArticle.entity';
import { Product } from 'src/product/entity/product.entity';
import { SavedProduct } from 'src/product/entity/savedProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Career,
      Academic,
      Culture,
      OAuthProvider,
      Profile,
      Role,
      UserOAuth,
      UserRole,
      SavedArticle,
      Product,
      SavedProduct,
    ]),
    ConfigModule,
  ],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
