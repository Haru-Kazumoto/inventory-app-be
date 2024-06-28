import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RequestStatus } from 'src/enums/request_status.enum';

export function FindOneRequestDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get one request item by id',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: { type: 'array', example: { request_item: {} } },
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
    ApiQuery({
      name: 'request_item_id',
      description: 'Request item id',
      required: false,
    }),
  );
}
