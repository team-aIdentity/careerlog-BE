import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, update: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  birthDate: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Career, (career) => career.user)
  careers: Career[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];

  @OneToMany(() => Academic, (academic) => academic.user)
  academics: Academic[];

  @OneToMany(() => UserOAuth, (userOAuth) => userOAuth.user)
  providers: UserOAuth[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
