import { Controller, Logger, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ValidateOrderProductsDto } from './dtos/validate-order-products.dto';
// import { CatchAsyncErrors } from './decorators/catchAsync.decorator';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger('ProductsController');
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  // @CatchAsyncErrors()
  async create(@Payload() createProductDto: CreateProductDto) {
    console.log('products controller create');

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
      await this.productsService.findMany(paginationDto);

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
    console.log('products ms controller update');
    const { id, metadata, ...data } = updateProductDto;
    const product = await this.productsService.update(+id, data);
    return {
      status: 'success',
      product,
    };
  }

  @MessagePattern('products.delete')
  async delete(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @MessagePattern('products.validate-order-products')
  // @CatchAsyncErrors()
  async validateOrderProducts(
    @Payload() validateOrderProductsDto: ValidateOrderProductsDto,
  ) {
    // console.log('validateOrderProducts');
    // console.log(validateOrderProductsDto);
    // return validateOrderProductsDto;
    const { metadata, productIds } = validateOrderProductsDto;
    return {
      status: 'success',
      products: await this.productsService.validateOrderProducts(productIds),
    };

    // return this.productsService.validateOrderProducts(productIds);
  }
}
