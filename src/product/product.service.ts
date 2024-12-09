import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { SavedProduct } from './entity/savedProduct.entity';
import { Cart } from './entity/cart.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SavedProduct)
    private savedProductRepository: Repository<SavedProduct>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async findAll(take: number, page: number): Promise<any> {
    const [products, total] = await this.productRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['user'],
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
      relations: ['user'],
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
    const product = await this.productRepository.create({
      ...createProductDto,
      user: { id: userId },
    });
    await this.productRepository.save(product);
    return product;
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

    if (updateProductDto.title !== undefined)
      product.title = updateProductDto.title;

    if (updateProductDto.content !== undefined)
      product.content = updateProductDto.content;

    if (updateProductDto.thumbnail !== undefined)
      product.thumbnail = updateProductDto.thumbnail;

    if (updateProductDto.price !== undefined)
      product.price = updateProductDto.price || product.price;

    if (updateProductDto.detailImage !== undefined)
      product.detailImage = updateProductDto.detailImage;

    if (updateProductDto.discount !== undefined)
      product.discount = updateProductDto.discount || null;

    this.productRepository.save(product);
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
}
