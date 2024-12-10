import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { UserService } from 'src/user/user.service';
import { SavedArticle } from './entity/savedArticle.entity';
import { AritcleCategory } from './entity/articleCategory.entity';
import { CreateArticleCategoryDto } from './dto/createArticleCategory.dto';
import { updateArticleCategoryDto } from './dto/updateArticleCategory.dto';
import { JobService } from 'src/job/job.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,

    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(SavedArticle)
    private savedArticleRepository: Repository<SavedArticle>,
    @InjectRepository(AritcleCategory)
    private articleCategoryRepository: Repository<AritcleCategory>,
  ) {}

  async findAll(take: number, page: number): Promise<any> {
    const [articles, total] = await this.articleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile'],
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findAllWithUserId(take: number, page: number, userId): Promise<any> {
    const [articles, total] = await this.articleRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
      relations: ['user'],
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async createOne(createArticleDto: CreateArticleDto, userId: number) {
    // Category 찾기
    const category = await this.articleCategoryRepository.findOne({
      where: { name: createArticleDto.category },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Job 찾기
    const job = await this.jobService.findOne(createArticleDto.job);
    if (!job) {
      throw new BadRequestException('Job not found');
    }

    // Article 생성
    const article = this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      thumbnail: createArticleDto.thumbnail,
      user: { id: userId }, // User 엔터티 ID만 설정
      category: category, // 찾은 Category 엔터티
      job: job, // 찾은 Job 엔터티
    });

    // Article 저장
    await this.articleRepository.save(article);

    return article;
  }

  async updateArticle(
    updateArticleDto: UpdateArticleDto,
    articleId: number,
    userId: number,
  ) {
    const article = await this.findOne(articleId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (article.user.id != userId || isAdmin)
      throw new BadRequestException('user is now the owner for this article');

    const updatedFields: Partial<Article> = {
      ...(updateArticleDto.title && { title: updateArticleDto.title }),
      ...(updateArticleDto.content && { content: updateArticleDto.content }),
      ...(updateArticleDto.thumbnail && {
        thumbnail: updateArticleDto.thumbnail,
      }),
      // ...(updateArticleDto.job && { job: updateArticleDto.job }),
    };

    // Category 매핑
    if (updateArticleDto.category) {
      const category = await this.articleCategoryRepository.findOne({
        where: { name: updateArticleDto.category },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      updatedFields.category = category;
    }

    if (updateArticleDto.job) {
      const job = await this.jobService.findOne(updateArticleDto.job);
      if (!job) {
        throw new BadRequestException('Job not found');
      }
      updatedFields.job = job;
    }

    // 객체 병합
    Object.assign(article, updatedFields);

    // 변경사항 저장
    await this.articleRepository.save(article);

    return article;
  }

  async findOne(articleId: number) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['user', 'user.userRoles', 'user.userRoles.role'],
    });

    if (!article) {
      throw new BadRequestException('there is no article with ID');
    }

    return article;
  }

  async findWithKeyword(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('Keyword must be provided');
    }

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.content LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('article.title LIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('article.user', 'user')
      .getMany();

    if (articles.length === 0) {
      throw new BadRequestException('No articles found matching the keyword');
    }

    return articles;
  }

  async deleteOne(articleId: number, userId: number) {
    const article = await this.findOne(articleId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (article.user.id != userId || isAdmin)
      throw new BadRequestException('user is now the owner for this article');

    return await this.articleRepository.delete({ id: articleId });
  }

  async addViewCount(articleId: number) {
    await this.articleRepository
      .createQueryBuilder()
      .update()
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('id = :id', { id: articleId })
      .execute();
  }

  async saveArticle(userId: number, articleId: number) {
    const savedArticle = await this.savedArticleRepository.findOneBy({
      user: { id: userId },
      article: { id: articleId },
    });

    if (savedArticle) {
      throw new BadRequestException('user already saved this article');
    }

    await this.savedArticleRepository.save({
      user: { id: userId },
      article: { id: articleId },
    });
  }

  async unsaveArticle(userId: number, articleId: number) {
    return await this.savedArticleRepository.delete({
      user: { id: userId },
      article: { id: articleId },
    });
  }

  async findAllCategories() {
    const categories = await this.articleCategoryRepository.find();

    const groupedCategories = categories.reduce((result, category) => {
      const { type, id, name } = category;
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push({ id, name });
      return result;
    }, {});

    return groupedCategories;
  }

  async createCategory(
    userId: number,
    createArticleCategory: CreateArticleCategoryDto,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');

    const newCategory = this.articleCategoryRepository.create({
      type: createArticleCategory.type,
      name: createArticleCategory.name,
    });
    await this.articleCategoryRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(
    userId: number,
    updateArticleCategoryDto: updateArticleCategoryDto,
    categoryId: number,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');
    const category = await this.articleCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new BadRequestException('category not found');

    if (updateArticleCategoryDto.type)
      category.type = updateArticleCategoryDto.type;
    if (updateArticleCategoryDto.name)
      category.name = updateArticleCategoryDto.name;

    this.articleCategoryRepository.save(category);
    return category;
  }

  async deleteCategory(userId: number, categoryId: number) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');

    return await this.articleCategoryRepository.delete({ id: categoryId });
  }
}
