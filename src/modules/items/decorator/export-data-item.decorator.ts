import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ItemCategory } from 'src/enums/item_category.enum';
import { Major } from 'src/enums/majors.enum';

export function ExportDataItemDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'item_category',
      description: 'Mengambil data berdasarkan kategory dari barang',
      enum: ItemCategory,
      required: true,
    }),
    ApiQuery({
      name: 'major',
      description: 'Mengambil data berdasarkan tempat barang berada',
      enum: Major,
      required: true,
    }),
  );
}
