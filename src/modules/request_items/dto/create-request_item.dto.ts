import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ItemType } from 'src/enums/item_type.enum';

export class CreateRequestItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mikrotik' })
  public item_name: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
  @ApiProperty({ example: 10 })
  public total_request: number;

  @IsEnum(ItemType)
  @IsNotEmpty()
  @ApiProperty({ example: ItemType.NON_ATK })
  public item_type: ItemType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Kekurangan Unit' })
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
  @ApiProperty({ example: 1 })
  public class_id: number;
}

export class CreateRequestItemDtoWithFile extends CreateRequestItemDto{
  @ApiProperty({type: 'string', format: 'binary', required: true})
  public request_image: any;
}
