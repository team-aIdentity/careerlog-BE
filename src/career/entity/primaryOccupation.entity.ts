import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SecondaryOccupation } from './secondaryOccupation.entity';

@Entity()
export class PrimaryOccupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(
    () => SecondaryOccupation,
    (sencondaryOccupation) => sencondaryOccupation.primaryOccupation,
  )
  secondaryOccupations: SecondaryOccupation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
