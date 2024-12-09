import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { UserService } from 'src/user/user.service';
import { SavedArticle } from './entity/savedArticle.entity';

@Injectable()
export class ArticleService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(SavedArticle)
    private savedArticleRepository: Repository<SavedArticle>,
  ) {}

  async findAll(take: number, page: number): Promise<any> {
    const [articles, total] = await this.articleRepository.findAndCount({
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
    const article = await this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      thumbnail: createArticleDto.thumbnail,
      user: { id: userId },
    });
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

    if (updateArticleDto.title !== undefined)
      article.title = updateArticleDto.title;

    if (updateArticleDto.content !== undefined)
      article.content = updateArticleDto.content;

    if (updateArticleDto.thumbnail !== undefined)
      article.thumbnail = updateArticleDto.thumbnail;

    this.articleRepository.save(article);
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
}
