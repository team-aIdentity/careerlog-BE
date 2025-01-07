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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { Response } from 'express';
import { CreateArticleCategoryDto } from './dto/createArticleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/updateArticleCategory.dto';
import { JwtAccessAuthGuard2 } from 'src/auth/jwt/jwtAccessAuth2.guard';

@ApiTags('article')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  @UseGuards(JwtAccessAuthGuard2)
  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'jobId', description: 'Job ID', required: false })
  @ApiQuery({ name: 'categoryId', description: 'Category ID', required: false })
  @ApiQuery({ name: 'orderBy', description: 'Order by', required: false })
  @ApiResponse({ status: 200, description: 'List of all articles.' })
  async getAllArticles(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('jobId') jobId: number,
    @Query('categoryId') categoryId: number,
    @Query('orderBy') orderBy: string,
  ) {
    const articles = await this.articleService.findAll(
      pageSize,
      page,
      jobId,
      categoryId,
      orderBy,
    );
    if (req.user) {
      for (const article of articles.data) {
        article.isSaved = await this.articleService.isArticleSavedByUser(
          req.user.id,
          article.id,
        );
      }
    }
    for (const article of articles.data) {
      article.savedUserCount = await this.articleService.getSavedUserCount(
        article.id,
      );
    }
    return articles;
  }

  @Get('my')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get my articles' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiResponse({ status: 200, description: 'List of my articles.' })
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
  @ApiOperation({ summary: 'Search articles by keyword' })
  @ApiParam({ name: 'keyword', description: 'Search keyword' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'categoryId', description: 'Category ID', required: false })
  @ApiQuery({ name: 'jobId', description: 'Job ID', required: false })
  @ApiQuery({ name: 'orderBy', description: 'Order by', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of articles matching the keyword.',
  })
  async searchArticle(
    @Param('keyword') keyword: string,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('categoryId') categoryId: number,
    @Query('jobId') jobId: number,
    @Query('orderBy') orderBy: string,
  ) {
    return await this.articleService.findWithKeyword(
      keyword,
      pageSize,
      page,
      categoryId,
      jobId,
      orderBy,
    );
  }

  @Post('my')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({
    description: 'Article creation payload',
    type: CreateArticleDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'New Article',
          content: 'This is the content of the new article.',
          categoryId: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Article created successfully.' })
  async postArticle(
    @Req() req: any,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articleService.createOne(createArticleDto, req.user.id);
  }

  @Put('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiBody({
    description: 'Article update payload',
    type: UpdateArticleDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          title: 'Updated Article',
          content: 'This is the updated content of the article.',
          categoryId: 2,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Article updated successfully.' })
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
  @ApiOperation({ summary: 'Delete an article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Delete article failed.' })
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
  @ApiOperation({ summary: 'Get saved articles' })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiResponse({ status: 200, description: 'List of saved articles.' })
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
  @ApiOperation({ summary: 'Save an article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article saved successfully.' })
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
  @ApiOperation({ summary: 'Unsave an article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article unsaved successfully.' })
  @ApiResponse({ status: 400, description: 'Unsave article failed.' })
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
  @ApiOperation({ summary: 'Get all article categories' })
  @ApiResponse({ status: 200, description: 'List of all article categories.' })
  async getAllArticleCategory() {
    return await this.articleService.findAllCategories();
  }

  @Post('category')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new article category' })
  @ApiBody({
    description: 'Article category creation payload',
    type: CreateArticleCategoryDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'New Category',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Article category created successfully.',
  })
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
  @ApiOperation({ summary: 'Update an article category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({
    description: 'Article category update payload',
    type: UpdateArticleCategoryDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Updated Category',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Article category updated successfully.',
  })
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
  @ApiOperation({ summary: 'Delete an article category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Article category deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Delete article category failed.',
  })
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
  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article details.' })
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
