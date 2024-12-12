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
import { ProductCategory } from './productCategory.entity';
import { JobChangeStage } from 'src/job-change-stage/entity/jobChangeStage.entity';
import { Job } from 'src/job/entity/job.entity';

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

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true })
  detailImage: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ select: false, nullable: true })
  productLink: string;

  @Column({ select: false, nullable: true })
  productGeneralLink: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.product)
  userSaved: SavedProduct[];

  @OneToMany(() => Cart, (cart) => cart.product)
  cart: Cart[];

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { eager: true },
  )
  category: ProductCategory;

  @ManyToOne(
    () => JobChangeStage,
    (jobChangeStage) => jobChangeStage.products,
    { eager: true },
  )
  jobChangeStage: JobChangeStage;

  @ManyToOne(() => Job, (job) => job.products, { eager: true })
  job: Job;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
