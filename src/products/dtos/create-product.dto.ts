import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

export class CreateProductDto extends PartialType(MessagePayloadDto) {
  @IsString()
  public name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  public price: number;

  @IsString()
  @IsOptional()
  public description: string;
}
