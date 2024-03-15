import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusExit } from 'src/enums/status_exit.enum';
import { CreateItemDetailsDto } from 'src/modules/item_details/dtos/item_details.dto';
import { ItemDetails } from 'src/modules/item_details/entities/item_details.entity';

export class CreateExitLogDto {
  @ApiProperty({ example: 'Haru Kazumoto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '088976972688' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'X TKJ 4' })
  @IsString()
  @IsNotEmpty()
  major_class: string;

  @ApiProperty({ example: ItemCategory.BARANG_HABIS_PAKAI })
  @IsEnum(ItemCategory)
  @IsNotEmpty()
  item_category: ItemCategory;

  @ApiProperty({ example: StatusExit.PEMINJAMAN })
  @IsEnum(StatusExit)
  @IsNotEmpty()
  status_exit: StatusExit;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({
    type: [ItemDetails],
    example: [
      {
        item_id: 1,
        category_item: ItemCategory.BARANG_HABIS_PAKAI,
        total_exit_item: 5,
      },
      {
        item_id: 2,
        category_item: ItemCategory.BARANG_HABIS_PAKAI,
        total_exit_item: 5,
      },
    ] as CreateItemDetailsDto[],
  })
  @IsArray()
  @IsNotEmpty()
  item_details: CreateItemDetailsDto[];
}

export class UpdateExitLogDto {
  @ApiProperty({ example: 'Haru Kazumoto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '088976972688' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'X TKJ 4' })
  @IsString()
  @IsNotEmpty()
  major_class: string;

  @ApiProperty({ example: ItemCategory.BARANG_HABIS_PAKAI })
  @IsEnum(ItemCategory)
  @IsNotEmpty()
  item_category: ItemCategory;

  @ApiProperty({ example: StatusExit.PEMINJAMAN })
  @IsEnum(StatusExit)
  @IsNotEmpty()
  status_exit: StatusExit;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({
    type: [ItemDetails],
    example: [{ item_id: 1 }, { item_id: 1 }],
  })
  @IsArray()
  @IsNotEmpty()
  item_details: CreateItemDetailsDto[];
}
