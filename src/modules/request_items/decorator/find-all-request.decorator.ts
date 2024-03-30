import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { RequestItem } from '../entities/request_item.entity';
import { ItemType } from 'src/enums/item_type.enum';

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
    }),
    ApiQuery({
      name: 'class',
      description: 'Class of item',
      required: false,
    }),
    ApiQuery({
      name: "item_type",
      description:"type of item",
      required: false,
      enum: ItemType
    }),
    ApiPaginatedResponse(RequestItem),
  );
}
