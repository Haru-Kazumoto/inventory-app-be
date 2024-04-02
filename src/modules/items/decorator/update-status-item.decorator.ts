import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function UpdateStatusItemDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'id-item',
      description: 'Id item to update',
      type: Number,
      required: true,
    }),
  );
}
