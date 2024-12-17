import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { SavedProduct } from './entity/savedProduct.entity';
import { Cart } from './entity/cart.entity';
import { ProductCategory } from './entity/productCategory.entity';
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';
import { JobService } from 'src/job/job.service';
import { JobChangeStageService } from 'src/job-change-stage/job-change-stage.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly jobChangeStageService: JobChangeStageService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SavedProduct)
    private savedProductRepository: Repository<SavedProduct>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll(take: number, page: number): Promise<any> {
    this.logger.log(`Finding all products with take: ${take}, page: ${page}`);
    const [products, total] = await this.productRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile', 'category', 'jobChangeStage', 'job'],
    });
    this.logger.log(`Found ${total} products`);

    return {
      data: products,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findAllWithUserId(take: number, page: number, userId): Promise<any> {
    this.logger.log(
      `Finding all products for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [products, total] = await this.productRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile', 'category', 'jobChangeStage', 'job'],
    });
    this.logger.log(`Found ${total} products for userId: ${userId}`);

    return {
      data: products,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async createOne(createProductDto: CreateProductDto, userId: number) {
    this.logger.log(
      `Creating product for userId: ${userId} with data: ${JSON.stringify(createProductDto)}`,
    );
    const category = await this.findOneCategory(createProductDto.category);
    const job = await this.jobService.findOne(createProductDto.job);
    const jobChangeStage = await this.jobChangeStageService.findOne(
      createProductDto.jobChangeStage,
    );

    const product = await this.productRepository.create({
      title: createProductDto.title,
      content: createProductDto.content,
      description: createProductDto.description,
      thumbnail: createProductDto.thumbnail || null,
      price: createProductDto.price,
      detailImage: createProductDto.detailImage,
      productLink: createProductDto.productLink || null,
      productGeneralLink: createProductDto.productGeneralLink || null,
      user: { id: userId },
      category,
      jobChangeStage,
      job,
    });
    await this.productRepository.save(product);
    this.logger.log(`Product created with ID: ${product.id}`);
    return product;
  }

  async findOneCategory(categoryName: string) {
    this.logger.log(`Finding category with name: ${categoryName}`);
    const category = await this.productCategoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      this.logger.error('Category not found');
      throw new BadRequestException('category not found');
    }

    return category;
  }

  async findOne(productId: number) {
    this.logger.log(`Finding product with ID: ${productId}`);
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user', 'user.profile', 'category', 'jobChangeStage', 'job'],
    });

    if (!product) {
      this.logger.error('Product not found');
      throw new BadRequestException('there is no product with ID');
    }

    return product;
  }

  async findWithKeyword(keyword: string) {
    this.logger.log(`Finding products with keyword: ${keyword}`);
    if (!keyword || keyword.trim() === '') {
      this.logger.error('Keyword must be provided');
      throw new BadRequestException('Keyword must be provided');
    }

    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.content LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('product.title LIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('product.user', 'user')
      .getMany();

    if (products.length === 0) {
      this.logger.error('No products found matching the keyword');
      throw new BadRequestException('No products found matching the keyword');
    }

    return products;
  }

  async deleteOne(productId: number, userId: number) {
    this.logger.log(
      `Deleting product with ID: ${productId} for userId: ${userId}`,
    );
    const product = await this.findOne(productId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (product.user.id != userId || !isAdmin) {
      this.logger.error('User is not the owner or not an admin');
      throw new BadRequestException('user is now the owner for this product');
    }

    const result = await this.productRepository.delete({ id: productId });
    this.logger.log(`Product with ID: ${productId} deleted`);
    return result;
  }

  async addViewCount(productId: number) {
    this.logger.log(`Adding view count for product ID: ${productId}`);
    await this.productRepository
      .createQueryBuilder()
      .update()
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('id = :id', { id: productId })
      .execute();
    this.logger.log(`View count incremented for product ID: ${productId}`);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    productId: number,
    userId: number,
  ) {
    this.logger.log(
      `Updating product with ID: ${productId} for userId: ${userId} with data: ${JSON.stringify(updateProductDto)}`,
    );
    const product = await this.findOne(productId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (product.user.id != userId || !isAdmin) {
      this.logger.error('User is not the owner or not an admin');
      throw new BadRequestException('user is now the owner for this product');
    }

    const updatedFields: Partial<Product> = {
      ...(updateProductDto.title && { title: updateProductDto.title }),
      ...(updateProductDto.content && { content: updateProductDto.content }),
      ...(updateProductDto.description && {
        description: updateProductDto.description,
      }),
      ...(updateProductDto.thumbnail && {
        thumbnail: updateProductDto.thumbnail,
      }),
      ...(updateProductDto.productLink && {
        productLink: updateProductDto.productLink,
      }),
      ...(updateProductDto.productGeneralLink && {
        productGeneralLink: updateProductDto.productGeneralLink,
      }),
      ...(updateProductDto.price && {
        price: updateProductDto.price,
      }),
      ...(updateProductDto.detailImage && {
        detailImage: updateProductDto.detailImage,
      }),
      ...(updateProductDto.discount && {
        discount: updateProductDto.discount,
      }),
    };

    if (updateProductDto.category) {
      const category = await this.productCategoryRepository.findOne({
        where: { name: updateProductDto.category },
      });
      if (!category) {
        this.logger.error('Category not found');
        throw new BadRequestException('Category not found');
      }
      updatedFields.category = category;
    }

    if (updateProductDto.job) {
      const job = await this.jobService.findOne(updateProductDto.job);
      if (!job) {
        this.logger.error('Job not found');
        throw new BadRequestException('Job not found');
      }
      updatedFields.job = job;
    }

    if (updateProductDto.jobChangeStage) {
      updatedFields.jobChangeStage = await this.jobChangeStageService.findOne(
        updateProductDto.jobChangeStage,
      );
    }

    // 객체 병합
    Object.assign(product, updatedFields);

    // 변경사항 저장
    await this.productRepository.save(product);
    this.logger.log(`Product with ID: ${productId} updated`);
    return product;
  }

  async getSavedProduct(userId: number, take: number, page: number) {
    this.logger.log(
      `Getting saved products for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [savedProducts, total] =
      await this.savedProductRepository.findAndCount({
        where: { user: { id: userId } },
        take,
        skip: (page - 1) * take,
        relations: [
          'product',
          'product.user',
          'product.user.profile',
          'product.category',
          'product.jobChangeStage',
          'product.job',
        ],
      });

    const products = await Promise.all(
      savedProducts.map(async (savedProduct) => {
        const isSaved = true;
        const savedUserCount = await this.getSavedUserCount(
          savedProduct.product.id,
        );
        return {
          ...savedProduct.product,
          isSaved,
          savedUserCount,
        };
      }),
    );

    this.logger.log(
      `Found ${products.length} saved products for userId: ${userId}`,
    );
    return {
      data: products,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async saveProduct(userId: number, productId: number) {
    const user = await this.userService.findOne(userId);
    const product = await this.findOne(productId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const savedProduct = await this.savedProductRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (savedProduct) {
      throw new BadRequestException('User already saved this product');
    }

    await this.savedProductRepository.save({
      user,
      product,
    });

    this.logger.log(
      `Product with ID: ${productId} saved for userId: ${userId}`,
    );
  }

  async unsaveProduct(userId: number, productId: number) {
    this.logger.log(
      `Unsaving product with ID: ${productId} for userId: ${userId}`,
    );
    const result = await this.savedProductRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
    this.logger.log(
      `Product with ID: ${productId} unsaved for userId: ${userId}`,
    );
    return result;
  }

  async getAllCart(userId: number, take: number, page: number) {
    this.logger.log(
      `Getting all cart items for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
    });
    this.logger.log(`Found ${total} cart items for userId: ${userId}`);

    return {
      data: carts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async getBeforeCart(userId: number, take: number, page: number) {
    this.logger.log(
      `Getting before cart items for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId }, isBought: false },
      take,
      skip: (page - 1) * take,
    });
    this.logger.log(`Found ${total} before cart items for userId: ${userId}`);

    return {
      data: carts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async getAfterCart(userId: number, take: number, page: number) {
    this.logger.log(
      `Getting after cart items for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId }, isBought: true },
      take,
      skip: (page - 1) * take,
    });
    this.logger.log(`Found ${total} after cart items for userId: ${userId}`);

    return {
      data: carts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async addCart(productId: number, userId: number) {
    this.logger.log(
      `Adding product with ID: ${productId} to cart for userId: ${userId}`,
    );
    await this.cartRepository.save({
      user: { id: userId },
      product: { id: productId },
      expiredIn: new Date().getTime() + 3 * 28 * 24 * 60 * 60 * 1000,
    });

    const cartItem = await this.cartRepository.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });
    this.logger.log(
      `Product with ID: ${productId} added to cart for userId: ${userId}`,
    );
    return cartItem;
  }

  async removeCart(productId: number, userId: number) {
    this.logger.log(
      `Removing product with ID: ${productId} from cart for userId: ${userId}`,
    );
    const result = await this.cartRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
    this.logger.log(
      `Product with ID: ${productId} removed from cart for userId: ${userId}`,
    );
    return result;
  }

  async findAllCategories() {
    this.logger.log('Finding all categories');
    const categories = await this.productCategoryRepository.find();
    this.logger.log(`Found ${categories.length} categories`);
    return categories;
  }

  async createCategory(
    userId: number,
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    this.logger.log(
      `Creating category for userId: ${userId} with data: ${JSON.stringify(createProductCategoryDto)}`,
    );
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.error('User is not the admin');
      throw new BadRequestException('user is not the admin');
    }

    const newCategory = this.productCategoryRepository.create({
      name: createProductCategoryDto.name,
    });
    await this.productCategoryRepository.save(newCategory);
    this.logger.log(`Category created with name: ${newCategory.name}`);
    return newCategory;
  }

  async updateCategory(
    userId: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
    categoryId: number,
  ) {
    this.logger.log(
      `Updating category with ID: ${categoryId} for userId: ${userId} with data: ${JSON.stringify(updateProductCategoryDto)}`,
    );
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.error('User is not the admin');
      throw new BadRequestException('user is not the admin');
    }
    const category = await this.productCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      this.logger.error('Category not found');
      throw new BadRequestException('category not found');
    }

    if (updateProductCategoryDto.name)
      category.name = updateProductCategoryDto.name;

    await this.productCategoryRepository.save(category);
    this.logger.log(`Category with ID: ${categoryId} updated`);
    return category;
  }

  async deleteCategory(userId: number, categoryId: number) {
    this.logger.log(
      `Deleting category with ID: ${categoryId} for userId: ${userId}`,
    );
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) {
      this.logger.error('User is not the admin');
      throw new BadRequestException('user is not the admin');
    }

    const result = await this.productCategoryRepository.delete({
      id: categoryId,
    });
    this.logger.log(`Category with ID: ${categoryId} deleted`);
    return result;
  }

  async findAllSavedProduct(userId: number, take: number, page: number) {
    this.logger.log(
      `Finding all saved products for userId: ${userId} with take: ${take}, page: ${page}`,
    );
    const [savedProducts, total] =
      await this.savedProductRepository.findAndCount({
        where: {
          user: { id: userId },
        },
        take,
        skip: (page - 1) * take,
        relations: ['user', 'product'],
      });
    this.logger.log(`Found ${total} saved products for userId: ${userId}`);

    return {
      data: savedProducts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async isProductSavedByUser(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    this.logger.log(
      `Checking if product with ID: ${productId} is saved by userId: ${userId}`,
    );
    const savedProduct = await this.savedProductRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    this.logger.log(
      `Product with ID: ${productId} is ${savedProduct ? '' : 'not '}saved by userId: ${userId}`,
    );
    return !!savedProduct;
  }

  async getSavedUserCount(productId: number): Promise<number> {
    this.logger.log(`Getting saved user count for product ID: ${productId}`);
    const count = await this.savedProductRepository.count({
      where: { product: { id: productId } },
    });
    this.logger.log(`Product with ID: ${productId} is saved by ${count} users`);
    return count;
  }
}
