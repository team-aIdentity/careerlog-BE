import { Module } from '@nestjs/common';
import { JobChangeStageService } from './job-change-stage.service';
import { JobChangeStageController } from './job-change-stage.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobChangeStage } from './entity/jobChangeStage.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Product } from 'src/product/entity/product.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([JobChangeStage, Product]),
    UserModule,
    JwtModule,
  ],
  providers: [JobChangeStageService, UserService, JwtService],
  controllers: [JobChangeStageController],
  exports: [TypeOrmModule, JobChangeStageModule],
})
export class JobChangeStageModule {}
