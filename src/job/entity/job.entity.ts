import { Article } from 'src/article/entity/article.entity';
import { SecondaryOccupation } from 'src/career/entity/secondaryOccupation.entity';
import { Product } from 'src/product/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Article, (article) => article.job)
  articles: Article[];

  @OneToMany(() => Product, (product) => product.job)
  products: Product[];

  @OneToMany(
    () => SecondaryOccupation,
    (secondaryOccupation) => secondaryOccupation.primaryOccupation,
  )
  secondaryOccupations: SecondaryOccupation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
