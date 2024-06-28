import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateItemDto, CreateItemDtoWithFile } from '../dto/create-item.dto';

export function CreateItemDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Creating one item record',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'number', example: 200 },
          message: { type: 'string', example: 'OK' },
          data: { type: 'object', example: { item: {} } },
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
            example: ['itemname cannot be empty', 'email pattern not valid'],
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
      type: CreateItemDtoWithFile,
      description: 'DTO Structure response from create one item',
    })
  );
}
