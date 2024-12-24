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
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ nullable: false })
  contribution: number;

  @Column({ nullable: false })
  satisfaction: number;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
