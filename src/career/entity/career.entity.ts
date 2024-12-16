import { SecondaryOccupation } from 'src/career/entity/secondaryOccupation.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobRank } from './jobRank.entity';

@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  company: string;

  @Column({ nullable: false })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ nullable: true, type: 'int', default: null })
  totalYear: number;

  @ManyToOne(
    () => SecondaryOccupation,
    (secondaryOccupation) => secondaryOccupation.careers,
  )
  occupation: SecondaryOccupation;

  @ManyToOne(() => JobRank, (jobRank) => jobRank.careers)
  jobRank: JobRank;

  @ManyToOne(() => User, (user) => user.careers)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
