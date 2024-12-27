import { Module } from '@nestjs/common';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JobRank } from './entity/jobRank.entity';
import { Career } from './entity/career.entity';
import { SecondaryOccupation } from './entity/secondaryOccupation.entity';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JobRankController } from './jobRank.controller';
import { SecondaryOccupationController } from './secondaryOccupation.controller';
import { JobRankService } from './jobRank.service';
import { SecondaryOccupationService } from './secondaryOccupation.service';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, JobRank, Career, SecondaryOccupation]),
    JwtModule,
    UserModule,
    JobModule,
  ],
  providers: [
    CareerService,
    JwtAccessAuthGuard,
    JwtService,
    UserService,
    JobRankService,
    SecondaryOccupationService,
  ],
  controllers: [
    CareerController,
    JobRankController,
    SecondaryOccupationController,
  ],
  exports: [CareerService, JobRankService, SecondaryOccupationService],
})
export class CareerModule {}
