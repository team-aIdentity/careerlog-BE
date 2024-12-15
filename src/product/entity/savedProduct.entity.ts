import { User } from 'src/user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
@Unique(['user', 'product'])
export class SavedProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.savedProducts)
  user: User;

  @ManyToOne(() => Product, (product) => product.userSaved)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
