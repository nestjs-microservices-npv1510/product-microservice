import { PartialType } from '@nestjs/mapped-types';
import { ArrayMinSize, IsArray } from 'class-validator';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

export class ValidateOrderProductsDto extends PartialType(MessagePayloadDto) {
  @IsArray()
  @ArrayMinSize(1)
  productIds: number[];
}
