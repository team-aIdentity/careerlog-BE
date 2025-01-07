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
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Response } from 'express';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { JwtAccessAuthGuard2 } from 'src/auth/jwt/jwtAccessAuth2.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';

@ApiTags('product')
@ApiBearerAuth() // If you are using JWT authentication
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  @UseGuards(JwtAccessAuthGuard2)
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of products per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'jobId', description: 'Job ID', required: false })
  @ApiQuery({ name: 'categoryId', description: 'Category ID', required: false })
  @ApiQuery({ name: 'orderBy', description: 'Order by', required: false })
  @ApiQuery({
    name: 'jobChangeStageId',
    description: 'Job Change Stage ID',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'List of all products.' })
  async getAllProducts(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('jobId') jobId: number,
    @Query('categoryId') categoryId: number,
    @Query('orderBy') orderBy: string,
    @Query('jobChangeStageId') jobChangeStageId: number,
  ) {
    const products = await this.productService.findAll(
      pageSize,
      page,
      jobId,
      categoryId,
      orderBy,
      jobChangeStageId,
    );
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
  @ApiOperation({ summary: 'Get my products' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of products per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of my products.' })
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
  @ApiOperation({ summary: 'Get all items in my cart' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of all items in my cart.' })
  async getMyAllCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getAllCart(req.user.id, pageSize, page);
  }

  @Get('cart/before')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get items in my cart before a certain date' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({
    status: 200,
    description: 'List of items in my cart before a certain date.',
  })
  async getMyBeforeCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getBeforeCart(req.user.id, pageSize, page);
  }

  @Get('cart/after')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get items in my cart after a certain date' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({
    status: 200,
    description: 'List of items in my cart after a certain date.',
  })
  async getMyAfterCart(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getAfterCart(req.user.id, pageSize, page);
  }

  @Get('category/all')
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'List of all product categories.' })
  async getAllArticleCategory() {
    return await this.productService.findAllCategories();
  }

  @Post('category')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiBody({
    description: 'Product category creation payload',
    type: CreateProductCategoryDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Electronics',
          description: 'Category for electronic products',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product category created successfully.',
  })
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
  @ApiOperation({ summary: 'Update an existing product category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({
    description: 'Product category update payload',
    type: UpdateProductCategoryDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Updated Electronics',
          description: 'Updated category for electronic products',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product category updated successfully.',
  })
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
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Product category deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to delete product category.',
  })
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

  @Get('saved')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Get saved products' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of products per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of saved products.' })
  async getSavedProduct(
    @Req() req: any,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
  ) {
    return await this.productService.getSavedProduct(
      req.user.id,
      pageSize,
      page,
    );
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard2)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product details.' })
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
  @ApiOperation({ summary: 'Search products by keyword' })
  @ApiParam({ name: 'keyword', description: 'Search keyword' })
  @ApiResponse({
    status: 200,
    description: 'List of products matching the keyword.',
  })
  async searchProduct(@Param('keyword') keyword: string) {
    return await this.productService.findWithKeyword(keyword);
  }

  @Post('my')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    description: 'Product creation payload',
    type: CreateProductDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          name: 'Example Product',
          description: 'Description of the product',
        },
      },
    },
  })
  async postProduct(
    @Req() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.createOne(createProductDto, req.user.id);
  }

  @Put('my/:id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    description: 'Product update payload',
    type: UpdateProductDto,
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
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
  @ApiOperation({ summary: 'Save a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product saved successfully.' })
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
  @ApiOperation({ summary: 'Get all saved products' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of products per page',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of saved products.' })
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
  @ApiOperation({ summary: 'Unsave a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product unsaved successfully.' })
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
  @ApiOperation({ summary: 'Add a product to cart' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product added to cart successfully.',
  })
  async addCart(@Req() req: any, @Query('productId') productId: number) {
    return await this.productService.addCart(productId, req.user.id);
  }

  @Delete('cart')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'Remove a product from cart' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully.',
  })
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
