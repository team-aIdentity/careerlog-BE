import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  subTitle: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  startAt: string;

  @Column({ nullable: true })
  endAt: string;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: false, default: false })
  isInclude: boolean;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
