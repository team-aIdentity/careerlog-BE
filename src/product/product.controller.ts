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
import { ProductService } from './product.service';
import { Response } from 'express';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtAccessAuthGuard2 } from 'src/auth/jwt/jwtAccessAuth2.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  @UseGuards(JwtAccessAuthGuard2)
  async getAllProducts(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    const products = await this.productService.findAll(pageSize, page);
    if (req.user) {
      for (const product of products.data) {
        product.savedUserCount = await this.productService.getSavedUserCount(
          product.id,
        );
        product.isSaved = await this.productService.isProductSavedByUser(
          req.user.id,
          product.id,
        );
      }
    }
    return products;
  }

  @Get('my')
  @UseGuards(JwtAccessAuthGuard)
  async getMyProducts(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.findAllWithUserId(
      pageSize,
      page,
      req.user.id,
    );
  }

  @Get('cart/all')
  @UseGuards(JwtAccessAuthGuard)
  async getMyAllCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getAllCart(req.user.id, pageSize, page);
  }

  @Get('cart/before')
  @UseGuards(JwtAccessAuthGuard)
  async getMyBeforeCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getBeforeCart(req.user.id, pageSize, page);
  }

  @Get('cart/after')
  @UseGuards(JwtAccessAuthGuard)
  async getMyAfterCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getAfterCart(req.user.id, pageSize, page);
  }

  @Get('category/all')
  async getAllArticleCategory() {
    return await this.productService.findAllCategories();
  }

  @Post('category')
  @UseGuards(JwtAccessAuthGuard)
  async createCategory(
    @Req() req: any,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const userId = req.user.id;
    return await this.productService.createCategory(
      userId,
      createProductCategoryDto,
    );
  }

  @Put('category/:id')
  @UseGuards(JwtAccessAuthGuard)
  async updateCategory(
    @Req() req: any,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @Param('id') categoryId: number,
  ) {
    const userId = req.user.id;
    return await this.productService.updateCategory(
      userId,
      updateProductCategoryDto,
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
    const result = await this.productService.deleteCategory(userId, categoryId);

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
  async getProductById(
    @Req() req: any,
    @Param('id') productId: number,
    @Res() res: Response,
  ) {
    const product: any = await this.productService.findOne(productId);
    product.savedUserCount =
      await this.productService.getSavedUserCount(productId);
    if (req.user) {
      product.isSaved = await this.productService.isProductSavedByUser(
        req.user.id,
        productId,
      );
    }
    const oldCookies = req.cookies['viewCount'];
    if (oldCookies) {
      if (!oldCookies.includes(`[${productId}]`)) {
        res.cookie('viewCount', oldCookies + `[${productId}]`, {
          httpOnly: true,
          path: '/',
        });
        this.productService.addViewCount(productId);
      }
      return res.send({ product });
    }
    res.cookie('viewCount', `[${productId}]`, {
      httpOnly: true,
      path: '/',
    });
    this.productService.addViewCount(productId);
    return res.send({ product });
  }

  @Get('search/:keyword')
  async searchProduct(@Param('keyword') keyword: string) {
    return await this.productService.findWithKeyword(keyword);
  }

  @Post('my')
  @UseGuards(JwtAccessAuthGuard)
  async postProduct(
    @Req() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.createOne(createProductDto, req.user.id);
  }

  @Put('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  async updateProduct(
    @Req() req: any,
    @Param('id') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(
      updateProductDto,
      productId,
      req.user.id,
    );
  }

  @Delete('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteProduct(
    @Req() req: any,
    @Param('id') productId: number,
    @Res() res: Response,
  ) {
    const result = await this.productService.deleteOne(productId, req.user.id);

    if (!result.affected) {
      return res.send({
        message: 'delete product failed',
      });
    }

    return res.send({
      message: 'delete product success',
    });
  }

  @Post('save/:id')
  @UseGuards(JwtAccessAuthGuard)
  async saveProduct(
    @Req() req: any,
    @Param('id') productId: number,
    @Res() res: Response,
  ) {
    await this.productService.saveProduct(req.user.id, productId);
    return res.send({
      message: 'product saved successfully',
    });
  }

  @Get('my/save/all')
  @UseGuards(JwtAccessAuthGuard)
  async getAllSavedProduct(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.findAllSavedProduct(
      req.user.id,
      pageSize,
      page,
    );
  }

  @Delete('save/:id')
  @UseGuards(JwtAccessAuthGuard)
  async unsaveArticle(
    @Req() req: any,
    @Param('id') productId: number,
    @Res() res: Response,
  ) {
    const result = await this.productService.unsaveProduct(
      req.user.id,
      productId,
    );

    if (!result.affected) {
      return res.send({
        message: 'unsaving product failed',
      });
    }

    return res.send({
      message: 'product unsaved successfully',
    });
  }

  @Post('cart')
  @UseGuards(JwtAccessAuthGuard)
  async addCart(@Req() req: any, @Query('productId') productId: number) {
    return await this.productService.addCart(productId, req.user.id);
  }

  @Delete('cart')
  @UseGuards(JwtAccessAuthGuard)
  async removeCart(
    @Req() req: any,
    @Query('productId') productId: number,
    @Res() res: Response,
  ) {
    const result = await this.productService.removeCart(productId, req.user.id);

    if (!result.affected) {
      return res.send({
        message: 'removing cart failed',
      });
    }

    return res.send({
      message: 'cart removed successfully',
    });
  }
}
