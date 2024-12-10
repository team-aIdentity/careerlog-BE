import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserOAuth } from 'src/user/entity/userOAuth.entity';
import { Profile } from 'src/user/entity/profile.entity';
import { UserModule } from 'src/user/user.module';
import { ArticleModule } from 'src/article/article.module';
import { Article } from 'src/article/entity/article.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Job, User, UserOAuth, Profile, Article]),
    UserModule,
    ArticleModule,
  ],
  controllers: [JobController],
  providers: [JobService, UserService, JwtService],
  exports: [JobModule],
})
export class JobModule {}
