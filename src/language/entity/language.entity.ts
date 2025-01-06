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
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  language: string;

  @Column({ nullable: false })
  level: string;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: false, default: false })
  isInclude: boolean;

  @ManyToOne(() => User, (user) => user.languages, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
