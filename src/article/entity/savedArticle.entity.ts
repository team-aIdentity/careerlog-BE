import { User } from 'src/user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
@Unique(['user', 'article'])
export class SavedArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.savedArticles)
  user: User;

  @ManyToOne(() => Article, (article) => article.userSaved, { eager: true })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
