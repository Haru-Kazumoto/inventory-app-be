import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiQuery } from '@nestjs/swagger';

export function DeleteRequestDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'id',
      description: 'Id request item for delete',
      type: Number,
      required: true,
    }),
    ApiBadRequestResponse({
      description: 'Bad request response',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Id user tidak ditemukan' },
        },
      },
    }),
  );
}
