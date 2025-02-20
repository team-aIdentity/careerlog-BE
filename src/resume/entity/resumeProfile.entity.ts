import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class resume_profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, default: true })
  isNameInclude: boolean;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: false, default: true })
  isJobInclude: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, default: true })
  isEmailInclude: boolean;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: false, default: true })
  isPhoneNumberInclude: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false, default: true })
  isAddressInclude: boolean;

  @Column({ type: 'text' })
  coreAbility: string;

  @Column({ nullable: false, default: true })
  isCoreAbilityInclude: boolean;

  @OneToOne(() => User, (user) => user.resumeProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
