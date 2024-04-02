import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateItemDto } from '../dto/update-item.dto';

export function UpdateItemDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success to update one record of item',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'SUCCESS' },
          data: { type: 'object', example: { item: {} } },
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
      type: UpdateItemDto,
      description: 'DTO Request for update',
      required: true,
    }),
    ApiQuery({
      name: 'id',
      description: 'Id item for update',
      type: Number,
      required: true,
    }),
  );
}
