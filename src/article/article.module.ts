import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ArticleController } from './article.controller';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/entity/userRole.entity';
import { Role } from 'src/user/entity/role.entity';
import { Profile } from 'src/user/entity/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { SavedArticle } from './entity/savedArticle.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Article,
      User,
      UserRole,
      Role,
      Profile,
      SavedArticle,
    ]),
    UserModule,
  ],
  providers: [ArticleService, UserService, JwtService],
  controllers: [ArticleController],
  exports: [ArticleModule, TypeOrmModule],
})
export class ArticleModule {}
