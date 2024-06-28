import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
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

  @ApiProperty({ example: ItemCategory.BARANG_TIDAK_HABIS_PAKAI })
  @IsEnum(ItemCategory)
  @IsNotEmpty()
  item_category: ItemCategory;

  @ApiProperty({ example: 'Lab - 1' })
  @IsString()
  exit_class: string;

  @ApiProperty({ example: StatusExit.PRODUKTIF })
  @IsEnum(StatusExit)
  @IsNotEmpty()
  status_exit: StatusExit;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
  @IsNotEmpty()
  total: number;

  @ApiProperty({example: [{ item_id: 1 }], type: [CreateItemDetailsDto]})
  @IsArray()
  @Type(() => CreateItemDetailsDto)
  @IsNotEmpty()
  item_details: CreateItemDetailsDto[];

  @ApiProperty({type: 'string', format: 'binary', required: true})
  exit_image?: any;
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

  @ApiProperty({ example: 'Lab - 1' })
  @IsString()
  exit_class: string;

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
