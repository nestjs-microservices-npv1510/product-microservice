import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO as PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('test.throw.exception.from.service')
  testThrowExceptionFromService(
    @Payload('message') message: string,
    @Payload('status') status: number,
  ) {
    return this.productsService.testThrowExceptionFromService(status, message);
  }

  @MessagePattern('create_product')
  async create(@Payload() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('find_products')
  async findAll(@Payload() paginationDto: PaginationDto) {
    const { data: products, metaData } =
      await this.productsService.findAll(paginationDto);

    return {
      status: 'success',
      metaData,
      products,
    };
  }

  @MessagePattern('find_a_product')
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('update_product')
  async update(@Payload() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(
      +updateProductDto.id,
      updateProductDto,
    );
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('delete_product')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern('validate_products')
  validateProducts(@Payload() productIds: number[]) {
    return this.productsService.validateProducts(productIds);
  }
}
