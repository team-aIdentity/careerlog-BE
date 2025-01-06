import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendKeywordService } from './recommend-keyword.service';
import { RecommendKeywordController } from './recommend-keyword.controller';
import { RecommendKeyword } from './entity/recommendKeyword.entity';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendKeyword]), UserModule],
  providers: [
    RecommendKeywordService,
    UserService,
    JwtAccessAuthGuard,
    JwtService,
  ],
  controllers: [RecommendKeywordController],
})
export class RecommendKeywordModule {}
