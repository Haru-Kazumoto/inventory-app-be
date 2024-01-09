import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemRequestService } from './item-request.service';
import { CreateItemRequestDto } from './dto/create-item-request.dto';
import { UpdateItemRequestDto } from './dto/update-item-request.dto';

@Controller('item-request')
export class ItemRequestController {
  constructor(private readonly itemRequestService: ItemRequestService) {}

  @Post()
  create(@Body() createItemRequestDto: CreateItemRequestDto) {
    return this.itemRequestService.create(createItemRequestDto);
  }

  @Get()
  findAll() {
    return this.itemRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemRequestDto: UpdateItemRequestDto) {
    return this.itemRequestService.update(+id, updateItemRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemRequestService.remove(+id);
  }
}
