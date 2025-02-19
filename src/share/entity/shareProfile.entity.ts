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
export class share_profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, default: true })
  isNamePublic: boolean;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: false, default: true })
  isJobPublic: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, default: true })
  isEmailPublic: boolean;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: false, default: true })
  isPhoneNumberPublic: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false, default: true })
  isAddressPublic: boolean;

  @Column({ nullable: true })
  introductionTitle: string;

  @Column({ nullable: false, default: true })
  isIntroductionTitlePublic: boolean;

  @Column({ nullable: true })
  introductionContent: string;

  @Column({ nullable: false, default: true })
  isIntroductionContentPublic: boolean;

  @OneToOne(() => User, (user) => user.shareProfile, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
