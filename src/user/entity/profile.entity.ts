import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  careerGoal: string;

  @Column({ nullable: true })
  expectSalary: number;

  @ManyToOne(() => Culture, (culture) => culture.profiles)
  expectCulture: Culture;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
