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
import { SecondaryOccupation } from 'src/career/entity/secondaryOccupation.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: true })
  isNamePublic: boolean;

  @Column({ nullable: false, default: false })
  isNameInclude: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: false, default: true })
  isPhonePublic: boolean;

  @Column({ nullable: false, default: false })
  isPhoneInclude: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false, default: true })
  isAddressPublic: boolean;

  @Column({ nullable: false, default: false })
  isAddressInclude: boolean;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  careerGoal: string;

  @Column({ nullable: true })
  expectSalary: string;

  @Column({ default: false })
  isNeedOffer: boolean;

  @Column({ default: false })
  isShareLink: boolean;

  @Column({ nullable: true })
  introductionTitle: string;

  @Column({ nullable: false, default: true })
  isIntroductionTitlePublic: boolean;

  @Column({ nullable: true, type: 'text' })
  introductionContent: string;

  @Column({ nullable: false, default: true })
  isIntroductionContentPublic: boolean;

  @Column({ nullable: true, type: 'text' })
  coreAbility: string;

  @Column({ nullable: false, default: true })
  isCoreAbilityInclude: boolean;

  @ManyToOne(
    () => SecondaryOccupation,
    (secondaryOccupation) => secondaryOccupation.profiles,
  )
  job: SecondaryOccupation;

  @Column({ nullable: false, default: true })
  isJobPublic: boolean;

  @Column({ nullable: false, default: false })
  isJobInclude: boolean;

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
