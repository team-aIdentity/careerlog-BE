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
import { SavedArticle } from './savedArticle.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @OneToMany(() => SavedArticle, (savedArticle) => savedArticle.article)
  userSaved: SavedArticle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
