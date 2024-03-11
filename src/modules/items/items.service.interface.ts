import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { Request } from 'express';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusItem } from 'src/enums/status_item.enum';

export interface IItemsService {
  createOne(body: CreateItemDto): Promise<Item>;
  findMany(
    category: ItemCategory,
    className: string,
    itemName: string,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  findAllItemCodeByItemName(
    itemName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  updateOne(id: number, body: UpdateItemDto): Promise<Item>;
  deleteById(id: number): Promise<void>;
}
