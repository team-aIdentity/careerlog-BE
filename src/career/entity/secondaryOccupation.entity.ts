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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
