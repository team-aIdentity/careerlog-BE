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

  @Column()
  name: string;

  @Column({ nullable: false, default: true })
  isNamePublic: boolean;

  @Column()
  job: string;

  @Column({ nullable: false, default: true })
  isJobPublic: boolean;

  @Column()
  email: string;

  @Column({ nullable: false, default: true })
  isEmailPublic: boolean;

  @Column()
  phoneNumber: string;

  @Column({ nullable: false, default: true })
  isPhoneNumberPublic: boolean;

  @Column()
  address: string;

  @Column({ nullable: false, default: true })
  isAddressPublic: boolean;

  @Column()
  introductionTitle: string;

  @Column({ nullable: false, default: true })
  isIntroductionTitlePublic: boolean;

  @Column()
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
