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
  color: string;

  @Column({ nullable: false })
  company: string;

  @Column({ nullable: false })
  team: string;

  @Column({ nullable: false })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ nullable: false, default: false })
  isCurrent: boolean;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: false, default: false })
  isInclude: boolean;

  @ManyToOne(() => JobRank, (jobRank) => jobRank.careers)
  jobRank: JobRank;

  @ManyToOne(() => User, (user) => user.careers)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
