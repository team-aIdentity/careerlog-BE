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
export class Academic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  kind: string;

  @Column({ nullable: false, default: '재학중' })
  status: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  major: string;

  @Column({ nullable: false })
  startAt: string;

  @Column({ nullable: true })
  endAt: string;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: false, default: false })
  isInclude: boolean;

  @ManyToOne(() => User, (user) => user.academics, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
