import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';
import { RequestStatus } from 'src/enums/request_status.enum';

export function FindAllRequestDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success get all request items',
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
    ApiQuery({
      name: 'status',
      description: 'Status of item',
      required: false,
      enum: RequestStatus,
    }),
    ApiQuery({
      name: 'major',
      description: 'Major of item',
      required: false,
      enum: Major,
    }),
    ApiQuery({
      name: 'item_type',
      description: 'type of item',
      required: false,
      enum: ItemType,
    }),
  );
}
