import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ItemCategory } from 'src/enums/item_category.enum';

export function GetAllItemsDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'item-category',
      description: 'Find all items with filtering by item category',
      enum: ItemCategory,
      required: false,
    }),
  );
}
