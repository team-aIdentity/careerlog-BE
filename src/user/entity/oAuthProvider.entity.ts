import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOAuth } from './userOAuth.entity';
import { User } from './user.entity';

@Entity()
export class OAuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => UserOAuth, (userOAuth) => userOAuth.provider)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
