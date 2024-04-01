import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { RequestItem } from '../entities/request_item.entity';

export function RequestItemsByStatusDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get all request items by status pending',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: { type: 'array', example: { users: [{}] } },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    }),
    ApiPaginatedResponse(RequestItem),
  );
}
