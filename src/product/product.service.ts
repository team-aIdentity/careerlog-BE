import { BadRequestException, Injectable } from '@nestjs/common';
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
    const [products, total] = await this.productRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile'],
    });

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
    const [products, total] = await this.productRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
      relations: ['user', 'user.profile'],
    });

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
      user: { id: userId },
      category,
      jobChangeStage,
      job,
    });
    await this.productRepository.save(product);
    return product;
  }

  async findOneCategory(categoryName: string) {
    const category = await this.productCategoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) throw new BadRequestException('category not found');

    return category;
  }

  async findOne(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user', 'user.userRoles', 'user.userRoles.role'],
    });

    if (!product) {
      throw new BadRequestException('there is no product with ID');
    }

    return product;
  }

  async findWithKeyword(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('Keyword must be provided');
    }

    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.content LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('product.title LIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('product.user', 'user')
      .getMany();

    if (products.length === 0) {
      throw new BadRequestException('No products found matching the keyword');
    }

    return products;
  }

  async deleteOne(productId: number, userId: number) {
    const product = await this.findOne(productId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (product.user.id != userId || isAdmin)
      throw new BadRequestException('user is now the owner for this product');

    return await this.productRepository.delete({ id: productId });
  }

  async addViewCount(productId: number) {
    await this.productRepository
      .createQueryBuilder()
      .update()
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('id = :id', { id: productId })
      .execute();
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    productId: number,
    userId: number,
  ) {
    const product = await this.findOne(productId);
    const isAdmin = await this.userService.isAdmin(userId);

    if (product.user.id != userId || isAdmin)
      throw new BadRequestException('user is now the owner for this product');

    const updatedFields: Partial<Product> = {
      ...(updateProductDto.title && { title: updateProductDto.title }),
      ...(updateProductDto.content && { content: updateProductDto.content }),
      ...(updateProductDto.description && {
        content: updateProductDto.description,
      }),
      ...(updateProductDto.thumbnail && {
        thumbnail: updateProductDto.thumbnail,
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
        throw new BadRequestException('Category not found');
      }
      updatedFields.category = category;
    }

    if (updateProductDto.job) {
      const job = await this.jobService.findOne(updateProductDto.job);
      if (!job) {
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

    return product;
  }

  async saveProduct(userId: number, productId: number) {
    const savedProduct = await this.savedProductRepository.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });

    if (savedProduct) {
      throw new BadRequestException('user already saved this product');
    }

    await this.savedProductRepository.save({
      user: { id: userId },
      product: { id: productId },
    });
  }

  async unsaveProduct(userId: number, productId: number) {
    return await this.savedProductRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
  }

  async getAllCart(userId: number, take: number, page: number) {
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId } },
      take,
      skip: (page - 1) * take,
    });

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
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId }, isBought: false },
      take,
      skip: (page - 1) * take,
    });

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
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { user: { id: userId }, isBought: true },
      take,
      skip: (page - 1) * take,
    });

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
    await this.cartRepository.save({
      user: { id: userId },
      product: { id: productId },
      expiredIn: new Date().getTime() + 3 * 28 * 24 * 60 * 60 * 1000,
    });

    return this.cartRepository.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });
  }

  async removeCart(productId: number, userId: number) {
    return await this.cartRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
  }

  async findAllCategories() {
    return await this.productCategoryRepository.find();
  }

  async createCategory(
    userId: number,
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');

    const newCategory = this.productCategoryRepository.create({
      name: createProductCategoryDto.name,
    });
    await this.productCategoryRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(
    userId: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
    categoryId: number,
  ) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');
    const category = await this.productCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new BadRequestException('category not found');

    if (updateProductCategoryDto.name)
      category.name = updateProductCategoryDto.name;

    this.productCategoryRepository.save(category);
    return category;
  }

  async deleteCategory(userId: number, categoryId: number) {
    const isAdmin = this.userService.isAdmin(userId);
    if (!isAdmin) throw new BadRequestException('user is not the admin');

    return await this.productCategoryRepository.delete({ id: categoryId });
  }
}
