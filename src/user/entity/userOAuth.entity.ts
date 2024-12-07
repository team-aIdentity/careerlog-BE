import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OAuthProvider } from './oAuthProvider.entity';

@Entity()
@Unique(['user', 'deviceId'])
export class UserOAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  deviceId: string;

  @Column({ nullable: true })
  providerUserId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExp: Date;

  @ManyToOne(() => User, (user) => user.providers)
  user: User;

  @ManyToOne(() => OAuthProvider, (oAuthProvider) => oAuthProvider.userOAuths)
  provider: OAuthProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
