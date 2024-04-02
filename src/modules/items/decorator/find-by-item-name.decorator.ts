import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { Item } from '../entities/item.entity';

export function FindByItemNameDecorator() {
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
  );
}
