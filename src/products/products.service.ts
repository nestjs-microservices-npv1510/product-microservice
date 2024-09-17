import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { PrismaClient } from '@prisma/client';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Payload, RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  // public products: Product[] = [];
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connection established');
  }

  create(@Payload() createProductDto: CreateProductDto) {
    // console.log(createProductDto);
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDTO) {
    // return this.products;

    const { page = 1, limit = 3 } = paginationDto;
    const totalItems = await this.product.count();

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metaData: {
        page: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });

    if (!product)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Product with id #${id} not found`,
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return await this.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // await this.product.delete({ where: { id: id } });

    return await this.product.update({
      where: { id: id },
      data: { available: false },
    });
  }

  async validateProducts(productIds: number[]) {
    const validProducts = await this.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (productIds.length !== validProducts.length)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Some products is not valid !',
      });

    return validProducts;
  }
}
