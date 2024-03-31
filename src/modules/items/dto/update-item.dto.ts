import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ItemCategory } from 'src/enums/item_category.enum';
import { ItemType } from 'src/enums/item_type.enum';
import { StatusItem } from 'src/enums/status_item.enum';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mikrotik' })
  public name: string; //items name

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'MKT-123456789' })
  public item_code?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(StatusItem)
  @ApiProperty({ example: StatusItem.TERSEDIA })
  public status_item: StatusItem; //lookup type STATUS

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'BOSDA' })
  public source_fund: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ItemCategory)
  @ApiProperty({ example: ItemCategory.BARANG_HABIS_PAKAI })
  public category_item: ItemCategory;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1000000 })
  public unit_price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  public class_id: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ItemType)
  @ApiProperty({ example: ItemType.NON_ATK })
  public item_type: ItemType;
}
