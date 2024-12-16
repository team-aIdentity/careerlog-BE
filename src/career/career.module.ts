import { Module } from '@nestjs/common';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JobRank } from './entity/jobRank.entity';
import { Career } from './entity/career.entity';
import { PrimaryOccupation } from './entity/primaryOccupation.entity';
import { SecondaryOccupation } from './entity/secondaryOccupation.entity';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JobRankController } from './jobRank.controller';
import { SecondaryOccupationController } from './secondaryOccupation.controller';
import { PrimaryOccupationController } from './primaryOccupation.controller';
import { JobRankService } from './jobRank.service';
import { SecondaryOccupationService } from './secondaryOccupation.service';
import { PrimaryOccupationService } from './primaryOccupation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      JobRank,
      Career,
      PrimaryOccupation,
      SecondaryOccupation,
    ]),
    JwtModule,
    UserModule,
  ],
  providers: [
    CareerService,
    JwtAccessAuthGuard,
    JwtService,
    UserService,
    JobRankService,
    SecondaryOccupationService,
    PrimaryOccupationService,
  ],
  controllers: [
    CareerController,
    JobRankController,
    SecondaryOccupationController,
    PrimaryOccupationController,
  ],
  exports: [
    CareerService,
    JobRankService,
    SecondaryOccupationService,
    PrimaryOccupationService,
  ],
})
export class CareerModule {}
