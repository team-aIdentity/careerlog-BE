import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Academic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  major: string;

  @Column({ nullable: false })
  degree: string;

  @Column({ nullable: false })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @ManyToOne(() => User, (user) => user.academics)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
