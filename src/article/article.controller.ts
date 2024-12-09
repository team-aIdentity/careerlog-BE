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

  @Get(':id')
  async getArticleById(@Param('id') articleId: number) {
    return await this.articleService.findOne(articleId);
  }

  @Get('search/:keyword')
  async searchArticle(@Param('keyword') keyword: string) {
    return await this.articleService.findWithKeyword(keyword);
  }

  @Get()
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

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async postArticle(
    @Req() req: any,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articleService.createOne(createArticleDto, req.user.id);
  }

  @Put(':id')
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

  @Delete(':id')
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
}
