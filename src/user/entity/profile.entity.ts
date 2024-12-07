import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Culture } from './culture.entity';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  careerGoal: string;

  @Column({ nullable: true })
  expectSalary: number;

  @ManyToOne(() => Culture, (culture) => culture.profiles)
  expectCulture: Culture;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
