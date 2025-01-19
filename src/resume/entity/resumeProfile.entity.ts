import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class resume_profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false, default: true })
  isNameInclude: boolean;

  @Column()
  job: string;

  @Column({ nullable: false, default: true })
  isJobInclude: boolean;

  @Column()
  email: string;

  @Column({ nullable: false, default: true })
  isEmailInclude: boolean;

  @Column()
  phoneNumber: string;

  @Column({ nullable: false, default: true })
  isPhoneNumberInclude: boolean;

  @Column()
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
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
