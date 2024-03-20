import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/createuser.dto';

export function ApiCreateOneUser() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Record has successfully created',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: { type: 'object', example: { user: {} } },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'array',
            example: ['username cannot be empty', 'email pattern not valid'],
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden resource or ability',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Not Authenticated' },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Internal server error' },
          status: { type: 'number', example: 500 },
        },
      },
    }),
    ApiBody({ type: CreateUserDto, description: 'DTO Structure Response' }),
  );
}
