import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Career } from 'src/career/entity/career.entity';
import { UserRole } from './userRole.entity';
import { Academic } from './academic.entity';
import { UserOAuth } from './userOAuth.entity';
import { Article } from 'src/article/entity/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, update: false })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Career, (career) => career.user)
  careers: Career[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];

  @OneToMany(() => Academic, (academic) => academic.user)
  academics: Academic[];

  @OneToMany(() => UserOAuth, (userOAuth) => userOAuth.user)
  providers: UserOAuth[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
