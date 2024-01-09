import { PartialType } from '@nestjs/mapped-types';
import { CreateItemRequestDto } from './create-item-request.dto';

export class UpdateItemRequestDto extends PartialType(CreateItemRequestDto) {}
