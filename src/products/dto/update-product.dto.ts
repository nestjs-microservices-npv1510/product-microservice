import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString } from 'class-validator';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

// Bước 1: Kết hợp 2 DTO thành 1 DTO mới
const CombinedDto = IntersectionType(CreateProductDto, MessagePayloadDto);

export class UpdateProductDto extends PartialType(CombinedDto) {
  @IsOptional()
  @IsString()
  public id?: number;
}
