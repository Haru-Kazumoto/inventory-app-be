import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ItemStatusCondition } from 'src/enums/item_status_condition.enum';
import { Major } from 'src/enums/majors.enum';

export function ItemsStatusConditionDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get items by status',
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
    ApiQuery({
      name: 'major',
      description: 'Major of item',
      required: false,
      enum: Major,
    }),
    ApiQuery({
      name: 'status',
      description: 'Status of item',
      required: false,
      enum: ItemStatusCondition,
    }),
  );
}
