import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { UserService } from 'src/user/user.service';
import { SavedArticle } from './entity/savedArticle.entity';
import { AritcleCategory } from './entity/articleCategory.entity';
import { CreateArticleCategoryDto } from './dto/createArticleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/updateArticleCategory.dto';
import { JobService } from 'src/job/job.service';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

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
    this.logger.log(
      `Fetching all articles with pagination: take=${take}, page=${page}`,
    );
    const [articles, total] = await this.articleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile'],
    });

    this.logger.log(`Fetched ${articles.length} articles`);
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
    this.logger.log(
      `Fetching articles for user ID: ${userId} with pagination: take=${take}, page=${page}`,
    );
    const [articles, total] = await this.articleRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
      relations: ['user'],
    });

    this.logger.log(
      `Fetched ${articles.length} articles for user ID: ${userId}`,
    );
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
    this.logger.log(`Creating a new article for user ID: ${userId}`);
    const category = await this.articleCategoryRepository.findOne({
      where: { name: createArticleDto.category },
    });
    if (!category) {
      this.logger.warn(`Category not found: ${createArticleDto.category}`);
      throw new BadRequestException('Category not found');
    }

    const job = await this.jobService.findOne(createArticleDto.job);
    if (!job) {
      this.logger.warn(`Job not found: ${createArticleDto.job}`);
      throw new BadRequestException('Job not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new BadRequestException('User not found');
    }

    const article = this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      thumbnail: createArticleDto.thumbnail,
      user: user,
      category: category,
      job: job,
    });

    await this.articleRepository.save(article);
    this.logger.log(`Article created with ID: ${article.id}`);
    return article;
  }

  async updateArticle(
    updateArticleDto: UpdateArticleDto,
    articleId: number,
    userId: number,
  ) {
    this.logger.log(`Updating article ID: ${articleId} for user ID: ${userId}`);
    const article = await this.findOne(articleId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (article.user.id != userId && !isAdmin) {
      this.logger.warn(
        `User ID: ${userId} is not the owner or admin for article ID: ${articleId}`,
      );
      throw new BadRequestException('User is not the owner for this article');
    }

    const updatedFields: Partial<Article> = {
      ...(updateArticleDto.title && { title: updateArticleDto.title }),
      ...(updateArticleDto.content && { content: updateArticleDto.content }),
      ...(updateArticleDto.thumbnail && {
        thumbnail: updateArticleDto.thumbnail,
      }),
    };

    if (updateArticleDto.category) {
      const category = await this.articleCategoryRepository.findOne({
        where: { name: updateArticleDto.category },
      });
      if (!category) {
        this.logger.warn(`Category not found: ${updateArticleDto.category}`);
        throw new BadRequestException('Category not found');
      }
      updatedFields.category = category;
    }

    if (updateArticleDto.job) {
      const job = await this.jobService.findOne(updateArticleDto.job);
      if (!job) {
        this.logger.warn(`Job not found: ${updateArticleDto.job}`);
        throw new BadRequestException('Job not found');
      }
      updatedFields.job = job;
    }

    Object.assign(article, updatedFields);
    await this.articleRepository.save(article);
    this.logger.log(`Article updated with ID: ${article.id}`);
    return article;
  }

  async findOne(articleId: number) {
    this.logger.log(`Fetching article with ID: ${articleId}`);
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['user', 'user.userRoles', 'user.userRoles.role'],
    });

    if (!article) {
      this.logger.warn(`No article found with ID: ${articleId}`);
      throw new BadRequestException('There is no article with ID');
    }

    this.logger.log(`Article found with ID: ${articleId}`);
    return article;
  }

  async findWithKeyword(keyword: string) {
    this.logger.log(`Searching articles with keyword: ${keyword}`);
    if (!keyword || keyword.trim() === '') {
      this.logger.warn('Keyword must be provided');
      throw new BadRequestException('Keyword must be provided');
    }

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.content LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('article.title LIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('article.user', 'user')
      .getMany();

    if (articles.length === 0) {
      this.logger.warn(`No articles found matching the keyword: ${keyword}`);
      throw new BadRequestException('No articles found matching the keyword');
    }

    this.logger.log(
      `Found ${articles.length} articles matching the keyword: ${keyword}`,
    );
    return articles;
  }

  async deleteOne(articleId: number, userId: number) {
    this.logger.log(`Deleting article ID: ${articleId} for user ID: ${userId}`);
    const article = await this.findOne(articleId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (article.user.id != userId && !isAdmin) {
      this.logger.warn(
        `User ID: ${userId} is not the owner or admin for article ID: ${articleId}`,
      );
      throw new BadRequestException('User is not the owner for this article');
    }

    const result = await this.articleRepository.delete({ id: articleId });
    this.logger.log(`Article deleted with ID: ${articleId}`);
    return result;
  }

  async addViewCount(articleId: number) {
    this.logger.log(`Incrementing view count for article ID: ${articleId}`);
    await this.articleRepository
      .createQueryBuilder()
      .update()
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('id = :id', { id: articleId })
      .execute();
    this.logger.log(`View count incremented for article ID: ${articleId}`);
  }

  async getSavedArticle(userId: number, take: number, page: number) {
    this.logger.log(
      `Fetching saved articles for user ID: ${userId} with pagination: take=${take}, page=${page}`,
    );
    const [savedArticles, total] =
      await this.savedArticleRepository.findAndCount({
        where: { user: { id: userId } },
        relations: [
          'article',
          'article.user',
          'article.user.profile',
          'article.category',
          'article.job',
        ],
        take,
        skip: (page - 1) * take,
      });

    const articles = savedArticles.map((savedArticle) => {
      const isSaved = true;
      const userSaveCount = this.getSavedUserCount(savedArticle.article.id);
      return {
        ...savedArticle.article,
        isSaved,
        userSaveCount,
      };
    });

    this.logger.log(`Fetched ${articles.length} saved articles`);
    return {
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async saveArticle(userId: number, articleId: number) {
    const user = await this.userService.findOne(userId);
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!article) {
      throw new BadRequestException('Article not found');
    }

    const savedArticle = await this.savedArticleRepository.findOne({
      where: { user: { id: userId }, article: { id: articleId } },
    });

    if (savedArticle) {
      throw new BadRequestException('User already saved this article');
    }

    await this.savedArticleRepository.save({
      user: user,
      article: article,
    });

    this.logger.log(`Article ID: ${articleId} saved for user ID: ${userId}`);
  }

  async unsaveArticle(userId: number, articleId: number) {
    this.logger.log(`Unsaving article ID: ${articleId} for user ID: ${userId}`);
    const result = await this.savedArticleRepository.delete({
      user: { id: userId },
      article: { id: articleId },
    });
    this.logger.log(`Article ID: ${articleId} unsaved for user ID: ${userId}`);
    return result;
  }

  async findAllCategories() {
    this.logger.log('Fetching all article categories');
    const categories = await this.articleCategoryRepository.find();

    const groupedCategories = categories.reduce((result, category) => {
      const { type, id, name } = category;
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push({ id, name });
      return result;
    }, {});

    this.logger.log(`Fetched ${categories.length} categories`);
    return groupedCategories;
  }

  async createCategory(
    userId: number,
    createArticleCategory: CreateArticleCategoryDto,
  ) {
    this.logger.log(`Creating a new category for user ID: ${userId}`);
    const isAdmin = await this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.warn(`User ID: ${userId} is not an admin`);
      throw new BadRequestException('User is not the admin');
    }

    const newCategory = this.articleCategoryRepository.create({
      type: createArticleCategory.type,
      name: createArticleCategory.name,
    });
    await this.articleCategoryRepository.save(newCategory);
    this.logger.log(`Category created with ID: ${newCategory.id}`);
    return newCategory;
  }

  async updateCategory(
    userId: number,
    updateArticleCategoryDto: UpdateArticleCategoryDto,
    categoryId: number,
  ) {
    this.logger.log(
      `Updating category ID: ${categoryId} for user ID: ${userId}`,
    );
    const isAdmin = await this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.warn(`User ID: ${userId} is not an admin`);
      throw new BadRequestException('User is not the admin');
    }
    const category = await this.articleCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      this.logger.warn(`Category not found with ID: ${categoryId}`);
      throw new BadRequestException('Category not found');
    }

    if (updateArticleCategoryDto.type)
      category.type = updateArticleCategoryDto.type;
    if (updateArticleCategoryDto.name)
      category.name = updateArticleCategoryDto.name;

    await this.articleCategoryRepository.save(category);
    this.logger.log(`Category updated with ID: ${category.id}`);
    return category;
  }

  async deleteCategory(userId: number, categoryId: number) {
    this.logger.log(
      `Deleting category ID: ${categoryId} for user ID: ${userId}`,
    );
    const isAdmin = await this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.warn(`User ID: ${userId} is not an admin`);
      throw new BadRequestException('User is not the admin');
    }

    const result = await this.articleCategoryRepository.delete({
      id: categoryId,
    });
    this.logger.log(`Category deleted with ID: ${categoryId}`);
    return result;
  }

  async isArticleSavedByUser(
    userId: number,
    articleId: number,
  ): Promise<boolean> {
    this.logger.log(
      `Checking if article ID: ${articleId} is saved by user ID: ${userId}`,
    );
    const savedArticle = await this.savedArticleRepository.findOne({
      where: { user: { id: userId }, article: { id: articleId } },
    });
    const isSaved = !!savedArticle;
    this.logger.log(
      `Article ID: ${articleId} is ${isSaved ? '' : 'not '}saved by user ID: ${userId}`,
    );
    return isSaved;
  }

  async getSavedUserCount(articleId: number): Promise<number> {
    this.logger.log(`Getting saved user count for article ID: ${articleId}`);
    const count = await this.savedArticleRepository.count({
      where: { article: { id: articleId } },
    });
    this.logger.log(`Article ID: ${articleId} is saved by ${count} users`);
    return count;
  }
}
