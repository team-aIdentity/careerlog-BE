import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Career } from './career.entity';
import { Job } from 'src/job/entity/job.entity';
import { Profile } from 'src/user/entity/profile.entity';

@Entity()
export class SecondaryOccupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Job, (job) => job.secondaryOccupations)
  primaryOccupation: Job;

  @OneToMany(() => Career, (career) => career.jobRank)
  careers: Career[];

  @OneToMany(() => Profile, (profile) => profile.job)
  profiles: Profile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
