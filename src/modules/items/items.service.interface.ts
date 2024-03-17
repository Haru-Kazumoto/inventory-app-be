import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import {  GetAllItemResponse } from './dto/response-item.dto';

export interface IItemsService {
  createOne(body: CreateItemDto): Promise<Item>;
  findMany(
    category: ItemCategory,
    classId: number,
    itemName: string,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  findAllItemCodeByItemName(
    itemName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  findAllItems(filterCategory: ItemCategory): Promise<Item[]>;
  updateOne(id: number, body: UpdateItemDto): Promise<Item>;
  deleteById(id: number): Promise<void>;
}
