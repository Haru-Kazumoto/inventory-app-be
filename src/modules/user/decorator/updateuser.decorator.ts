import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/updateuser.dto';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success to update one record of user',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'SUCCESS' },
          data: { type: 'object', example: { user: {} } },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'There is something bad happend to request',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Not valid type' },
          data: { type: 'object', example: null },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error response',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    }),
    ApiBody({
      type: UpdateUserDto,
      description: 'DTO Request for update',
      required: true,
    }),
    ApiQuery({
      name: 'id',
      description: 'Id user for update',
      type: Number,
      required: true,
    }),
  );
}
