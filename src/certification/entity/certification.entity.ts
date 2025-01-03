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
export class Certification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  jurisdiction: string;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: false, default: false })
  isInclude: boolean;

  @ManyToOne(() => User, (user) => user.certifications)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
