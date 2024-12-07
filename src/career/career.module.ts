import { Module } from '@nestjs/common';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JobRank } from './entity/jobRank.entity';
import { Career } from './entity/career.entity';
import { PrimaryOccupation } from './entity/primaryOccupation.entity';
import { SecondaryOccupation } from './entity/secondaryOccupation,entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      JobRank,
      Career,
      PrimaryOccupation,
      SecondaryOccupation,
    ]),
  ],
  providers: [CareerService],
  controllers: [CareerController],
})
export class CareerModule {}
