import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SavedProduct } from './savedProduct.entity';
import { Cart } from './cart.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true })
  detailImage: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.product)
  userSaved: SavedProduct[];

  @OneToMany(() => Cart, (cart) => cart.product)
  cart: Cart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
