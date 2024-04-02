import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

export function CountItemByMajorDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get count items by major',
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
  );
}
