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

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async getAllArticles(
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.articleService.findAll(pageSize, page);
  }

  @Get('my')
  @UseGuards(JwtAccessAuthGuard)
  async getMyArticles(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    console.log(pageSize);
    return await this.articleService.findAllWithUserId(
      pageSize,
      page,
      req.user.id,
    );
  }

  @Get(':id')
  async getArticleById(
    @Req() req: any,
    @Param('id') articleId: number,
    @Res() res: Response,
  ) {
    const article = await this.articleService.findOne(articleId);
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
}
