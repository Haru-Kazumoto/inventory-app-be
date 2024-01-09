import { Injectable } from '@nestjs/common';
import { CreateItemRequestDto } from './dto/create-item-request.dto';
import { UpdateItemRequestDto } from './dto/update-item-request.dto';

@Injectable()
export class ItemRequestService {
  create(createItemRequestDto: CreateItemRequestDto) {
    return 'This action adds a new itemRequest';
  }

  findAll() {
    return `This action returns all itemRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemRequest`;
  }

  update(id: number, updateItemRequestDto: UpdateItemRequestDto) {
    return `This action updates a #${id} itemRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemRequest`;
  }
}
