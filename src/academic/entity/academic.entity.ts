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

  @Column({ nullable: false, default: false })
  isGraduated: boolean;

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

  @ManyToOne(() => User, (user) => user.academics)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
