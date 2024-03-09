import { applyDecorators } from '@nestjs/common';
import {
    ApiInternalServerErrorResponse,
    ApiOkResponse
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { User } from '../entities/user.entity';

export function FindAllUserDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get all users',
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
    ApiPaginatedResponse(User),
  );
}
