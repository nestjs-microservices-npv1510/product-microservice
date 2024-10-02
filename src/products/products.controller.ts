import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ValidateOrderProductsDto } from './dto/validate-order-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  async create(@Payload() createProductDto: CreateProductDto) {
    const { metadata, ...data } = createProductDto;
    const product = await this.productsService.create(data);

    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('products.findMany')
  async findMany(@Payload() paginationDto: PaginationDto) {
    const { data: products, metaData } =
      await this.productsService.findAll(paginationDto);

    return {
      status: 'success',
      metaData,
      products,
    };
  }

  @MessagePattern('products.findById')
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findProductById(id);
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('products.update')
  async update(@Payload() updateProductDto: UpdateProductDto) {
    // return updateProductDto;

    const { id, metadata, ...data } = updateProductDto;
    const product = await this.productsService.update(+id, data);
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('products.delete')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @MessagePattern('products.validate-order-products')
  validateOrderProducts(
    @Payload() validateOrderProductsDto: ValidateOrderProductsDto,
  ) {
    // console.log('validateOrderProducts');
    // console.log(validateOrderProductsDto);
    // return validateOrderProductsDto;
    const { metadata, productIds } = validateOrderProductsDto;
    return this.productsService.validateOrderProducts(productIds);
  }
}
