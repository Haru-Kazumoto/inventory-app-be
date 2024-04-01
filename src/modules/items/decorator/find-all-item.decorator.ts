import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { Item } from '../entities/item.entity';
import { ItemCategory } from 'src/enums/item_category.enum';

export function FindAllItemDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get all items',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: { type: 'array', example: { items: [{}] } },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    }),
    ApiPaginatedResponse(Item),
    ApiQuery({
      name: 'category',
      description: 'Category of item',
      required: false,
      enum: ItemCategory,
    }),
    ApiQuery({
      name: 'status',
      description: 'Status of item',
      required: false,
    }),
    ApiQuery({
      name: 'name',
      description: 'Name of item',
      required: false,
    }),
    ApiQuery({
      name: 'classId',
      description: 'Class Id of class item',
      required: false,
      type: Number,
    }),
  );
}
