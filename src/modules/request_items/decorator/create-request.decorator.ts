import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateRequestItemDto } from '../dto/create-request_item.dto';

export function CreateRequestDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success create request',
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
            example: ['item name is required'],
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
    ApiBody({
      type: CreateRequestItemDto,
      description: 'DTO Structure Response',
    }),
  );
}
