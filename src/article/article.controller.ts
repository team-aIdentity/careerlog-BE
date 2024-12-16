import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { Response } from 'express';
import { CreateArticleCategoryDto } from './dto/createArticleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/updateArticleCategory.dto';
import { JwtAccessAuthGuard2 } from 'src/auth/jwt/jwtAccessAuth2.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  @UseGuards(JwtAccessAuthGuard2)
  async getAllArticles(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    const articles = await this.articleService.findAll(pageSize, page);
    if (req.user) {
      for (const article of articles.data) {
        article.isSaved = await this.articleService.isArticleSavedByUser(
          req.user.id,
          article.id,
        );
        article.savedUserCount = await this.articleService.getSavedUserCount(
          article.id,
        );
      }
    }
    return articles;
  }

  @Get('my')
  @UseGuards(JwtAccessAuthGuard)
  async getMyArticles(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.articleService.findAllWithUserId(
      pageSize,
      page,
      req.user.id,
    );
  }

  @Get('search/:keyword')
  async searchArticle(@Param('keyword') keyword: string) {
    return await this.articleService.findWithKeyword(keyword);
  }

  @Post('my')
  @UseGuards(JwtAccessAuthGuard)
  async postArticle(
    @Req() req: any,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articleService.createOne(createArticleDto, req.user.id);
  }

  @Put('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  async updateArticle(
    @Req() req: any,
    @Param('id') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.updateArticle(
      updateArticleDto,
      articleId,
      req.user.id,
    );
  }

  @Delete('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteArticle(
    @Req() req: any,
    @Param('id') articleId: number,
    @Res() res: Response,
  ) {
    const result = await this.articleService.deleteOne(articleId, req.user.id);

    if (!result.affected) {
      return res.send({
        message: 'delete article failed',
      });
    }

    return res.send({
      message: 'delete article success',
    });
  }

  @Get('saved')
  @UseGuards(JwtAccessAuthGuard)
  async getSavedArticle(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.articleService.getSavedArticle(
      req.user.id,
      pageSize,
      page,
    );
  }

  @Post('save/:id')
  @UseGuards(JwtAccessAuthGuard)
  async saveArticle(
    @Req() req: any,
    @Param('id') articleId: number,
    @Res() res: Response,
  ) {
    await this.articleService.saveArticle(req.user.id, articleId);
    return res.send({
      message: 'article saved successfully',
    });
  }

  @Delete('save/:id')
  @UseGuards(JwtAccessAuthGuard)
  async unsaveArticle(
    @Req() req: any,
    @Param('id') articleId: number,
    @Res() res: Response,
  ) {
    const result = await this.articleService.unsaveArticle(
      req.user.id,
      articleId,
    );

    if (!result.affected) {
      return res.send({
        message: 'unsaving article failed',
      });
    }

    return res.send({
      message: 'article unsaved successfully',
    });
  }

  @Get('category/all')
  async getAllArticleCategory() {
    return await this.articleService.findAllCategories();
  }

  @Post('category')
  @UseGuards(JwtAccessAuthGuard)
  async createCategory(
    @Req() req: any,
    @Body() createArticleCategoryDto: CreateArticleCategoryDto,
  ) {
    const userId = req.user.id;
    return await this.articleService.createCategory(
      userId,
      createArticleCategoryDto,
    );
  }

  @Put('category/:id')
  @UseGuards(JwtAccessAuthGuard)
  async updateCategory(
    @Req() req: any,
    @Body() updateArticleCategoryDto: UpdateArticleCategoryDto,
    @Param('id') categoryId: number,
  ) {
    const userId = req.user.id;
    return await this.articleService.updateCategory(
      userId,
      updateArticleCategoryDto,
      categoryId,
    );
  }

  @Delete('category/:id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteCategory(
    @Req() req: any,
    @Param('id') categoryId: number,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.articleService.deleteCategory(userId, categoryId);

    if (!result.affected) {
      return res.send({
        message: 'delete article category failed',
      });
    }

    return res.send({
      message: 'article category delete successfully',
    });
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard2)
  async getArticleById(
    @Req() req: any,
    @Param('id') articleId: number,
    @Res() res: Response,
  ) {
    const article: any = await this.articleService.findOne(articleId);
    article.savedUserCount =
      await this.articleService.getSavedUserCount(articleId);
    if (req.user) {
      article.isSaved = await this.articleService.isArticleSavedByUser(
        req.user.id,
        articleId,
      );
    }
    const oldCookies = req.cookies['viewCount'];
    if (oldCookies) {
      if (!oldCookies.includes(`[${articleId}]`)) {
        res.cookie('viewCount', oldCookies + `[${articleId}]`, {
          httpOnly: true,
          path: '/',
        });
        this.articleService.addViewCount(articleId);
      }
      return res.send({ article });
    }
    res.cookie('viewCount', `[${articleId}]`, {
      httpOnly: true,
      path: '/',
    });
    this.articleService.addViewCount(articleId);
    return res.send({ article });
  }
}
