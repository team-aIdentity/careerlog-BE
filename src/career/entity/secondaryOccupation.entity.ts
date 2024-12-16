import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryOccupation } from './primaryOccupation.entity';
import { Career } from './career.entity';

@Entity()
export class SecondaryOccupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(
    () => PrimaryOccupation,
    (primaryOccupation) => primaryOccupation.secondaryOccupations,
  )
  primaryOccupation: PrimaryOccupation;

  @OneToMany(() => Career, (career) => career.jobRank)
  careers: Career[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
