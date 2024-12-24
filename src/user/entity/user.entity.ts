import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Career } from 'src/career/entity/career.entity';
import { UserRole } from './userRole.entity';
import { UserOAuth } from './userOAuth.entity';
import { Article } from 'src/article/entity/article.entity';
import { SavedArticle } from 'src/article/entity/savedArticle.entity';
import { OAuthProvider } from './oAuthProvider.entity';
import { Product } from 'src/product/entity/product.entity';
import { SavedProduct } from 'src/product/entity/savedProduct.entity';
import { Cart } from 'src/product/entity/cart.entity';
import { Academic } from 'src/academic/entity/academic.entity';
import { Activity } from 'src/activity/entity/activity.entity';
import { Skill } from 'src/skill/entity/skill.entity';
import { Project } from 'src/project/entity/project.entity';
import { Link } from 'src/link/entity/link.entity';
import { Certification } from 'src/certification/entity/certification.entity';
import { Language } from 'src/language/entity/language.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, update: false })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  lastActiveDate: Date;

  @Column({ default: false })
  isMarketing: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Career, (career) => career.user)
  careers: Career[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @OneToMany(() => Language, (language) => language.user)
  languages: Language[];

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];

  @OneToMany(() => Certification, (certification) => certification.user)
  certifications: Certification[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Academic, (academic) => academic.user)
  academics: Academic[];

  @OneToMany(() => UserOAuth, (userOAuth) => userOAuth.user)
  providers: OAuthProvider[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => SavedArticle, (savedArticle) => savedArticle.user)
  savedArticles: SavedArticle[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.user)
  savedProducts: SavedProduct[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
