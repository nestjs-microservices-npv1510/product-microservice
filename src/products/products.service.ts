import { Injectable, OnModuleInit, Logger, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';

import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RpcException } from '@nestjs/microservices';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  // public products: Product[] = [];
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connection established');
  }

  async create(createProductDto: CreateProductDto) {
    console.log('products service create');
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findMany(paginationDto: PaginationDto) {
    const { page = 1, limit = 3 } = paginationDto;

    const products = await this.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalItems = await this.product.count();
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages)
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Page exceeds total pages',

        // others data
        page,
        totalPages,
      };

    return {
      data: products,
      metaData: {
        page,
        totalPages,
        totalItems,
      },
    };
  }

  async findProductById(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });

    if (!product)
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id #${id} not found`,
      };

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findProductById(id);

    return await this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async delete(id: number) {
    await this.findProductById(id);
    return await this.product.update({
      where: { id: id },
      data: { available: false },
    });
  }

  async validateOrderProducts(productIds: number[]) {
    const validProducts = await this.product.findMany({
      where: {
        id: { in: productIds },
        available: true,
      },
    });

    if (productIds.length !== validProducts.length)
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Some products is not valid !',
      };

    return validProducts;
  }
}
