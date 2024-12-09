import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OAuthProvider } from './oAuthProvider.entity';

@Entity()
@Unique(['user', 'deviceId'])
export class UserOAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index()
  deviceId: string;

  @Column({ nullable: true, length: 255 })
  providerUserId: string;

  @Column({ nullable: true, length: 255, select: false })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExp: Date;

  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => OAuthProvider, (oAuthProvider) => oAuthProvider.users, {
    eager: true,
  })
  provider: OAuthProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
